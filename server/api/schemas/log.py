from pydantic import BaseModel
from datetime import datetime

class Product(BaseModel):
    product_idx: int
    product_name: str

    class Config:
        from_attributes = True

class ProductKeyword(BaseModel):
    product_idx: int
    keywords: str

    class Config:
        from_attributes = True

class VODLog(BaseModel):
    log_idx: int
    user_idx: int
    asset_idx: int
    strt_dt: datetime
    use_tms: int
    feedback: int

    class Config:
        orm_mode = True

class RecList(BaseModel):
    user_idx: int
    asset_idx: int
    rnk: int

    class Config:
        orm_mode = True

class RecAdultList(BaseModel):
    user_idx: int
    asset_idx: int
    rnk: int

    class Config:
        orm_mode = True