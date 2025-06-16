from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from server.core.database import get_db
from server.models.log import Product, ProductKeyword
from server.models.user import VodLog

router = APIRouter(
    tags=["logs"]
)

@router.get("/", response_model=List[dict])
def get_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logs = db.query(VodLog).offset(skip).limit(limit).all()
    return logs

@router.get("/vod/{log_idx}")
def get_user_logs(log_idx: int, db: Session = Depends(get_db)):
    logs = db.query(VodLog).filter(VodLog.user_idx == log_idx).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No logs found for this user")
    return logs

@router.post("/")
def create_log(
    user_idx: int,
    asset_idx: int,
    use_tms: Optional[int] = None,
    feedback: Optional[int] = 0,
    db: Session = Depends(get_db)
):
    new_log = VodLog(
        user_idx=user_idx,
        asset_idx=asset_idx,
        use_tms=use_tms,
        feedback=feedback
    )
    try:
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return new_log
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
