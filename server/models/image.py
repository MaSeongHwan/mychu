from sqlalchemy import Column, String, Text
from .base import Base

class ImageDB(Base):
    __tablename__ = "imagedb"
    full_asset_id = Column(String(100), primary_key=True)
    asset_nm = Column(Text)
    poster_path = Column(Text) 