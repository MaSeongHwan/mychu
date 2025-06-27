from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict

from server.core.database import get_db
from server.models.asset import Asset
from server.core.services.recommender_singleton import recommender

# 모든 라우터에 'recommendation' 태그 적용
router = APIRouter(tags=["recommendation"])

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

@router.get("/recommendation/similar/{asset_idx}", response_model=SimilarContentResponse)
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
    - top_n: 반환할 서로 다른 시리즈(super_asset_nm)의 개수 (기본값: 10, 최대: 50)
    - include_adult: 성인 콘텐츠를 추천 결과에 포함할지 여부 (기본값: False)
    
    필터:
    - 현재 콘텐츠와 동일한 시리즈(super_asset_nm)는 제외됩니다
    - 결과는 서로 다른 시리즈(super_asset_nm)별로 최대 1개씩 포함됩니다
    
    응답 내용:
    - 서로 다른 시리즈(super_asset_nm)의 콘텐츠가 top_n개 포함됩니다
    - rank: 유사도 기반 순위
    - idx: 콘텐츠 ID
    - content_nm: 콘텐츠 이름
    - similarity: 유사도 점수 (0-1 사이 값)
    - 기타 에셋 관련 정보
    """
    try:
        import logging
        import time
        
        logger = logging.getLogger("uvicorn")
        start_time = time.time()
        logger.info(f"Processing recommendation for asset_idx={asset_idx}, top_n={top_n}")
        
        # 현재 콘텐츠 정보 가져오기 - super_asset_nm을 확인하기 위해 모든 필요 필드 조회
        target_asset = db.query(Asset).filter(Asset.idx == asset_idx).first()
        
        if not target_asset:
            logger.warning(f"Asset with ID {asset_idx} not found in database")
            raise HTTPException(status_code=404, detail=f"Asset with ID {asset_idx} not found")
        
        # 현재 콘텐츠의 시리즈명 (필터링에 사용)
        current_super_asset = target_asset.super_asset_nm
        logger.info(f"Current super_asset_nm: {current_super_asset}")
        
        # 콘텐츠 매핑 초기화 (필요한 경우)
        if not recommender.is_content_mapping_initialized:
            logger.info("Content mapping not initialized. Initializing now.")
            main_assets = db.query(
                Asset.idx, Asset.asset_nm, Asset.unique_asset_id, 
                Asset.super_asset_nm, Asset.is_adult, Asset.is_movie,
                Asset.is_drama, Asset.is_main, Asset.poster_path
            ).all()
            logger.info(f"Retrieved {len(main_assets)} total assets from database")
            
            recommender.initialize_content_mapping(main_assets)
        
        # 매핑 가져오기
        content_indices = recommender.content_mapping["content_indices"]
        asset_details = recommender.content_mapping["asset_details"]
        
        # 타겟 에셋이 매핑에 있는지 확인
        if asset_idx not in content_indices:
            logger.warning(f"Asset {asset_idx} not found in content mapping")
            raise HTTPException(status_code=404, detail=f"Asset {asset_idx} not suitable for recommendations")
        
        # 벡터 인덱스 가져오기
        target_idx = content_indices[asset_idx]
        logger.info(f"Target idx in embedding space: {target_idx}")
        
        # 추천 계산 - 충분한 결과를 얻기 위해 많이 요청
        rec_start_time = time.time()
        basic_results = recommender.get_similar_contents(
            target_idx,
            top_n * 10,  # 필터링 후에도 충분한 결과를 확보하기 위해 여유있게 가져옴
            include_adult
        )
        logger.info(f"Recommendation computation took {time.time() - rec_start_time:.2f} seconds")
        
        # 시리즈별 필터링 (중복 제거 및 타겟 시리즈 제외)
        enhanced_results = []
        seen_super_assets = set()  # 이미 처리한 시리즈 추적
        
        for item in basic_results:
            asset_id = item["idx"]
            details = asset_details.get(asset_id, {})
            super_asset_nm = details.get("super_asset_nm", "")
            
            # 현재 콘텐츠와 같은 시리즈는 건너뛰기
            if super_asset_nm == current_super_asset:
                continue
                
            # 이미 해당 시리즈의 콘텐츠가 포함되어 있으면 건너뛰기
            if super_asset_nm in seen_super_assets:
                continue
                
            # 새로운 시리즈 추가
            seen_super_assets.add(super_asset_nm)
            
            enhanced_item = {
                **item,  # 원본 필드
                **details  # 추가 에셋 세부 정보
            }
            enhanced_results.append(SimilarContentItem(**enhanced_item))
            
            # 요청한 개수만큼 서로 다른 시리즈를 찾으면 중단
            if len(enhanced_results) >= top_n:
                break
        
        # 결과 로깅
        total_time = time.time() - start_time
        logger.info(f"Filtered to {len(enhanced_results)} unique series recommendations")
        logger.info(f"Total processing time: {total_time:.2f} seconds")
        
        return SimilarContentResponse(items=enhanced_results)
    
    except Exception as e:
        import traceback
        logger = logging.getLogger("uvicorn")
        logger.error(f"Error in get_similar_content: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/recommendation/hybrid/user/{user_idx}", response_model=SimilarContentResponse)
async def get_hybrid_recommendations_for_user(
    user_idx: int,
    db: Session = Depends(get_db),
    top_n: int = Query(10, ge=1, le=50),
    include_adult: bool = False
):
    """
    사용자의 시청 기록과 하이브리드 추천 모델을 기반으로 개인 맞춤형 콘텐츠 추천을 제공
    
    Parameters:
    - user_idx: 추천을 받을 사용자의 ID
    - top_n: 반환할 서로 다른 시리즈(super_asset_nm)의 개수 (기본값: 10, 최대: 50)
    - include_adult: 성인 콘텐츠 포함 여부 (기본값: False)
    
    Filter:
    - 사용자가 이미 시청한 콘텐츠는 제외됩니다
    - 결과는 서로 다른 시리즈(super_asset_nm)별로 최대 1개씩 포함됩니다
    
    Returns:
    - 서로 다른 시리즈(super_asset_nm)의 콘텐츠가 top_n개 포함된 추천 목록
    """
    try:
        import logging
        import time
        from server.models.user import User, VodLog
        from sqlalchemy import func
        
        logger = logging.getLogger("uvicorn")
        start_time = time.time()
        logger.info(f"Processing user recommendations for user_idx={user_idx}, top_n={top_n}")
        
        # 사용자 존재 확인
        user_exists = db.query(User.user_idx).filter(User.user_idx == user_idx).first()
        if not user_exists:
            logger.warning(f"User with ID {user_idx} not found in database")
            raise HTTPException(status_code=404, detail=f"User with ID {user_idx} not found")
        
        # 콘텐츠 매핑 초기화 (필요한 경우)
        if not recommender.is_content_mapping_initialized:
            logger.info("Content mapping not initialized. Initializing now.")
            main_assets = db.query(
                Asset.idx, Asset.asset_nm, Asset.unique_asset_id, 
                Asset.super_asset_nm, Asset.is_adult, Asset.is_movie,
                Asset.is_drama, Asset.is_main, Asset.poster_path
            ).all()
            logger.info(f"Retrieved {len(main_assets)} total assets from database")
            recommender.initialize_content_mapping(main_assets)
            
        # 매핑 가져오기
        content_indices = recommender.content_mapping["content_indices"]
        asset_details = recommender.content_mapping["asset_details"]
        
        # 사용자 시청 기록 가져오기
        watched_assets = db.query(VodLog.asset_idx).filter(VodLog.user_idx == user_idx).distinct().all()
        watched_asset_ids = [log.asset_idx for log in watched_assets]
        logger.info(f"User has watched {len(watched_asset_ids)} unique assets")
        
        # 시청한 콘텐츠의 시리즈 정보 가져오기
        watched_series = set()
        for asset_id in watched_asset_ids:
            details = asset_details.get(asset_id, {})
            super_asset_nm = details.get("super_asset_nm", "")
            if super_asset_nm:
                watched_series.add(super_asset_nm)
        logger.info(f"User has watched content from {len(watched_series)} different series")
        
        # 시청 기록이 없는 경우 처리
        if not watched_assets:
            logger.warning(f"No viewing history for user {user_idx}, returning diverse recommendations")
            
            # 다양한 시리즈에서 선택하기 위해 각 시리즈당 하나의 에셋만 선택
            assets_query = db.query(Asset).group_by(Asset.super_asset_nm)
            
            if not include_adult:
                assets_query = assets_query.filter(Asset.is_adult == False)
                
            random_assets = assets_query.order_by(func.random()).limit(top_n).all()
            
            results = []
            for i, asset in enumerate(random_assets):
                results.append(SimilarContentItem(
                    rank=i+1,
                    idx=asset.idx,
                    content_nm=asset.asset_nm,
                    similarity=0.5,  # 기본 유사도
                    asset_nm=asset.asset_nm,
                    unique_asset_id=asset.unique_asset_id or "",
                    super_asset_nm=asset.super_asset_nm or "",
                    is_adult=asset.is_adult or False,
                    is_movie=asset.is_movie or False,
                    is_drama=asset.is_drama or False,
                    is_main=asset.is_main or False,
                    poster_path=asset.poster_path or ""
                ))
                
            return SimilarContentResponse(items=results)
        
        # 최근 시청한 콘텐츠 가져오기
        most_recent_log = db.query(VodLog.asset_idx).filter(
            VodLog.user_idx == user_idx
        ).order_by(
            VodLog.log_idx.desc()
        ).first()
        
        if not most_recent_log:
            logger.warning(f"Could not find most recent content for user {user_idx}")
            raise HTTPException(status_code=404, detail="Could not determine user preferences")
        
        recent_asset_id = most_recent_log.asset_idx
        
        # 최근 시청한 콘텐츠가 매핑에 있는지 확인
        if recent_asset_id not in content_indices:
            logger.warning(f"Recent asset {recent_asset_id} not found in content mapping")
            
            # 무작위 추천으로 대체
            query = db.query(Asset).filter(
                ~Asset.idx.in_(watched_asset_ids)
            ).group_by(Asset.super_asset_nm)  # 시리즈별로 하나씩만 선택
            
            if not include_adult:
                query = query.filter(Asset.is_adult == False)
                
            random_assets = query.order_by(func.random()).limit(top_n).all()
            
            results = []
            for i, asset in enumerate(random_assets):
                results.append(SimilarContentItem(
                    rank=i+1,
                    idx=asset.idx,
                    content_nm=asset.asset_nm,
                    similarity=0.3,
                    asset_nm=asset.asset_nm,
                    unique_asset_id=asset.unique_asset_id or "",
                    super_asset_nm=asset.super_asset_nm or "",
                    is_adult=asset.is_adult or False,
                    is_movie=asset.is_movie or False,
                    is_drama=asset.is_drama or False,
                    is_main=asset.is_main or False,
                    poster_path=asset.poster_path or ""
                ))
                
            return SimilarContentResponse(items=results)
        
        # 벡터 인덱스 가져오기
        target_idx = content_indices[recent_asset_id]
        logger.info(f"Target idx in embedding space: {target_idx}")
        
        # 추천 계산
        rec_start_time = time.time()
        basic_results = recommender.get_similar_contents(
            target_idx,
            top_n * 10,  # 충분한 결과 확보를 위해 여유있게 요청
            include_adult
        )
        logger.info(f"Recommendation computation took {time.time() - rec_start_time:.2f} seconds")
        
        # 결과 필터링 - 중복 시리즈 제거 및 시청한 콘텐츠 제외
        enhanced_results = []
        seen_super_assets = set()  # 이미 처리한 시리즈 추적
        
        for item in basic_results:
            asset_id = item["idx"]
            
            # 이미 시청한 콘텐츠는 건너뛰기
            if asset_id in watched_asset_ids:
                continue
                
            details = asset_details.get(asset_id, {})
            super_asset_nm = details.get("super_asset_nm", "")
            
            # 이미 해당 시리즈의 콘텐츠가 포함되어 있으면 건너뛰기
            if super_asset_nm in seen_super_assets:
                continue
                
            # 새로운 시리즈 추가
            seen_super_assets.add(super_asset_nm)
            
            enhanced_item = {
                **item,  # 원본 필드
                **details  # 추가 에셋 세부 정보
            }
            enhanced_results.append(SimilarContentItem(**enhanced_item))
            
            # 요청한 개수만큼 서로 다른 시리즈를 찾으면 중단
            if len(enhanced_results) >= top_n:
                break
        
        # 결과가 충분하지 않으면 인기 콘텐츠로 채우기
        if len(enhanced_results) < top_n:
            logger.info(f"Not enough unique series recommendations, adding popular content")
            
            # 이미 추천된 시리즈와 시청한 시리즈 추적
            all_excluded_series = seen_super_assets.union(watched_series)
            
            # 추가로 필요한 콘텐츠 수
            remaining = top_n - len(enhanced_results)
            
            # 인기 콘텐츠 가져오기 (서로 다른 시리즈에서)
            additional_assets = []
            unique_series_count = 0
            
            # DB에서 에셋 가져오기
            all_assets = db.query(Asset).filter(
                ~Asset.idx.in_(watched_asset_ids)
            )
            
            if not include_adult:
                all_assets = all_assets.filter(Asset.is_adult == False)
            
            # 랜덤 정렬
            all_assets = all_assets.order_by(func.random()).all()
            
            # 서로 다른 시리즈 선택
            for asset in all_assets:
                if asset.super_asset_nm not in all_excluded_series:
                    additional_assets.append(asset)
                    all_excluded_series.add(asset.super_asset_nm)
                    unique_series_count += 1
                    
                    if unique_series_count >= remaining:
                        break
            
            # 결과에 추가
            start_rank = len(enhanced_results) + 1
            for i, asset in enumerate(additional_assets):
                enhanced_results.append(SimilarContentItem(
                    rank=start_rank + i,
                    idx=asset.idx,
                    content_nm=asset.asset_nm,
                    similarity=0.3,  # 낮은 유사도 점수
                    asset_nm=asset.asset_nm,
                    unique_asset_id=asset.unique_asset_id or "",
                    super_asset_nm=asset.super_asset_nm or "",
                    is_adult=asset.is_adult or False,
                    is_movie=asset.is_movie or False,
                    is_drama=asset.is_drama or False,
                    is_main=asset.is_main or False,
                    poster_path=asset.poster_path or ""
                ))
        
        # 결과 반환
        total_time = time.time() - start_time
        logger.info(f"Returning {len(enhanced_results)} recommendations from unique series")
        logger.info(f"Total processing time: {total_time:.2f} seconds")
        
        return SimilarContentResponse(items=enhanced_results)
    
    except Exception as e:
        import traceback
        logger = logging.getLogger("uvicorn")
        logger.error(f"Error in get_hybrid_recommendations_for_user: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")






