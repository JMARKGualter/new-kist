# app/models.py
from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database import Base
from datetime import datetime
import pytz

class Article(Base):
    __tablename__ = "articles"
    
    id = Column(Integer, primary_key=True, index=True)
    article_type = Column(String(50), nullable=False)
    article_title = Column(String(255), nullable=False)
    article_thumbnail = Column(String(255), nullable=False)
    thumbnail_description = Column(Text, nullable=False)
    image_1 = Column(String(255), nullable=False)
    image1_description = Column(Text, nullable=False)
    image2 = Column(String(255), nullable=True)
    image2_description = Column(Text, nullable=True)
    image3 = Column(String(255), nullable=True)
    image3_description = Column(Text, nullable=True)
    image4 = Column(String(255), nullable=True)
    image4_description = Column(Text, nullable=True)
    image5 = Column(String(255), nullable=True)
    image5_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(pytz.timezone('Asia/Manila')))
    updated_at = Column(DateTime, default=lambda: datetime.now(pytz.timezone('Asia/Manila')), onupdate=datetime.now(pytz.timezone('Asia/Manila')))
