# filepath: c:\Users\LG\mychu\server\api\routes\search.py
from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from server.core.search_engine import main_search_assets, is_adult_search_assets, advanced_search_assets
from server.core.database import get_db
from server.models.user import User
from server.api.schemas.search import SearchResponse, SearchItem

router = APIRouter(
     tags=["search"]
)

@router.get("/", response_model=SearchResponse)
def search_filtered(
    query: str = Query(..., min_length=1, description="검색어"),
    limit: int = Query(10, description="결과 개수 제한"),
    db: Session = Depends(get_db)
):
    """
    일반 컨텐츠 검색 엔드포인트 (성인 컨텐츠 제외)
    """
    results = main_search_assets(db=db, query=query, limit=limit)
    return {"results": results}

@router.get("/all", response_model=SearchResponse)
def search_all_assets(
    query: str = Query(..., min_length=1, description="검색어"), 
    limit: int = Query(10, description="결과 개수 제한"),
    is_adult: bool = Query(False, description="성인 컨텐츠 포함 여부"),
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    모든 컨텐츠 검색 엔드포인트 (성인 컨텐츠 포함 가능)
    """    # 성인 컨텐츠를 요청한 경우 사용자 인증 확인
    if is_adult and user_id:
        user = db.query(User).filter(User.user_idx == user_id).first()
        if not user or not user.is_adult:
            raise HTTPException(
                status_code=403, 
                detail="성인 컨텐츠에 접근할 권한이 없습니다."
            )
    
    results = is_adult_search_assets(db=db, query=query, limit=limit)
    return {"results": results}

@router.get("/advanced", response_model=SearchResponse)
def search_advanced(
    query: str = Query(..., min_length=1, description="검색어"),
    limit: int = Query(10, description="결과 개수 제한"),
    genre: Optional[str] = Query(None, description="장르 필터"),
    release_year: Optional[int] = Query(None, description="출시 년도 필터"),
    is_adult: bool = Query(False, description="성인 컨텐츠 포함 여부"),
    is_movie: Optional[bool] = Query(None, description="영화만 검색할지 여부"),
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    고급 컨텐츠 검색 엔드포인트 (다양한 필터링 지원)
    """
    # 성인 컨텐츠 접근 권한 확인
    if is_adult and user_id:
        user = db.query(User).filter(User.user_idx == user_id).first()
        if not user or not user.is_adult:
            raise HTTPException(
                status_code=403, 
                detail="성인 컨텐츠에 접근할 권한이 없습니다."
            )
    
    # 향상된 검색 결과(딕셔너리 목록) 반환
    results = advanced_search_assets(
        db=db, 
        query=query, 
        limit=limit,
        genre=genre,
        release_year=release_year,
        is_adult=is_adult,
        is_movie=is_movie
    )
    return {"results": results}
