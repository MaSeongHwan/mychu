from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from typing import List, Optional

from server.core.database import get_db
from server.models.asset import Asset
from server.api.schemas.recommendation import RecommendationResponse, RecommendationItem

# Create a separate router for the test endpoint
router = APIRouter(
    prefix="/recommendation",
    tags=["recommendation-test"]
)

@router.get("/test", response_model=RecommendationResponse)
def get_test_recommendations(
    n: int = Query(10, description="가져올 아이템 수"),
    is_adult: bool = Query(False, description="성인 제외"),
    is_main: bool = Query(True, description="메인 추천만"),
    genre: str = Query(None, description="특정 장르로 필터링"),
    db: Session = Depends(get_db),
):
    """
    테스트용 추천 API - 다양한 파라미터 지원
    """
    import random
    
    # 각 슬라이더 타입에 따라 장르를 다르게 설정하여 결과를 차별화
    # ORM 쿼리 구성
    query = db.query(
        Asset.idx.label('asset_idx'),
        Asset.super_asset_nm.label('asset_nm'), 
        Asset.poster_path,
        Asset.genre,
        Asset.rlse_year.label('release_year'),
        Asset.is_movie,
        Asset.smry
    )
    
    # 기본 필터 적용
    query = query.filter(Asset.is_adult == is_adult)
    
    if is_main:
        query = query.filter(Asset.is_main == is_main)
        
    # 장르 필터링이 있으면 적용
    if genre:
        query = query.filter(Asset.genre.ilike(f"%{genre}%"))
      # 랜덤 정렬 및 제한
    query = query.order_by(func.random()).limit(n)
    
    # 쿼리 실행
    rows = query.all()

    # 결과를 RecommendationItem으로 변환
    items = []
    for r in rows:
        try:
            items.append(
                RecommendationItem(
                    asset_idx = r.asset_idx,
                    asset_nm = r.asset_nm,
                    poster_path = r.poster_path or "",
                    genre = r.genre or "",
                    release_year = r.release_year,
                    is_movie = r.is_movie,
                    smry=r.smry
                )
            )
        except Exception as e:
            print(f"Error creating recommendation item: {e}")
            continue

    # 응답 반환
    return RecommendationResponse(items=items)
