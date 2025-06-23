from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Product(Base):
    __tablename__ = "product"

    product_idx = Column(Integer, primary_key=True)
    product_name = Column(Text, nullable=False, unique=True)

    keywords = relationship("ProductKeyword", back_populates="product")

class ProductKeyword(Base):
    __tablename__ = "productkeyword"

    product_idx = Column(Integer, ForeignKey("product.product_idx"), primary_key=True)
    keywords = Column(Text, primary_key=True)

    product = relationship("Product", back_populates="keywords")
