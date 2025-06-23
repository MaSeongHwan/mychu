from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict

from server.core.database import get_db
from server.models.asset import Asset
from server.core.services.contents_recommendation import get_similar_contents_hybrid_filtered

router = APIRouter()

class SimilarContentItem(BaseModel):
    """Schema for similar content recommendation item"""
    rank: int
    idx: int
    content_nm: str
    similarity: float
    
    # Additional Asset fields
    asset_nm: str
    unique_asset_id: str
    super_asset_nm: str
    is_adult: bool
    is_movie: bool
    is_drama: bool
    is_main: bool
    poster_path: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class SimilarContentResponse(BaseModel):
    """Schema for similar content recommendation response"""
    items: List[SimilarContentItem]
    
    model_config = ConfigDict(from_attributes=True)

@router.get("/recommendation/similar/{asset_idx}", response_model=SimilarContentResponse, tags=["recommendation"])
async def get_similar_content(
    asset_idx: int,
    db: Session = Depends(get_db),
    top_n: int = Query(10, ge=1, le=50),
    include_adult: bool = False
):
    """
    하이브리드 특성(장르, 감정, 줄거리 요약)을 기반으로 유사한 콘텐츠 추천을 제공
    
    파라미터:
    - asset_idx: 유사한 콘텐츠를 찾고자 하는 기준 콘텐츠의 ID
    - top_n: 반환할 추천 콘텐츠의 개수 (기본값: 10, 최대: 50)
    - include_adult: 성인 콘텐츠를 추천 결과에 포함할지 여부 (기본값: False)
    
    필터:
    - 결과는 is_main=True인 콘텐츠만 포함합니다
    
    응답 내용:
    - rank: 유사도 기반 순위
    - idx: 콘텐츠 ID
    - content_nm: 콘텐츠 이름 (기존 필드)
    - similarity: 유사도 점수 (0-1 사이 값)
    - asset_nm: 콘텐츠 명칭
    - unique_asset_id: 고유 자산 ID
    - super_asset_nm: 상위 자산 명칭
    - is_adult: 성인 콘텐츠 여부
    - is_movie: 영화 여부
    - is_drama: 드라마 여부 
    - is_main: 메인 콘텐츠 여부
    - poster_path: 포스터 이미지 경로
    """
    try:
        import logging
        logger = logging.getLogger("uvicorn")
        logger.info(f"Processing recommendation for asset_idx={asset_idx}, top_n={top_n}")
        
        # Check if asset exists
        target_asset = db.query(Asset).filter(Asset.idx == asset_idx).first()
        if not target_asset:
            logger.warning(f"Asset with ID {asset_idx} not found in database")
            raise HTTPException(status_code=404, detail=f"Asset with ID {asset_idx} not found")
        
        logger.info(f"Found target asset: {target_asset.asset_nm}")
        
        # Get all content mappings from database - limit to a reasonable number if very large
        assets = db.query(Asset).all()
        logger.info(f"Retrieved {len(assets)} assets from database")
        
        # Filter assets by is_main if required
        main_assets = [asset for asset in assets if asset.is_main == True]
        logger.info(f"Filtered to {len(main_assets)} main assets")
        
        # Check if we have any main assets
        if not main_assets:
            # Return empty results rather than error
            logger.warning("No main assets found, returning empty results")
            return SimilarContentResponse(items=[])
        
        # Create mappings
        content_indices = {asset.idx: i for i, asset in enumerate(main_assets)}
        content_ids = {i: asset.idx for i, asset in enumerate(main_assets)}
        content_names = {i: asset.asset_nm for i, asset in enumerate(main_assets)}
        is_main_map = {asset.idx: asset.is_main for asset in main_assets}
        is_adult_map = {asset.idx: 0 if not asset.is_adult else 1 for asset in main_assets}
        
        # Create additional mappings for extended response
        asset_details = {}
        for asset in main_assets:
            asset_details[asset.idx] = {
                "asset_nm": asset.asset_nm,
                "unique_asset_id": asset.unique_asset_id or "",
                "super_asset_nm": asset.super_asset_nm or "",
                "is_adult": asset.is_adult or False,
                "is_movie": asset.is_movie or False,
                "is_drama": asset.is_drama or False,
                "is_main": asset.is_main or False,
                "poster_path": asset.poster_path or ""
            }
        
        # Check if target asset is in our embeddings
        if asset_idx not in content_indices:
            logger.warning(f"Asset {asset_idx} not found in filtered main assets")
            # For this case, return empty results instead of error
            dummy_item = {
                "rank": 1,
                "idx": asset_idx,
                "content_nm": target_asset.asset_nm,
                "similarity": 1.0,
                "asset_nm": target_asset.asset_nm,
                "unique_asset_id": target_asset.unique_asset_id or "",
                "super_asset_nm": target_asset.super_asset_nm or "",
                "is_adult": target_asset.is_adult or False,
                "is_movie": target_asset.is_movie or False,
                "is_drama": target_asset.is_drama or False,
                "is_main": target_asset.is_main or False,
                "poster_path": target_asset.poster_path or ""
            }
            return SimilarContentResponse(items=[SimilarContentItem(**dummy_item)])
        
        target_idx = content_indices[asset_idx]
        logger.info(f"Target idx in embedding space: {target_idx}")
        
        # Get recommendations
        basic_results = get_similar_contents_hybrid_filtered(
            target_idx,
            content_ids,
            content_names,
            is_main_map,
            is_adult_map,
            top_n
        )
        
        logger.info(f"Got {len(basic_results)} recommendation results")
        
        # Enhance the results with additional asset details
        enhanced_results = []
        for item in basic_results:
            asset_id = item["idx"]
            details = asset_details.get(asset_id, {})
            
            enhanced_item = {
                **item,  # Include original fields (rank, idx, content_nm, similarity)
                **details  # Include additional asset details
            }
            enhanced_results.append(enhanced_item)
        
        logger.info(f"Returning {len(enhanced_results)} enhanced results")
        return SimilarContentResponse(items=enhanced_results)
    
    except Exception as e:
        import traceback
        logger = logging.getLogger("uvicorn")
        logger.error(f"Error in get_similar_content: {str(e)}")
        logger.error(traceback.format_exc())
        # Return a more detailed error in development, simple message in production
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/recommendation/hybrid/user/{user_idx}", tags=["recommendation"])
async def get_hybrid_recommendations_for_user(
    user_idx: int,
    db: Session = Depends(get_db),
    top_n: int = Query(10, ge=1, le=50),
    include_adult: bool = False
):
    """
    사용자의 시청 기록과 하이브리드 추천 모델을 기반으로 개인 맞춤형 콘텐츠 추천을 제공
    (아직 구현 안되서 안나옴)
    
    Parameters:
    - user_idx: 추천을 받을 사용자의 ID
    - top_n: 반환할 추천 콘텐츠 수 (기본값: 10, 최대: 50)
    - include_adult: 성인 콘텐츠 포함 여부 (기본값: False)
    
    Returns:
    - 해당 사용자에게 추천된 콘텐츠 목록
    """
    # TODO: Implement user-based hybrid recommendations
    # 1. Get user's viewing history
    # 2. Get user's preferences
    # 3. Use hybrid model to get recommendations
    # 4. Filter and rank results
    
    return {"message": "User-based hybrid recommendations - Coming soon!"}
    
    return {"message": "User-based hybrid recommendations - Coming soon!"}
