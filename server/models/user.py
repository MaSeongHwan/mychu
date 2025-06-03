from sqlalchemy import Column, String, Float, Integer, Text
from .base import Base

class User(Base):
    __tablename__ = "users"
    sha2_hash = Column(String(256), primary_key=True)
    age_avg = Column(Float)
    main_channels = Column(Text)
    use_tms = Column(Float)
    cnt = Column(Integer) 