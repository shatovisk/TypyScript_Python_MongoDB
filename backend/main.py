from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()  # Загрузка переменных окружения из .env файла

app = FastAPI()
client = AsyncIOMotorClient(os.getenv('MONGO_URI'))
db = client.books

class Book(BaseModel):
    title: str
    description: str
    cover: str

class BookInDB(Book):
    id: str

@app.post("/books", response_model=BookInDB)
async def create_book(book: Book):
    book_dict = book.dict()
    result = await db["books"].insert_one(book_dict)
    return BookInDB(**book_dict, id=str(result.inserted_id))

@app.get("/books", response_model=list[BookInDB])
async def get_books(skip: int = 0, limit: int = 10):
    cursor = db["books"].find().skip(skip).limit(limit)
    books = await cursor.to_list(length=limit)
    return [BookInDB(**book, id=str(book["_id"])) for book in books]