from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class SearchItem(BaseModel):
    """Search result item schema with detailed asset information"""
    asset_idx: int
    asset_nm: str
    genre: str
    release_year: int
    poster_path: Optional[str] = None
    is_movie: bool
    
    # Enable ORM mode to work with SQLAlchemy models
    model_config = ConfigDict(from_attributes=True)

class SearchResponse(BaseModel):
    """Search response schema"""
    results: List[SearchItem]
