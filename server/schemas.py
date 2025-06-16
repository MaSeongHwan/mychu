from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class FirebaseUserBase(BaseModel):
    email: str  # Changed from EmailStr to str to avoid dependency
    nickname: str

class FirebaseUserCreate(FirebaseUserBase):
    firebase_uid: str
    terms_agreed_at: datetime
    birthdate: Optional[datetime] = None

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "nickname": "username",
                "firebase_uid": "firebase123",
                "terms_agreed_at": "2025-06-05T00:00:00Z",
                "birthdate": "2000-01-01T00:00:00Z"
            }
        }

class FirebaseUserRead(FirebaseUserBase):
    id: int
    firebase_uid: str
    created_at: datetime
    last_login: Optional[datetime] = None
    dataset_user_index: Optional[int] = None
    
    class Config:
        from_attributes = True

class UserRead(BaseModel):
    user_index: int
    age_avg: Optional[int] = None
    main_channels: Optional[str] = None
    use_tms: Optional[int] = None
    cnt: Optional[int] = None

    class Config:
        from_attributes = True
        # 필드 명칭 매핑 추가 (user_idx → user_index)
        json_schema_extra = {
            "example": {
                "user_index": 1,
                "age_avg": 30,
                "main_channels": "netflix",
                "use_tms": 1,
                "cnt": 10
            }
        }
