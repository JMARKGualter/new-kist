# app/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ArticleCreate(BaseModel):
    article_type: str
    article_title: str
    thumbnail_description: str
    image1_description: str
    image2_description: Optional[str] = None
    image3_description: Optional[str] = None
    image4_description: Optional[str] = None
    image5_description: Optional[str] = None

class ArticleResponse(BaseModel):
    id: int
    article_type: str
    article_title: str
    article_thumbnail: str
    thumbnail_description: str
    image_1: str
    image1_description: str
    image2: Optional[str] = None
    image2_description: Optional[str] = None
    image3: Optional[str] = None
    image3_description: Optional[str] = None
    image4: Optional[str] = None
    image4_description: Optional[str] = None
    image5: Optional[str] = None
    image5_description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
