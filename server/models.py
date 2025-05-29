from sqlalchemy import Column, Float, String, Integer
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)

class Asset(Base):
    __tablename__ = "asset"
    full_asset_id = Column(String(100), primary_key=True)
    rlse_year = Column(Float)
    genre = Column(String)
    actr_disp = Column(String)
    orgnl_cntry = Column(String)
    combined = Column(String)
    cleaned_smry = Column(String)
    total_use_tms = Column(Float)
    cnt = Column(Float)
    asset_time = Column(Float)
    c_rate = Column(Float)
    asset_nm = Column(String)


