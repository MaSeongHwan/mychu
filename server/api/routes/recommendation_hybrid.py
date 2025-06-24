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
        import time
        
        logger = logging.getLogger("uvicorn")
        start_time = time.time()
        logger.info(f"Processing recommendation for asset_idx={asset_idx}, top_n={top_n}")
          # Check if main asset exists
        target_asset = db.query(Asset).filter(Asset.idx == asset_idx, Asset.is_main == True).first()
        if not target_asset:
            logger.warning(f"Main asset with ID {asset_idx} not found in database")
            raise HTTPException(status_code=404, detail=f"Main asset with ID {asset_idx} not found")
        
        logger.info(f"Found target asset: {target_asset.asset_nm}")
        
        # 콘텐츠 매핑이 초기화되지 않았다면 초기화
        if not recommender.is_content_mapping_initialized:
            logger.info("Content mapping not initialized. Initializing now.")
            # DB에서 메인 콘텐츠 가져오기
            main_assets = db.query(Asset).filter(Asset.is_main == True).all()
            logger.info(f"Retrieved {len(main_assets)} main assets from database")
            
            # 싱글톤에 콘텐츠 매핑 초기화
            recommender.initialize_content_mapping(main_assets)
        
        # 매핑 가져오기
        content_indices = recommender.content_mapping["content_indices"]
        asset_details = recommender.content_mapping["asset_details"]
        
        # 타겟 에셋이 매핑에 있는지 확인
        if asset_idx not in content_indices:
            logger.warning(f"Asset {asset_idx} not found in filtered main assets")
            # 이 경우 더미 아이템 반환
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
        
        # 싱글톤 인스턴스를 사용하여 유사한 콘텐츠 가져오기
        rec_start_time = time.time()
        basic_results = recommender.get_similar_contents(
            target_idx,
            top_n,
            include_adult
        )
        logger.info(f"Recommendation computation took {time.time() - rec_start_time:.2f} seconds")
        logger.info(f"Got {len(basic_results)} recommendation results")
        
        # 결과 향상
        enhanced_results = []
        for item in basic_results:
            asset_id = item["idx"]
            details = asset_details.get(asset_id, {})
            
            enhanced_item = {
                **item,  # 원본 필드 포함 (rank, idx, content_nm, similarity)
                **details  # 추가 에셋 세부 정보 포함
            }
            enhanced_results.append(SimilarContentItem(**enhanced_item))
        
        result_count = len(enhanced_results)
        total_time = time.time() - start_time
        logger.info(f"Returning {result_count} enhanced results")
        logger.info(f"Total request processing time: {total_time:.2f} seconds")
        
        if result_count < top_n:
            logger.warning(f"Requested {top_n} results but only found {result_count}")
            logger.warning("This may be due to strict filtering criteria or limited content in the database")
        
        return SimilarContentResponse(items=enhanced_results)
    
    except Exception as e:
        import traceback
        logger = logging.getLogger("uvicorn")
        logger.error(f"Error in get_similar_content: {str(e)}")
        logger.error(traceback.format_exc())
        # Return a more detailed error in development, simple message in production
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
    - top_n: 반환할 추천 콘텐츠 수 (기본값: 10, 최대: 50)
    - include_adult: 성인 콘텐츠 포함 여부 (기본값: False)
    
    Returns:
    - 해당 사용자에게 추천된 콘텐츠 목록
    """
    try:
        import logging
        import time
        from server.models.user import User, VodLog
        from sqlalchemy import func
        
        logger = logging.getLogger("uvicorn")
        start_time = time.time()
        logger.info(f"Processing user-based recommendations for user_idx={user_idx}, top_n={top_n}")
        
        # 1. 사용자 존재 확인
        user = db.query(User).filter(User.user_idx == user_idx).first()
        if not user:
            logger.warning(f"User with ID {user_idx} not found in database")
            raise HTTPException(status_code=404, detail=f"User with ID {user_idx} not found")
        
        # 2. 사용자 시청 기록 가져오기
        vod_logs = db.query(VodLog).filter(VodLog.user_idx == user_idx).all()
        logger.info(f"Found {len(vod_logs)} VOD logs for user {user_idx}")
        
        # 콘텐츠 매핑이 초기화되지 않았다면 초기화
        if not recommender.is_content_mapping_initialized:
            logger.info("Content mapping not initialized. Initializing now.")
            # DB에서 메인 콘텐츠 가져오기
            main_assets = db.query(Asset).filter(Asset.is_main == True).all()
            logger.info(f"Retrieved {len(main_assets)} main assets from database")
            
            # 싱글톤에 콘텐츠 매핑 초기화
            recommender.initialize_content_mapping(main_assets)
            
        # 매핑 가져오기
        content_indices = recommender.content_mapping["content_indices"]
        asset_details = recommender.content_mapping["asset_details"]
        
        if not vod_logs:
            logger.warning(f"No viewing history for user {user_idx}, returning general recommendations")
            # 시청 기록이 없으면 인기 콘텐츠 기반 추천
            assets_query = db.query(Asset).filter(Asset.is_main == True)
            if not include_adult:
                assets_query = assets_query.filter(Asset.is_adult == False)
                
            assets = assets_query.order_by(func.random()).limit(top_n).all()
            
            results = []
            for i, asset in enumerate(assets):
                results.append(SimilarContentItem(
                    rank=i+1,
                    idx=asset.idx,
                    content_nm=asset.asset_nm,
                    similarity=0.5,  # 관련성 점수는 임의 값
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
        
        # 3. 시청 기록에서 콘텐츠 ID 추출
        watched_asset_ids = [log.asset_idx for log in vod_logs]
        logger.info(f"User has watched {len(watched_asset_ids)} unique assets")
        
        # 4. 최근 시청한 콘텐츠 가져오기
        most_recent_log = db.query(VodLog).filter(
            VodLog.user_idx == user_idx
        ).order_by(
            VodLog.log_idx.desc()
        ).first()
        
        if not most_recent_log:
            logger.warning(f"Could not find most recent content for user {user_idx}")
            raise HTTPException(status_code=404, detail="Could not determine user preferences")
          # 5. 최근 시청한 메인 콘텐츠 정보 가져오기
        target_asset = db.query(Asset).filter(Asset.idx == most_recent_log.asset_idx, Asset.is_main == True).first()
        if not target_asset:
            logger.warning(f"Main asset with ID {most_recent_log.asset_idx} not found in database")
            raise HTTPException(status_code=404, detail=f"Main asset with ID {most_recent_log.asset_idx} not found")
        
        logger.info(f"Found most recent asset: {target_asset.asset_nm}")
        
        # 타겟 콘텐츠가 매핑에 있는지 확인
        if target_asset.idx not in content_indices:
            logger.warning(f"Target asset {target_asset.idx} not found in filtered main assets")
            # 이 경우 빈 결과 대신 오류 반환
            raise HTTPException(status_code=404, detail=f"Target asset {target_asset.idx} not suitable for recommendations")
        
        # KNN 모델에 사용할 인덱스 가져오기
        target_idx = content_indices[target_asset.idx]
        logger.info(f"Target idx in embedding space: {target_idx}")
        
        # 싱글톤 인스턴스를 사용하여 유사한 콘텐츠 가져오기
        rec_start_time = time.time()
        basic_results = recommender.get_similar_contents(
            target_idx,
            top_n * 2,  # 필터링 후 결과가 적을 수 있으므로 여유있게 가져옴
            include_adult
        )
        logger.info(f"Recommendation computation took {time.time() - rec_start_time:.2f} seconds")
        logger.info(f"Got {len(basic_results)} recommendation results")
        
        # 결과 향상 및 이미 본 콘텐츠 필터링
        enhanced_results = []
        for item in basic_results:
            asset_id = item["idx"]
            
            # 이미 시청한 콘텐츠는 건너뛰기
            if asset_id in watched_asset_ids:
                logger.debug(f"Skipping asset {asset_id}: already watched by user")
                continue
                
            details = asset_details.get(asset_id, {})
            
            enhanced_item = {
                **item,  # 원본 필드 포함
                **details  # 추가 에셋 세부 정보 포함
            }
            enhanced_results.append(SimilarContentItem(**enhanced_item))
            
            # 충분한 결과를 찾으면 중단
            if len(enhanced_results) >= top_n:
                break
        
        logger.info(f"Filtered to {len(enhanced_results)} recommendations after removing watched content")
        
        # 충분한 결과가 없으면 다른 인기 콘텐츠로 채움
        if len(enhanced_results) < top_n:
            logger.info(f"Not enough recommendations ({len(enhanced_results)}), adding popular content")
            
            # 인기 콘텐츠 가져오기 (랜덤으로 선택)
            existing_ids = {item.idx for item in enhanced_results}
            
            additional_query = db.query(Asset).filter(
                Asset.is_main == True,
                ~Asset.idx.in_(existing_ids),
                ~Asset.idx.in_(watched_asset_ids)
            )
            
            if not include_adult:
                additional_query = additional_query.filter(Asset.is_adult == False)
                
            additional_assets = additional_query.order_by(func.random()).limit(top_n - len(enhanced_results)).all()
            
            start_rank = len(enhanced_results) + 1
            for i, asset in enumerate(additional_assets):
                enhanced_results.append(SimilarContentItem(
                    rank=start_rank + i,
                    idx=asset.idx,
                    content_nm=asset.asset_nm,
                    similarity=0.3,  # 낮은 유사성 점수
                    asset_nm=asset.asset_nm,
                    unique_asset_id=asset.unique_asset_id or "",
                    super_asset_nm=asset.super_asset_nm or "",
                    is_adult=asset.is_adult or False,
                    is_movie=asset.is_movie or False,
                    is_drama=asset.is_drama or False,
                    is_main=asset.is_main or False,
                    poster_path=asset.poster_path or ""
                ))
        
        total_time = time.time() - start_time
        logger.info(f"Total request processing time: {total_time:.2f} seconds")
        return SimilarContentResponse(items=enhanced_results)
    
    except Exception as e:
        import traceback
        logger = logging.getLogger("uvicorn")
        logger.error(f"Error in get_hybrid_recommendations_for_user: {str(e)}")
        logger.error(traceback.format_exc())
        # 개발 환경에서는 더 상세한 오류 제공, 프로덕션에서는 간단한 메시지
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/recommendation/similar/{asset_idx}/debug", response_model=Dict[str, Any])
async def get_similar_content_debug(
    asset_idx: int,
    db: Session = Depends(get_db)
):
    """
    디버깅 엔드포인트: 추천 시스템의 내부 상태를 확인합니다
    
    파라미터:
    - asset_idx: 디버그할 에셋 ID
    """
    try:
        import logging
        logger = logging.getLogger("uvicorn")
        logger.info(f"Starting debug for asset_idx={asset_idx}")
        
        # 1. 에셋 정보 확인
        asset = db.query(Asset).filter(Asset.idx == asset_idx).first()
        asset_exists = asset is not None
        asset_is_main = asset.is_main if asset else False
        
        # 2. 싱글톤 상태 확인
        is_mapping_initialized = recommender.is_content_mapping_initialized
        recommender_has_vectors = len(recommender.hybrid_vectors) > 0 if hasattr(recommender, "hybrid_vectors") else False
        
        # 3. 매핑 확인 (초기화되었다면)
        in_content_mapping = False
        vector_idx = None
        
        if is_mapping_initialized:
            content_indices = recommender.content_mapping.get("content_indices", {})
            in_content_mapping = asset_idx in content_indices
            vector_idx = content_indices.get(asset_idx) if in_content_mapping else None
        
        # 4. KNN 모델 확인
        knn_model_available = recommender.knn_model is not None if hasattr(recommender, "knn_model") else False
        
        # 5. 결과 수집
        debug_info = {
            "asset_info": {
                "asset_idx": asset_idx,
                "exists": asset_exists,
                "is_main": asset_is_main,
                "asset_name": asset.asset_nm if asset else None,
            },
            "recommender_state": {
                "mapping_initialized": is_mapping_initialized,
                "has_vectors": recommender_has_vectors,
                "vector_count": len(recommender.hybrid_vectors) if recommender_has_vectors else 0,
                "knn_model_available": knn_model_available,
                "cache_stats": {
                    "hit_count": recommender.cache_hit_count if hasattr(recommender, "cache_hit_count") else 0,
                    "miss_count": recommender.cache_miss_count if hasattr(recommender, "cache_miss_count") else 0
                }
            },
            "mapping_info": {
                "asset_in_mapping": in_content_mapping,
                "vector_idx": vector_idx,
                "mapping_size": len(recommender.content_mapping.get("content_indices", {})) if is_mapping_initialized else 0
            }
        }
        
        # 벡터가 있고 자산이 매핑되어 있다면 추가 디버깅
        if in_content_mapping and recommender_has_vectors and vector_idx is not None:
            # 유사도 직접 계산
            import numpy as np
            from sklearn.metrics.pairwise import cosine_similarity
            
            target_vector = recommender.hybrid_vectors[vector_idx].reshape(1, -1)
            similarities = cosine_similarity(target_vector, recommender.hybrid_vectors)[0]
            
            # 상위 5개만 추출
            top_indices = np.argsort(similarities)[::-1][:6]  # 자기 자신 포함 6개
            
            similar_items = []
            for i, idx in enumerate(top_indices):
                if i == 0 and idx == vector_idx:
                    continue  # 자기 자신 건너뛰기
                    
                content_id = recommender.content_mapping.get("content_ids", {}).get(idx)
                name = recommender.content_mapping.get("content_names", {}).get(idx)
                
                similar_items.append({
                    "rank": i,
                    "vector_idx": int(idx),
                    "content_id": content_id,
                    "name": name,
                    "similarity": float(similarities[idx])
                })
            
            debug_info["similarity_check"] = {
                "direct_similar_items": similar_items,
                "vector_shape": recommender.hybrid_vectors.shape,
                "vector_sample": recommender.hybrid_vectors[vector_idx][:5].tolist() if recommender_has_vectors else []
            }
        
        return debug_info
        
    except Exception as e:
        import traceback
        logger = logging.getLogger("uvicorn")
        logger.error(f"Error in debug endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        return {"error": str(e), "traceback": traceback.format_exc()}

@router.get("/recommendation/similar/{asset_idx}/debug")
async def debug_asset_recommendation(
    asset_idx: int,
    db: Session = Depends(get_db)
):
    """
    디버깅용 엔드포인트: 특정 자산 ID에 대한 추천 시스템의 상태를 확인합니다.
    
    Parameters:
    - asset_idx: 디버그할 자산 ID
    
    Returns:
    - 자산 매핑, 벡터, KNN 모델 상태 등 디버그 정보
    """
    import logging
    logger = logging.getLogger("uvicorn")
    
    debug_info = {
        "asset_idx": asset_idx,
        "asset_exists_in_db": False,
        "asset_is_main": False,
        "recommender_initialized": recommender.is_content_mapping_initialized,
        "asset_in_mapping": False,
        "mapping_index": None,
        "has_embedding_vector": False,
        "total_assets_in_mapping": 0,
        "total_vectors": 0
    }
    
    # DB에서 자산 확인
    target_asset = db.query(Asset).filter(Asset.idx == asset_idx).first()
    if target_asset:
        debug_info["asset_exists_in_db"] = True
        debug_info["asset_is_main"] = target_asset.is_main
        debug_info["asset_details"] = {
            "asset_nm": target_asset.asset_nm,
            "unique_asset_id": target_asset.unique_asset_id,
            "is_adult": target_asset.is_adult,
            "is_movie": target_asset.is_movie,
            "is_drama": target_asset.is_drama
        }
    
    # 매핑 확인
    if recommender.is_content_mapping_initialized:
        content_indices = recommender.content_mapping.get("content_indices", {})
        debug_info["total_assets_in_mapping"] = len(content_indices)
        
        if content_indices and asset_idx in content_indices:
            debug_info["asset_in_mapping"] = True
            debug_info["mapping_index"] = content_indices[asset_idx]
    
    # 벡터 확인
    if recommender.vectors is not None:
        debug_info["total_vectors"] = recommender.vectors.shape[0] if hasattr(recommender.vectors, "shape") else 0
        
        if debug_info["asset_in_mapping"]:
            mapping_index = debug_info["mapping_index"]
            if mapping_index is not None and mapping_index < debug_info["total_vectors"]:
                debug_info["has_embedding_vector"] = True
    
    # 추가 진단
    debug_info["recommender_status"] = {
        "cache_enabled": recommender.use_cache,
        "cache_size": len(recommender._result_cache) if hasattr(recommender, "_result_cache") else 0,
        "knn_model_built": recommender.knn is not None
    }
    
    # 로그에 주요 정보 기록
    logger.info(f"Debug info for asset {asset_idx}: " + 
                f"exists={debug_info['asset_exists_in_db']}, " + 
                f"is_main={debug_info['asset_is_main']}, " + 
                f"in_mapping={debug_info['asset_in_mapping']}, " + 
                f"has_vector={debug_info['has_embedding_vector']}")
    
    return debug_info
