from sqlalchemy import Column, String, Text
from .base import Base

class Asset(Base):
    __tablename__ = "asset"
    full_asset_id = Column(String(100), primary_key=True)
    asset_nm = Column(Text)
    genre = Column(Text)
    cleaned_smry = Column(Text) 