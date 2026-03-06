# app/utils.py
import os
from pathlib import Path
from fastapi import UploadFile

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

def save_image(image: UploadFile) -> str:
    if image:
        file_path = UPLOAD_DIR / image.filename
        with file_path.open("wb") as buffer:
            buffer.write(image.file.read())
        return str(file_path)
    return ""
