from pydantic import BaseModel
from typing import Optional

class RecommendationItem(BaseModel):
    """
    Recommendation item schema for a single content asset
    """
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

class RecommendationResponse(BaseModel):
    """
    Schema for the recommendation endpoint response
    """
    items: list[RecommendationItem]
