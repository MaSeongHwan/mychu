from pydantic import BaseModel
from typing import Optional

class AssetCreate(BaseModel):
    full_asset_id: str
    unique_asset_id: str
    asset_nm: str
    super_asset_nm: str
    actr_disp: Optional[str] = None
    genre: Optional[str] = None
    degree: Optional[int] = None
    asset_time: Optional[int] = None
    rlse_year: Optional[int] = None
    smry: Optional[str] = None
    epsd_no: Optional[int] = 0
    is_adult: Optional[bool] = False
    is_movie: Optional[bool] = False
    is_drama: Optional[bool] = False
    is_main: Optional[bool] = False
    keyword: Optional[str] = None
    poster_path: Optional[str] = None

class AssetOut(BaseModel):
    idx: int
    full_asset_id: str
    unique_asset_id: str
    asset_nm: str
    super_asset_nm: str
    actr_disp: Optional[str]
    genre: Optional[str]
    degree: Optional[int]
    asset_time: Optional[int]
    rlse_year: Optional[int]
    smry: Optional[str]
    epsd_no: int
    is_adult: bool
    is_movie: bool
    is_drama: bool
    is_main: bool
    keyword: Optional[str]
    poster_path: Optional[str]

    class Config:
        orm_mode = True