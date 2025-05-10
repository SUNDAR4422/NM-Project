# app/models.py
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Literal
from beanie import Document
from pydantic_settings import BaseSettings
import pymongo # <-- Import pymongo

# --- Movie Document ---
class Movie(Document):
    movie_id: int
    title: str
    year: Optional[int] = None
    posterUrl: Optional[str] = None
    backdropUrl: Optional[str] = None
    rating: Optional[float] = None
    duration: Optional[int]
    genres: List[str]
    description: Optional[str] = None
    language: Optional[str]
    streamingOn: Optional[List[str]] = None
    isClassic: Optional[bool] = False
    isHiddenGem: Optional[bool] = False
    isTrending: Optional[bool] = False
    description_embedding: Optional[List[float]] = None

    class Settings:
        name = "movies"


# --- User Document ---
class User(Document):
    email: EmailStr
    full_name: Optional[str] = None
    hashed_password: str
    is_active: bool = True
    favorite_movie_ids: List[int] = Field(default_factory=list)

    class Settings:
        name = "users"
        # --- CORRECTED Index Definition ---
        indexes = [
            pymongo.IndexModel([("email", pymongo.ASCENDING)], unique=True),
            # Add other indexes here if needed later, e.g.:
            # pymongo.IndexModel([("favorite_movie_ids", pymongo.ASCENDING)])
        ]
        # --- END CORRECTION ---

# --- Other Schemas/Models (UserPreferences, etc.) ---
# Keep these as they were defined previously
class UserPreferences(BaseModel):
    mood: str
    watchingWith: str
    ageRange: str
    genres: List[str]
    language: str
    duration: int
    preferences: List[Literal['trending', 'classic', 'hidden_gems']]

class RecommendationResponse(BaseModel):
    movies: List[Movie]

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: bool = True
    full_name: Optional[str] = None

class UserCreate(UserBase):
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserPublic(UserBase):
    id: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: bool = True
    favorite_movie_ids: List[int] = []

    class Config:
         pass