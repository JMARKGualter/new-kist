# app/crud.py
from sqlalchemy.orm import Session
from app.models import Article
from app.schemas import ArticleCreate
from datetime import datetime
import pytz

def create_article(db: Session, article: ArticleCreate, image_paths: dict):
    db_article = Article(
        article_type=article.article_type,
        article_title=article.article_title,
        article_thumbnail=image_paths["article_thumbnail"],  # Use `article_thumbnail`
        thumbnail_description=article.thumbnail_description,
        image_1=image_paths["image_1"],
        image1_description=article.image1_description,
        image2=image_paths.get("image_2"),
        image2_description=article.image2_description,
        image3=image_paths.get("image_3"),
        image3_description=article.image3_description,
        image4=image_paths.get("image_4"),
        image4_description=article.image4_description,
        image5=image_paths.get("image_5"),
        image5_description=article.image5_description,
        created_at=datetime.now(pytz.timezone('Asia/Manila')),
        updated_at=datetime.now(pytz.timezone('Asia/Manila'))
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def get_articles_by_type(db: Session, article_type: str):
    return db.query(Article).filter(Article.article_type == article_type).all()

def get_article_by_id(db: Session, article_id: int):
    return db.query(Article).filter(Article.id == article_id).first()

def update_article(db: Session, article_id: int, updated_data: ArticleCreate):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if db_article:
        for key, value in updated_data.dict(exclude_unset=True).items():
            setattr(db_article, key, value)
        db_article.updated_at = datetime.now(pytz.timezone('Asia/Manila'))
        db.commit()
        db.refresh(db_article)
    return db_article

def delete_article(db: Session, article_id: int):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if db_article:
        db.delete(db_article)
        db.commit()
    return db_article
