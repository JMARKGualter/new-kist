# app/endpoints/articles.py
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.schemas import ArticleCreate, ArticleResponse
from app.crud import create_article, get_articles_by_type, get_article_by_id, update_article, delete_article
from app.utils import save_image

router = APIRouter()

@router.post("/articles/", response_model=ArticleResponse)
async def create_article_endpoint(
    article_type: str,
    article_title: str,
    thumbnail_description: str,
    image1_description: str,
    article_thumbnail: UploadFile = File(...),       # Required thumbnail image
    image_1: UploadFile = File(...),                 # Required primary image
    image_2: Optional[UploadFile] = File(None),      # Optional images
    image2_description: Optional[str] = None,
    image_3: Optional[UploadFile] = File(None),
    image3_description: Optional[str] = None,
    image_4: Optional[UploadFile] = File(None),
    image4_description: Optional[str] = None,
    image_5: Optional[UploadFile] = File(None),
    image5_description: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Save images and create a dictionary of image paths
    image_paths = {
        "article_thumbnail": save_image(article_thumbnail),
        "image_1": save_image(image_1),
        "image_2": save_image(image_2) if image_2 else None,
        "image_3": save_image(image_3) if image_3 else None,
        "image_4": save_image(image_4) if image_4 else None,
        "image_5": save_image(image_5) if image_5 else None
    }

    # Create an ArticleCreate schema with the data
    article_data = ArticleCreate(
        article_type=article_type,
        article_title=article_title,
        thumbnail_description=thumbnail_description,
        image1_description=image1_description,
        image2_description=image2_description,
        image3_description=image3_description,
        image4_description=image4_description,
        image5_description=image5_description
    )

    # Save the article using the CRUD function
    new_article = create_article(db, article_data, image_paths)
    return new_article


@router.get("/articles/type/{article_type}", response_model=list[ArticleResponse])
async def get_articles_by_type_endpoint(article_type: str, db: Session = Depends(get_db)):
    return get_articles_by_type(db, article_type)

@router.get("/articles/{article_id}", response_model=ArticleResponse)
async def get_article_by_id_endpoint(article_id: int, db: Session = Depends(get_db)):
    article = get_article_by_id(db, article_id)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@router.put("/articles/{article_id}", response_model=ArticleResponse)
async def update_article_endpoint(article_id: int, article: ArticleCreate, db: Session = Depends(get_db)):
    updated_article = update_article(db, article_id, article)
    if updated_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return updated_article

@router.delete("/articles/{article_id}", response_model=ArticleResponse)
async def delete_article_endpoint(article_id: int, db: Session = Depends(get_db)):
    deleted_article = delete_article(db, article_id)
    if deleted_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return deleted_article