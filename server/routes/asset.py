from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from server.core.database import get_db
from server.models.asset import Asset, ActorAsset, DirectorAsset, TagAsset, Score

router = APIRouter(
    prefix="/assets",
    tags=["assets"]
)

@router.get("/", response_model=List[dict])
def get_assets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    assets = db.query(Asset).offset(skip).limit(limit).all()
    return assets

@router.get("/{asset_index}")
def get_asset(asset_index: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.asset_index == asset_index).first()
    if asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset

# --- 배우 목록만 조회 ---
@router.get("/{asset_id}/actors", response_model=List[dict])
def get_asset_actors(asset_id: int, db: Session = Depends(get_db)):
    asset = (
        db.query(Asset)
          .options(selectinload(Asset.actors).selectinload(ActorAsset.actor))
          .filter(Asset.idx == asset_id)
          .first()
    )
    if not asset:
        raise HTTPException(404, detail="Asset not found")
    # ActorAsset 객체 대신 순수 배우 정보만 반환
    return [aa.actor for aa in asset.actors]

# --- 감독 목록만 조회 ---
@router.get("/{asset_id}/directors", response_model=List[dict])
def get_asset_directors(asset_id: int, db: Session = Depends(get_db)):
    asset = (
        db.query(Asset)
          .options(selectinload(Asset.directors).selectinload(DirectorAsset.director))
          .filter(Asset.idx == asset_id)
          .first()
    )
    if not asset:
        raise HTTPException(404, detail="Asset not found")
    return [da.director for da in asset.directors]

# --- 태그 목록만 조회 ---
@router.get("/{asset_id}/tags", response_model=List[dict])
def get_asset_tags(asset_id: int, db: Session = Depends(get_db)):
    asset = (
        db.query(Asset)
          .options(selectinload(Asset.tags).selectinload(TagAsset.tag))
          .filter(Asset.idx == asset_id)
          .first()
    )
    if not asset:
        raise HTTPException(404, detail="Asset not found")
    return [ta.tag for ta in asset.tags]

# --- 평점(Score)만 조회 ---
@router.get("/{asset_id}/score", response_model=dict)
def get_asset_score(asset_id: int, db: Session = Depends(get_db)):
    score = (
        db.query(Score)
          .filter(Score.asset_idx == asset_id)
          .first()
    )
    if not score:
        raise HTTPException(404, detail="Score not found")
    return score

@router.get("/search/")
def search_assets(
    query: Optional[str] = None,
    genre: Optional[str] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    search_query = db.query(Asset)
    
    if query:
        search_query = search_query.filter(Asset.asset_nm.ilike(f"%{query}%"))
    if genre:
        search_query = search_query.filter(Asset.genre.ilike(f"%{genre}%"))
    if year:
        search_query = search_query.filter(Asset.rlse_year == year)
    
    results = search_query.limit(20).all()
    return results