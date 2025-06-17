from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from server.core.database import get_db
from server.models.asset import Asset
from server.models.asset import Score
from server.api.schemas.recommendation import RecommendationItem, RecommendationResponse

router = APIRouter(tags=["mas_recommendation"])

@router.get("/mas_recommendation/popular", response_model=RecommendationResponse)
def get_popular_recommendations(
    limit: int = Query(10, description="가져올 아이템 수"),
    db: Session = Depends(get_db),
):
    """
    인기순 추천 콘텐츠를 반환합니다 (조회수 기반).
    """
    q = (
        db.query(
            Asset.idx.label("asset_idx"),
            Asset.super_asset_nm.label("asset_nm"),
            Asset.poster_path,
            Asset.genre,
            Asset.rlse_year.label("release_year")
            #Asset.is_movie
        )
        .join(Score, Asset.idx == Score.asset_idx)
        .filter(Asset.is_adult == False, Asset.is_main == True, Score.cnt>0.3)
        .order_by(desc(Score.cnt))
        .limit(limit)
    )

    rows = q.all()
    items = [
        RecommendationItem(
            asset_idx=r.asset_idx,
            asset_nm=r.asset_nm,
            poster_path=r.poster_path or "",
            genre=r.genre or "",
            release_year=r.release_year
            #is_movie=r.is_movie
        ) for r in rows
    ]

    return RecommendationResponse(items=items)
