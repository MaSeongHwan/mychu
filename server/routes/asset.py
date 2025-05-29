from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from db import get_db
from models import Asset
from schemas import AssetRead

router = APIRouter()

@router.get("/assets", response_model=list[AssetRead])
async def get_assets(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Asset.actr_disp, Asset.asset_nm, Asset.genre))
    assets = result.all()
    # result.all()은 튜플 리스트이므로 dict로 변환
    return [
        {"actr_disp": a[0], "asset_nm": a[1], "genre": a[2]}
        for a in assets
    ]