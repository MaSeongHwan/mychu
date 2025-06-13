from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional
from datetime import datetime, timedelta
import re
from server.core.database import get_db
from server.models.user import User
from server.models.firebase_user import FirebaseUser
from server.schemas import FirebaseUserCreate, FirebaseUserRead, UserRead
from server.core.firebase import init_firebase
from firebase_admin import auth
from sqlalchemy import func

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

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



@router.post("/auth/register", response_model=FirebaseUserRead)
async def register_firebase_user(
    user_data: FirebaseUserCreate, 
    token_data: dict = Depends(verify_firebase_token),
    db: Session = Depends(get_db)
):
    try:
        # Token UID와 요청 데이터의 UID가 일치하는지 확인
        if token_data['uid'] != user_data.firebase_uid:
            raise HTTPException(
                status_code=401, 
                detail="Token UID does not match request UID"
            )        # 필수 필드 검증
        if not user_data.email or not user_data.firebase_uid or not user_data.nickname:
            raise HTTPException(
                status_code=400,
                detail="Missing required fields: email, firebase_uid, and nickname are required"
            )
            
        print(f"Registering user: {user_data.dict()}")
        
        # 이메일 형식 검증
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{1,}$'
        if not user_data.email or not re.match(email_regex, user_data.email):
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        try:
            # 기존 사용자 확인
            existing_user = db.query(FirebaseUser).filter(
                (FirebaseUser.email == user_data.email) | 
                (FirebaseUser.firebase_uid == user_data.firebase_uid)
            ).first()
            
            if existing_user:
                if existing_user.email == user_data.email:
                    raise HTTPException(status_code=400, detail="Email already registered")
                else:
                    raise HTTPException(status_code=400, detail="User already exists")

        except SQLAlchemyError as e:
            print(f"Database query error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
              # Create new firebase user in local DB
        db_firebase_user = FirebaseUser(
            firebase_uid=user_data.firebase_uid,
            email=user_data.email,
            nickname=user_data.nickname,
            birthdate=user_data.birthdate,
            terms_agreed_at=user_data.terms_agreed_at
        )
        
        # 사용자 테이블에 데이터가 있는지 먼저 확인
        user_count = db.query(func.count(User.user_index)).scalar()
        
        if user_count > 0:
            # 데이터가 있으면 사용 가능한 user_index를 찾습니다
            max_user_index = db.query(func.max(User.user_index)).scalar() or 0
            
            # 기존 사용자 중에서 dataset_user_index로 사용된 적이 없는 값을 찾습니다
            used_indices = db.query(FirebaseUser.dataset_user_index).filter(FirebaseUser.dataset_user_index.isnot(None)).all()
            used_indices = [idx[0] for idx in used_indices]
            
            # 사용 가능한 가장 작은 user_index 찾기
            available_index = 1
            while available_index <= max_user_index + 1:
                if available_index not in used_indices:
                    break
                available_index += 1
                
            db_firebase_user.dataset_user_index = available_index
            print(f"Assigning dataset_user_index: {available_index} to user {user_data.nickname}")
        else:
            # 사용자 테이블이 비어있으면 1부터 시작
            db_firebase_user.dataset_user_index = 1
            print(f"Assigning first dataset_user_index: 1 to user {user_data.nickname}")
        
        try:
            db.add(db_firebase_user)
            db.commit()
            db.refresh(db_firebase_user)
            return db_firebase_user
        except SQLAlchemyError as e:
            db.rollback()
            print(f"Database error during user creation: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to create user account in database"
            )

    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        print(f"Unexpected error during registration: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during registration"
        )

@router.get("/auth/me", response_model=FirebaseUserRead)
async def get_current_user(token_data: dict = Depends(verify_firebase_token), db: Session = Depends(get_db)):
    # JWT 토큰 내부에 포함된 UID 추출
    firebase_uid = token_data['uid']
    
    # 추출한 UID로 데이터베이스에서 사용자 정보 조회
    user = db.query(FirebaseUser).filter(FirebaseUser.firebase_uid == firebase_uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.deleted_at:
        raise HTTPException(status_code=400, detail="User account has been deleted")
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    return user

@router.get("/auth/{firebase_uid}/dataset", response_model=Optional[UserRead])
async def get_user_dataset(firebase_uid: str, db: Session = Depends(get_db)):
    """Get the matching static dataset user data for a Firebase user"""
    firebase_user = db.query(FirebaseUser).filter(FirebaseUser.firebase_uid == firebase_uid).first()
    if not firebase_user:
        raise HTTPException(status_code=404, detail="Firebase user not found")
    
    if firebase_user.dataset_user_index:
        dataset_user = db.query(User).filter(User.user_index == firebase_user.dataset_user_index).first()
        return dataset_user
    
    return None