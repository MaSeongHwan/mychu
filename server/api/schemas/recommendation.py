from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class RecommendationItem(BaseModel):
    """
    Recommendation item schema for a single content asset
    """
    asset_idx: int
    asset_nm: str
    poster_path: str = ""
    genre: str = ""
    release_year: Optional[int] = None
    is_movie: Optional[bool] = None
    
    # Enable ORM mode with new Pydantic v2 syntax
    model_config = ConfigDict(from_attributes=True)

class RecommendationResponse(BaseModel):
    """
    Schema for the recommendation endpoint response
    """
    items: List[RecommendationItem]
