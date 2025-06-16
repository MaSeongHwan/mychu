from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from typing import List, Optional
import random
import datetime

from server.core.database import get_db
from server.models.asset import Asset
from server.api.schemas.recommendation import RecommendationResponse, RecommendationItem

router = APIRouter(
    prefix="/recommendation",
    tags=["recommendation"]
)

@router.get("/top", response_model=RecommendationResponse)
def get_top_recommendations(
    limit: int = Query(10, description="가져올 아이템 수"),
    db: Session = Depends(get_db),
):
    """
    오늘의 인기작 Top N을 반환합니다.
    실제로는 랜덤하게 콘텐츠를 선택합니다.
    """
    # ORM 쿼리 구성
    q = (
        db.query(
            Asset.idx.label('asset_idx'),
            Asset.super_asset_nm.label('asset_nm'), 
            Asset.poster_path,
            Asset.genre,
            Asset.rlse_year.label('release_year'),
            Asset.is_movie
        )
        .filter(Asset.is_adult == False, Asset.is_main == True)
        .order_by(func.random())
        .limit(limit)
    )
    rows = q.all()

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
                    is_movie = r.is_movie
                )
            )
        except Exception as e:
            print(f"Error creating recommendation item: {e}")
            continue

    # 응답 반환
    return RecommendationResponse(items=items)

@router.get("/emotion", response_model=RecommendationResponse)
def get_emotion_recommendations(
    limit: int = Query(10, description="가져올 아이템 수"),
    db: Session = Depends(get_db),
):
    """
    감정 기반 추천 콘텐츠를 반환합니다.
    실제로는 랜덤하게 힐링 장르의 콘텐츠를 선택합니다.
    """
    # 힐링 관련 장르 목록 (실제 데이터에 맞게 조정 필요)
    healing_genres = ["힐링", "코미디", "가족", "드라마", "뮤직", "판타지"]
    
    # 랜덤하게 두 장르 선택
    selected_genres = random.sample(healing_genres, min(2, len(healing_genres)))
    
    # ORM 쿼리 구성
    q = (
        db.query(
            Asset.idx.label('asset_idx'),
            Asset.super_asset_nm.label('asset_nm'), 
            Asset.poster_path,
            Asset.genre,
            Asset.rlse_year.label('release_year'),
            Asset.is_movie
        )
        .filter(Asset.is_adult == False, Asset.is_main == True)
        .filter(Asset.genre.in_(selected_genres))
        .order_by(func.random())
        .limit(limit)
    )
    
    # 충분한 결과가 없다면 일반 필터로 보완
    rows = q.all()
    if len(rows) < limit:
        remaining = limit - len(rows)
        q2 = (
            db.query(
                Asset.idx.label('asset_idx'),
                Asset.super_asset_nm.label('asset_nm'), 
                Asset.poster_path,
                Asset.genre,
                Asset.rlse_year.label('release_year'),
                Asset.is_movie
            )
            .filter(Asset.is_adult == False, Asset.is_main == True)
            .filter(Asset.genre.notin_(selected_genres))
            .order_by(func.random())
            .limit(remaining)
        )
        rows.extend(q2.all())

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
                    is_movie = r.is_movie
                )
            )
        except Exception as e:
            print(f"Error creating recommendation item: {e}")
            continue

    return RecommendationResponse(items=items)

@router.get("/recent", response_model=RecommendationResponse)
def get_recent_recommendations(
    limit: int = Query(10, description="가져올 아이템 수"),
    db: Session = Depends(get_db),
):
    """
    최근 시청한 콘텐츠와 유사한 추천 콘텐츠를 반환합니다.
    실제로는 랜덤하게 콘텐츠를 선택합니다.
    """
    # 랜덤한 릴리스 년도 범위 선택 (최근 5년 내에서)
    current_year = datetime.datetime.now().year
    year_range = [current_year - random.randint(0, 5) for _ in range(2)]
    min_year = min(year_range)
    max_year = max(year_range)
    
    # ORM 쿼리 구성
    q = (
        db.query(
            Asset.idx.label('asset_idx'),
            Asset.super_asset_nm.label('asset_nm'), 
            Asset.poster_path,
            Asset.genre,
            Asset.rlse_year.label('release_year'),
            Asset.is_movie
        )
        .filter(Asset.is_adult == False, Asset.is_main == True)
        .filter(Asset.rlse_year.between(min_year, max_year))
        .order_by(func.random())
        .limit(limit)
    )
    
    rows = q.all()
    
    # 결과가 충분하지 않으면 년도 제한 없이 추가 쿼리
    if len(rows) < limit:
        remaining = limit - len(rows)
        q2 = (
            db.query(
                Asset.idx.label('asset_idx'),
                Asset.super_asset_nm.label('asset_nm'), 
                Asset.poster_path,
                Asset.genre,
                Asset.rlse_year.label('release_year'),
                Asset.is_movie
            )
            .filter(Asset.is_adult == False, Asset.is_main == True)
            .order_by(func.random())
            .limit(remaining)
        )
        rows.extend(q2.all())

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
                    is_movie = r.is_movie
                )
            )
        except Exception as e:
            print(f"Error creating recommendation item: {e}")
            continue

    return RecommendationResponse(items=items)


from fastapi import APIRouter
from ...core.database import engine
import pandas as pd

router = APIRouter()

@router.get("/test")
def get_random_recommendations(count: int = 10, type: str = None):
    where_clause = ""
    if type == "movie":
        where_clause = "WHERE a.genre IN ('영화', '액션/모험', '액션/어드벤쳐')"
    elif type == "drama":
        where_clause = "WHERE a.genre IN ('드라마', '미니시리즈', '주말연속극')"
    query = f"""
        SELECT a.full_asset_id, a.asset_nm, a.genre, a.actr_disp, 
               COALESCE(i.poster_path, '') as poster_path
        FROM asset a
        LEFT JOIN imagedb i ON a.full_asset_id = i.full_asset_id
        {where_clause}
        ORDER BY RANDOM()
        LIMIT {count}
    """
    df = pd.read_sql_query(query, engine)
    return df.to_dict('records')