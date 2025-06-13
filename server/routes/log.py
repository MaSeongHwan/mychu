from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from server.core.database import get_db
from server.models.log import Product, ProductKeyword
from server.models.user import VodLog

router = APIRouter(
    prefix="/logs",
    tags=["logs"]
)

@router.get("/", response_model=List[dict])
def get_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logs = db.query(VodLog).offset(skip).limit(limit).all()
    return logs

@router.get("/user/{user_index}")
def get_user_logs(user_index: int, db: Session = Depends(get_db)):
    logs = db.query(VodLog).filter(VodLog.user_idx == user_index).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No logs found for this user")
    return logs

@router.get("/asset/{asset_index}")
def get_asset_logs(asset_index: int, db: Session = Depends(get_db)):
    logs = db.query(VodLog).filter(VodLog.asset_idx == asset_index).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No logs found for this asset")
    return logs

@router.post("/")
def create_log(
    user_index: int,
    asset_index: int,
    use_tms: Optional[int] = None,
    feedback: Optional[int] = None,
    db: Session = Depends(get_db)
):
    new_log = VodLog(
        user_idx=user_index,
        asset_idx=asset_index,
        use_tms=use_tms if use_tms is not None else 0,
        feedback=feedback if feedback is not None else 0
    )
    try:
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return new_log
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
