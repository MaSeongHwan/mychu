from pydantic import BaseModel
from typing import Optional, List

class SearchItem(BaseModel):
    """Search result item schema with detailed asset information"""
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
    smry_shrt: Optional[str]

    class Config:
        orm_mode = True

class SearchResponse(BaseModel):
    """Search response schema"""
    results: List[SearchItem]
