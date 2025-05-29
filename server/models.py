from sqlalchemy import Column, Float, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    sha2_hash = Column(String(256), primary_key=True)
    age_avg = Column(Float)
    main_channels = Column(String)
    use_tms = Column(Float)
    cnt = Column(Integer)

class Asset(Base):
    __tablename__ = "asset"
    full_asset_id = Column(String(100), primary_key=True)
    rlse_year = Column(Integer)
    genre = Column(String)
    actr_disp = Column(String)
    orgnl_cntry = Column(String)
    combined = Column(String)
    cleaned_smry = Column(String)
    total_use_tms = Column(Integer)
    cnt = Column(Integer)
    asset_time = Column(Integer)
    c_rate = Column(Float)
    asset_nm = Column(String)

class Log(Base):
    __tablename__ = "log"
    id = Column(Integer, primary_key=True, autoincrement=True)
    sha2_hash = Column(String(256), ForeignKey('users.sha2_hash'))
    asset_id = Column(String(100), ForeignKey('asset.full_asset_id'))
    strt_dt = Column(DateTime)
    use_tms = Column(Integer)
    c_rate = Column(Float)
    index_cnt = Column(Integer)
