# filepath: c:\Users\LG\mychu\server\models\asset.py
from sqlalchemy import Column, Integer, BigInteger, String, Boolean, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import TIMESTAMP
from .base import Base

class Asset(Base):
    __tablename__ = "assets"

    idx = Column(Integer, primary_key=True)
    full_asset_id = Column(Text, unique=True, nullable=False)
    unique_asset_id = Column(Text, nullable=False)
    asset_nm = Column(Text, nullable=False)
    super_asset_nm = Column(Text, nullable=False)
    actr_disp = Column(Text, nullable=True)
    genre = Column(Text, nullable=True)
    degree = Column(Integer, nullable=True)
    asset_time = Column(Integer, nullable=True)
    rlse_year = Column(BigInteger, nullable=True)
    smry = Column(Text, nullable=True)
    epsd_no = Column(Integer, default=0, nullable=False)
    is_adult = Column(Boolean, default=False, nullable=False)
    is_movie = Column(Boolean, default=False, nullable=False)
    is_drama = Column(Boolean, default=False, nullable=False)
    is_main = Column(Boolean, default=False, nullable=False)
    keyword = Column(Text, nullable=True)
    poster_path = Column(Text, nullable=True)
    smry_shrt = Column(Text, nullable=True)
    
    actors = relationship("ActorAsset", back_populates="asset")
    directors = relationship("DirectorAsset", back_populates="asset")
    scores = relationship("Score", back_populates="asset", uselist=False)
    tags = relationship("TagAsset", back_populates="asset")

class Actor(Base):
    __tablename__ = "actor"
    actor_idx = Column(Integer, primary_key=True)
    actor_name = Column(Text, nullable=False)

    assets = relationship("ActorAsset", back_populates="actor")

class ActorAsset(Base):
    __tablename__ = "actorasset"
    asset_idx = Column(Integer, ForeignKey("assets.idx"), primary_key=True)
    actor_idx = Column(Integer, ForeignKey("actor.actor_idx"), primary_key=True)
    role = Column(Boolean, default=False, nullable=False)

    asset = relationship("Asset", back_populates="actors")
    actor = relationship("Actor", back_populates="assets")

class Director(Base):
    __tablename__ = "director"
    director_idx = Column(Integer, primary_key=True)
    director_name = Column(Text, nullable=False, unique=True)

    assets = relationship("DirectorAsset", back_populates="director")

class DirectorAsset(Base):
    __tablename__ = "directorasset"
    asset_idx = Column(Integer, ForeignKey("assets.idx"), primary_key=True)
    director_idx = Column(Integer, ForeignKey("director.director_idx"), primary_key=True)

    asset = relationship("Asset", back_populates="directors")
    director = relationship("Director", back_populates="assets")

class Score(Base):
    __tablename__ = "score"
    asset_idx = Column(Integer, ForeignKey("assets.idx"), primary_key=True)
    cnt = Column(Integer, nullable=False)
    c_rate = Column(Float, nullable=False)
    total_tms_use = Column(Integer, nullable=False)

    asset = relationship("Asset", back_populates="scores")

class Tag(Base):
    __tablename__ = "tags"
    tag_idx = Column(Integer, primary_key=True)
    tag = Column(Text, unique=True, nullable=False)

    assets = relationship("TagAsset", back_populates="tag")

class TagAsset(Base):
    __tablename__ = "tagasset"
    tag_idx = Column(Integer, ForeignKey("tags.tag_idx"), primary_key=True)
    asset_idx = Column(Integer, ForeignKey("assets.idx"), primary_key=True)

    tag = relationship("Tag", back_populates="assets")
    asset = relationship("Asset", back_populates="tags")

class AssetEmotion(Base):
    __tablename__ = "asset_emotion"

    idx = Column(Integer, ForeignKey("assets.idx", ondelete="CASCADE"), primary_key=True)
    full_asset_id = Column(Text, unique=True, nullable=False)
    emotion_anger = Column(Float, nullable=True)
    emotion_anticipation = Column(Float, nullable=True)
    emotion_disgust = Column(Float, nullable=True)
    emotion_fear = Column(Float, nullable=True)
    emotion_joy = Column(Float, nullable=True)
    emotion_negative = Column(Float, nullable=True)
    emotion_positive = Column(Float, nullable=True)
    emotion_sadness = Column(Float, nullable=True)
    emotion_surprise = Column(Float, nullable=True)
    emotion_trust = Column(Float, nullable=True)

    asset = relationship("Asset", backref="emotion", uselist=False)
