from sqlalchemy.orm import Session
from sqlalchemy import func
from server.models.asset import Asset
from server.core.database import get_db
import logging

logger = logging.getLogger(__name__)

def main_search_assets(db=None, query: str = "", limit: int = 10):
    """
    일반 컨텐츠 검색 함수 (성인 컨텐츠 제외)
    
    Args:
        db: 데이터베이스 세션 (없으면 자동으로 생성)
        query: 검색어
        limit: 결과 개수 제한
        
    Returns:
        검색 결과 목록 (각 항목은 딕셔너리 형태로 필요한 정보 포함)
    """
    # db가 None이면 세션 새로 생성
    if db is None:
        db = next(get_db())
    
    query_lower = f"%{query.lower()}%"
    # Use SQLAlchemy ORM to query the database directly
    results = db.query(Asset).filter(
        Asset.is_main == True,
        Asset.is_adult == False,
        func.lower(Asset.super_asset_nm).like(query_lower)
    ).limit(limit).all()
    
    # 표시에 필요한 상세 정보를 포함한 딕셔너리 목록 반환
    return [
        {
            "idx": asset.idx,
            "full_asset_id": asset.full_asset_id,
            "unique_asset_id": asset.unique_asset_id,
            "asset_nm": asset.asset_nm,
            "super_asset_nm": asset.super_asset_nm,
            "actr_disp": asset.actr_disp,
            "genre": asset.genre,
            "degree": asset.degree,
            "asset_time": asset.asset_time,
            "rlse_year": asset.rlse_year,
            "smry": asset.smry,
            "epsd_no": asset.epsd_no,
            "is_adult": asset.is_adult,
            "is_movie": asset.is_movie,
            "is_drama": asset.is_drama,
            "is_main": asset.is_main,
            "keyword": asset.keyword,
            "poster_path": asset.poster_path,
            "smry_shrt": getattr(asset, "smry_shrt", None)
        } for asset in results
    ]

def is_adult_search_assets(db=None, query: str = "", limit: int = 10):
    """
    모든 컨텐츠 검색 함수 (성인 컨텐츠 포함)
    """
    # db가 None이면 세션 새로 생성
    if db is None:
        db = next(get_db())
        
    query_lower = f"%{query.lower()}%"
    # Use SQLAlchemy ORM to query the database directly
    results = db.query(Asset).filter(
        Asset.is_main == True,
        func.lower(Asset.super_asset_nm).like(query_lower)
    ).limit(limit).all()
    
    # 표시에 필요한 상세 정보를 포함한 딕셔너리 목록 반환
    return [
        {
            "idx": asset.idx,
            "full_asset_id": asset.full_asset_id,
            "unique_asset_id": asset.unique_asset_id,
            "asset_nm": asset.asset_nm,
            "super_asset_nm": asset.super_asset_nm,
            "actr_disp": asset.actr_disp,
            "genre": asset.genre,
            "degree": asset.degree,
            "asset_time": asset.asset_time,
            "rlse_year": asset.rlse_year,
            "smry": asset.smry,
            "epsd_no": asset.epsd_no,
            "is_adult": asset.is_adult,
            "is_movie": asset.is_movie,
            "is_drama": asset.is_drama,
            "is_main": asset.is_main,
            "keyword": asset.keyword,
            "poster_path": asset.poster_path,
            "smry_shrt": getattr(asset, "smry_shrt", None)
        } for asset in results
    ]

def advanced_search_assets(db=None, query: str = "", limit: int = 10, 
                        genre: str = None, release_year: int = None, 
                        is_adult: bool = False, is_movie: bool = None):
    """
    고급 컨텐츠 검색 함수 (다양한 필터링 지원)
    
    Args:
        db: 데이터베이스 세션 (없으면 자동으로 생성)
        query: 검색어
        limit: 결과 개수 제한
        genre: 장르 필터
        release_year: 출시 년도 필터
        is_adult: 성인 컨텐츠 포함 여부
        is_movie: 영화만 검색할지 여부
    
    Returns:
        검색 조건에 맞는 자산 정보 딕셔너리 목록
    """
    # db가 None이면 세션 새로 생성
    if db is None:
        db = next(get_db())
        
    query_lower = f"%{query.lower()}%"
    
    # 기본 쿼리 구성
    base_query = db.query(Asset).filter(
        Asset.is_main == True,
        func.lower(Asset.super_asset_nm).like(query_lower)
    )
    
    # 성인 컨텐츠 제외 (요청하지 않은 경우)
    if not is_adult:
        base_query = base_query.filter(Asset.is_adult == False)
    
    # 추가 필터 적용
    if genre:
        base_query = base_query.filter(func.lower(Asset.genre).like(f"%{genre.lower()}%"))
    
    if release_year:
        base_query = base_query.filter(Asset.rlse_year == release_year)
    
    if is_movie is not None:
        base_query = base_query.filter(Asset.is_movie == is_movie)
    
    # 결과 가져오기
    results = base_query.limit(limit).all()
    
    # 표시에 필요한 상세 정보를 포함한 딕셔너리 목록 반환
    return [
        {
            "idx": asset.idx,
            "full_asset_id": asset.full_asset_id,
            "unique_asset_id": asset.unique_asset_id,
            "asset_nm": asset.asset_nm,
            "super_asset_nm": asset.super_asset_nm,
            "actr_disp": asset.actr_disp,
            "genre": asset.genre,
            "degree": asset.degree,
            "asset_time": asset.asset_time,
            "rlse_year": asset.rlse_year,
            "smry": asset.smry,
            "epsd_no": asset.epsd_no,
            "is_adult": asset.is_adult,
            "is_movie": asset.is_movie,
            "is_drama": asset.is_drama,
            "is_main": asset.is_main,
            "keyword": asset.keyword,
            "poster_path": asset.poster_path,
            "smry_shrt": getattr(asset, "smry_shrt", None)
        } for asset in results
    ]
