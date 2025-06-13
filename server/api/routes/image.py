from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from server.core.database import get_db
from server.models.asset import Asset

router = APIRouter(
    prefix="/images",
    tags=["images"]
)

@router.get("/", response_model=List[dict])
def get_images(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    assets = db.query(Asset).filter(Asset.poster_path != None).offset(skip).limit(limit).all()
    return [{"id": asset.idx, "full_asset_id": asset.full_asset_id, "image_url": asset.poster_path} for asset in assets]

@router.get("/{full_asset_id}")
def get_image(full_asset_id: str, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.full_asset_id == full_asset_id).first()
    if asset is None or asset.poster_path is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"id": asset.idx, "full_asset_id": asset.full_asset_id, "image_url": asset.poster_path}

@router.get("/super/{super_asset_nm}")
def get_images_by_super_name(super_asset_nm: str, db: Session = Depends(get_db)):
    assets = db.query(Asset).filter(Asset.super_asset_nm == super_asset_nm, Asset.poster_path != None).all()
    if not assets:
        raise HTTPException(status_code=404, detail="No images found for this super asset name")
    return [{"id": asset.idx, "full_asset_id": asset.full_asset_id, "image_url": asset.poster_path} for asset in assets]
