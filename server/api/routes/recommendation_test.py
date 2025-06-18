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
    tags=["recommendation"]
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
    테스트용 추천 API - 다양한 파라미터 지원 -> 아무 실험 하시와요
    """
    import random
    
    # Asset 전체 컬럼을 select
    query = db.query(Asset)
    
    # 기본 필터 적용
    query = query.filter(Asset.is_adult == is_adult)
    if is_main:
        query = query.filter(Asset.is_main == is_main)
    if genre:
        query = query.filter(Asset.genre.ilike(f"%{genre}%"))
    query = query.order_by(func.random()).limit(n)
    
    rows = query.all()

    items = []
    for r in rows:
        try:
            items.append(
                RecommendationItem(
                    idx = r.idx,
                    full_asset_id = r.full_asset_id,
                    unique_asset_id = r.unique_asset_id,
                    asset_nm = r.asset_nm,
                    super_asset_nm = r.super_asset_nm,
                    actr_disp = r.actr_disp,
                    genre = r.genre,
                    degree = r.degree,
                    asset_time = r.asset_time,
                    rlse_year = r.rlse_year,
                    smry = r.smry,
                    epsd_no = r.epsd_no,
                    is_adult = r.is_adult,
                    is_movie = r.is_movie,
                    is_drama = r.is_drama,
                    is_main = r.is_main,
                    keyword = r.keyword,
                    poster_path = r.poster_path,
                    smry_shrt = getattr(r, 'smry_shrt', None)
                )
            )
        except Exception as e:
            print(f"Error creating recommendation item: {e}")
            continue

    return RecommendationResponse(items=items)
