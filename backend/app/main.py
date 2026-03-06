# app/main.py
from fastapi import FastAPI
from app.endpoints import articles
from app.database import engine, Base

app = FastAPI()

# Initialize the database
Base.metadata.create_all(bind=engine)

# Register the router
app.include_router(articles.router, prefix="/api", tags=["articles"])
