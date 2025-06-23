# server/api/routes/adult_recommendation.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql.expression import desc
from server.core.database import get_db
from server.models.asset import Asset, Score
from server.api.schemas.recommendation import RecommendationResponse, RecommendationItem

router = APIRouter(
    prefix="/recommendation/adult",
    tags=["adult_recommendation"]
)

@router.get("/top", response_model=RecommendationResponse)
def get_adult_top10(
    db: Session = Depends(get_db)
):
    rows = (
        db.query(Asset)
        .join(Score, Asset.idx == Score.asset_idx)
        .filter(Asset.is_adult == True, Score.c_rate > 0.3)
        .order_by(desc(Score.c_rate))
        .limit(10)
        .all()
    )

    items = [RecommendationItem(
        idx=r.idx,
        full_asset_id=r.full_asset_id,
        unique_asset_id=r.unique_asset_id,
        asset_nm=r.asset_nm,
        super_asset_nm=r.super_asset_nm,
        actr_disp=r.actr_disp,
        genre=r.genre,
        degree=r.degree,
        asset_time=r.asset_time,
        rlse_year=r.rlse_year,
        smry=r.smry,
        epsd_no=r.epsd_no,
        is_adult=r.is_adult,
        is_movie=r.is_movie,
        is_drama=r.is_drama,
        is_main=r.is_main,
        keyword=r.keyword,
        poster_path=r.poster_path,
        smry_shrt=getattr(r, 'smry_shrt', None)
    ) for r in rows]
    return RecommendationResponse(items=items)

@router.get("/recent", response_model=RecommendationResponse)
def get_adult_recent30(
    db: Session = Depends(get_db)
):
    rows = (
        db.query(Asset)
        .filter(Asset.is_adult == True)
        .order_by(desc(Asset.rlse_year))
        .limit(30)
        .all()
    )

    items = [RecommendationItem(
        idx=r.idx,
        full_asset_id=r.full_asset_id,
        unique_asset_id=r.unique_asset_id,
        asset_nm=r.asset_nm,
        super_asset_nm=r.super_asset_nm,
        actr_disp=r.actr_disp,
        genre=r.genre,
        degree=r.degree,
        asset_time=r.asset_time,
        rlse_year=r.rlse_year,
        smry=r.smry,
        epsd_no=r.epsd_no,
        is_adult=r.is_adult,
        is_movie=r.is_movie,
        is_drama=r.is_drama,
        is_main=r.is_main,
        keyword=r.keyword,
        poster_path=r.poster_path,
        smry_shrt=getattr(r, 'smry_shrt', None)
    ) for r in rows]
    return RecommendationResponse(items=items)
