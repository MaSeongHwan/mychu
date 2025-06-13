from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class UserBase(BaseModel):
    sha2_hash: str  # Firebase UID
    age: Optional[int] = None
    birth: Optional[date] = None
    is_adult: bool = False
    sec_password: str = "0000"
    nick_name: Optional[str] = None

class UserRegister(BaseModel):
    sha2_hash: str  # Firebase UID
    email: str
    nick_name: str
    birth: date
    terms_agreed_at: datetime
    is_adult: bool = False
    sec_password: str = "0000"

    class Config:
        from_attributes = True  # pydantic v2 방식

class UserCreate(UserBase):
    pass

class User(UserBase):
    user_idx: int
    created_at: datetime

    class Config:
        from_attributes = True  # pydantic v2 방식

class UserLog(BaseModel):
    user_log_idx: int
    user_idx: int
    action_tms: datetime
    action: int

    class Config:
        from_attributes = True

class MyList(BaseModel):
    user_idx: int
    asset_idx: int
    action: bool
    time_stamp: datetime

    class Config:
        from_attributes = True