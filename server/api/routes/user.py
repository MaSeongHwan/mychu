from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from server.core.database import get_db
from server.core.firebase_auth import init_firebase
from server.models.user import User as UserModel, UserLog, MyList
from server.api.schemas.user import User as UserSchema, UserCreate, UserRegister

from firebase_admin import auth, exceptions as firebase_exceptions
from datetime import datetime, date
from typing import Optional
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_age_range(birth: date) -> int:
    """생년월일로부터 나이대(10, 20, 30, 40, 50)를 반환합니다."""
    today = date.today()
    age = today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))
    # 10, 20, 30, 40, 50단위로 변환 (만 10~19: 10, 만 20~29: 20, ...)
    if age < 10:
        return 10
    elif age < 20:
        return 10
    elif age < 30:
        return 20
    elif age < 40:
        return 30
    elif age < 50:
        return 40
    else:
        return 50

def is_adult(age_range: int) -> bool:
    """나이대에 따라 성인 여부를 판단합니다."""
    # 만 20세(20~) 이상만 True
    return age_range >= 20

router = APIRouter(tags=["users"])

# ------------------------ 기본 User API ------------------------

@router.post("/", response_model=UserSchema)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = UserModel(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/{user_id}", response_model=UserSchema)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.user_idx == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# ------------------------ Firebase 인증 ------------------------
# Firebase 토큰 검증 함수
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

# Firebase 사용자 등록 엔드포인트
@router.post("/auth/register", response_model=UserSchema)
async def register_firebase_user(
    user: UserRegister,
    token_data: dict = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    # 토큰에서 추출한 UID와 요청 본문의 UID가 일치하는지 확인
    # 클라이언트가 JWT로 인증했을 때, 해당 JWT 내부의 UID와 요청에 포함된 UID가 같아야 함
    if token_data['uid'] != user.sha2_hash:
        raise HTTPException(status_code=401, detail="Token UID does not match request UID")    # 기존 사용자 확인
    existing = db.query(UserModel).filter(UserModel.sha2_hash == user.sha2_hash).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # 생년월일이 문자열로 오면 Date 객체로 변환
    if isinstance(user.birth, str):
        try:
            user.birth = datetime.strptime(user.birth, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid birthdate format. Use YYYY-MM-DD")
              # 나이대와 성인 여부 자동 계산
    age_range = get_age_range(user.birth)
    adult = is_adult(age_range)    # 새 사용자 객체 생성 (필요한 필드만 설정)
    db_user = UserModel(
        sha2_hash=user.sha2_hash,
        age=age_range,
        created_at=datetime.now(),
        birth=user.birth,
        is_adult=adult,
        sec_password=user.sec_password,  # UserRegister에서 가져옴
        nick_name=user.nick_name
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create user")

# 현재 사용자 정보 조회
@router.get("/auth/me", response_model=UserSchema)
async def get_current_user(
    token_data: dict = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    try:
        # JWT 토큰 내부에 포함된 UID 추출
        firebase_uid = token_data.get('uid')
        if not firebase_uid:
            logger.error("토큰에 UID가 없습니다")
            raise HTTPException(status_code=401, detail="Invalid token: missing UID")
        
        logger.info(f"사용자 정보 조회: UID={firebase_uid}")
          # 추출한 UID로 데이터베이스에서 사용자 정보 조회
        user = db.query(UserModel).filter(UserModel.sha2_hash == firebase_uid).first()
        if not user:
            logger.warning(f"사용자를 찾을 수 없음: UID={firebase_uid}")
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"사용자 조회 성공: {user.nick_name}")
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"사용자 정보 조회 중 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching user data: {str(e)}")