from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from server.core.database import get_db
from server.models.asset import Asset
from server.api.schemas.asset import AssetOut

router = APIRouter(
    tags=["assets"]
)

@router.get("/main", response_model=List[AssetOut])
def read_main_assets(db: Session = Depends(get_db)):
    """
    is_main == True 인 에셋 전부를 반환
    """
    assets = db.query(Asset).filter(Asset.is_main == True).all()
    return assets

@router.get("/filter", response_model=List[AssetOut])
def filter_assets(
    # Boolean 필터들 (None이면 필터 적용 안 함)
    is_adult: Optional[bool] = Query(None, description="성인 콘텐츠 포함 여부"),
    is_movie: Optional[bool] = Query(None, description="영화만 필터링"),
    is_drama: Optional[bool] = Query(None, description="드라마만 필터링"),
    is_main: Optional[bool] = Query(None, description="메인 추천만 필터링"),
    # 장르 필터
    genre: Optional[str] = Query(None, description="장르 이름"),
    # 페이징/정렬 등 추가 파라미터도 여기 붙일 수 있음
    db: Session = Depends(get_db),
):
    """
    동적인 조합 필터링
    ```
    GET /assets/filter?
      is_adult=false&
      is_movie=true&
      is_main=true&
      genre=코미디
    ```
    """
    q = db.query(Asset)
    if is_adult is not None:
        q = q.filter(Asset.is_adult == is_adult)
    if is_movie is not None:
        q = q.filter(Asset.is_movie == is_movie)
    if is_drama is not None:
        q = q.filter(Asset.is_drama == is_drama)
    if is_main is not None:
        q = q.filter(Asset.is_main == is_main)
    if genre:
        q = q.filter(Asset.genre == genre)
    return q.all()


@router.get("/{asset_id}", response_model=AssetOut)
def read_asset(asset_id: int, db: Session = Depends(get_db)):
    """
    단일 에셋 조회 (조건 없이 PK 기준)
    """
    asset = db.query(Asset).filter(Asset.idx == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset