# Server Routes Backup Documentation

This file contains backups of the Python code from the deprecated `server/routes` directory.
These routes have been replaced by equivalent functionality in `server/api/routes`.

## user.py

```python
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import re
import logging
import traceback
from server.core.database import get_db
from server.models.user import User
from server.schemas import FirebaseUserCreate, FirebaseUserRead, UserRead
from server.core.firebase import init_firebase
from firebase_admin import auth
from sqlalchemy import func

router = APIRouter(tags=["users"])

@router.get("/", response_model=List[UserRead])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return [{"user_index": user.user_index, 
             "age_avg": user.age_avg,
             "main_channels": user.main_channels,
             "use_tms": user.use_tms,
             "cnt": user.cnt} for user in users]

@router.get("/{user_index}")
def get_user(user_index: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_index == user_index).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/")
def create_user(user_index: int, sha2_hash: str, db: Session = Depends(get_db)):
    db_user = User(user_index=user_index, sha2_hash=sha2_hash)
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# Firebase token verification
async def verify_firebase_token(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    if not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Invalid authorization format. Must be 'Bearer <token>'")
    
    token = authorization.split(' ')[1]
    if not token or token == 'undefined' or token == 'null':
        raise HTTPException(status_code=401, detail="Empty or invalid token")
    
    try:
        # 토큰이 너무 길거나 형식이 이상한지 기본 검사
        if len(token) < 10 or len(token) > 2000:  # JWT 토큰은 일반적으로 이 범위 내
            raise HTTPException(status_code=401, detail="Token length is invalid")
        
        # Firebase Admin SDK를 통해 JWT 토큰 검증
        decoded_token = auth.verify_id_token(token)
        
        # 필수 클레임 확인
        if 'uid' not in decoded_token:
            raise HTTPException(status_code=401, detail="Token does not contain user ID")
        
        # 토큰 만료 시간 체크
        if 'exp' in decoded_token and decoded_token['exp'] < datetime.now().timestamp():
            raise HTTPException(status_code=401, detail="Token has expired")
            
        return decoded_token
    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token format: {str(e)}")
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token has expired. Please login again.")
    except auth.RevokedIdTokenError:
        raise HTTPException(status_code=401, detail="Token has been revoked. Please login again.")
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid token. Please login again.")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from datetime import datetime
import logging, re, traceback

from server.models.user import User
from server.schemas.user import UserRegister, UserRead
from server.core.dependencies import get_db, verify_firebase_token

router = APIRouter()

@router.post("/auth/register", response_model=UserRead)
async def register_user(
    user_data: UserRegister,
    token_data: dict = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    logger = logging.getLogger("uvicorn")
    logger.info(f"📉 Registration attempt for: {user_data.email} with Firebase UID: {user_data.sha2_hash}")

    try:
        # UID 검사
        if token_data['uid'] != user_data.sha2_hash:
            logger.warning(f"UID mismatch: {token_data['uid']} vs {user_data.sha2_hash}")
            raise HTTPException(status_code=401, detail="Token UID does not match request UID")

        # 이메일 형식 검사
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{1,}$'
        if not user_data.email or not re.match(email_regex, user_data.email):
            logger.warning(f"Invalid email: {user_data.email}")
            raise HTTPException(status_code=400, detail="Invalid email format")

        # 중복 사용자 검사
        existing_user = db.query(User).filter(User.sha2_hash == user_data.sha2_hash).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")

        # 신규 사용자 생성
        new_user = User(
            sha2_hash=user_data.sha2_hash,
            email=user_data.email,
            nick_name=user_data.nickname,
            birth=user_data.birthdate,
            terms_agreed_at=user_data.terms_agreed_at,
            is_adult=user_data.is_adult,
            sec_password=user_data.sec_password,
            created_at=datetime.utcnow()
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        logger.info(f"✅ Registered user: {new_user.email} (UID: {new_user.sha2_hash})")
        return new_user

    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Database error")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error")

@router.get("/auth/me", response_model=UserRead)
async def get_current_user(
    token_data: dict = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    uid = token_data['uid']
    user = db.query(User).filter(User.sha2_hash == uid).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("/auth/{firebase_uid}/dataset", response_model=Optional[UserRead])
async def get_user_dataset(firebase_uid: str, db: Session = Depends(get_db)):
    logger = logging.getLogger("uvicorn")

    try:
        # 1. sha2_hash 컬럼을 기준으로 사용자 조회
        user = db.query(User).filter(User.sha2_hash == firebase_uid).first()
        if not user:
            logger.warning(f"❌ User not found for UID: {firebase_uid}")
            raise HTTPException(status_code=404, detail="User not found")

        logger.info(f"✅ User found: user_idx={user.user_idx}")

        # 2. 반환 스키마에 맞게 가공
        return {
            "user_index": user.user_idx,
            "age_avg": user.age,
            "main_channels": None,
            "use_tms": None,
            "cnt": None
        }

    except Exception as e:
        logger.error(f"💥 Error in get_user_dataset: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
```

## asset.py

```python
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
```

## log.py

```python
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
```

## recommendations.py

```python
from fastapi import APIRouter, Depends, HTTPException
from server.core.database import get_db
from sqlalchemy.orm import Session
import logging
import random

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 더미 데이터 설정
DUMMY_MOVIES = [
    {
        "idx": i,
        "asset_nm": f"영화 제목 {i}",
        "poster_path": f"https://picsum.photos/300/450?random={i}",
        "genre": "액션/드라마"
    } for i in range(1, 11)
]

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

# 레거시 추천 라우트는 server/api/routes/recommendation_test.py로 이전되었습니다.
# /recommendations/top, /recommendations/emotion, /recommendations/recent 엔드포인트는
# /recommendation/top, /recommendation/emotion, /recommendation/recent로 대체되었습니다.
```

## __init__.py

```python
# The file is empty
```
