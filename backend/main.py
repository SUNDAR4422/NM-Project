# app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
# SentenceTransformer is loaded in endpoints/recommendations.py now
# from sentence_transformers import SentenceTransformer
# import torch

from app.models import Movie, User # Import models needed for init_beanie
from app.core.config import settings

# Import API Routers
from app.api.endpoints import auth as auth_router
from app.api.endpoints import users as users_router
from app.api.endpoints import recommendations as recommendations_router # <-- IMPORT NEW ROUTER

# FastAPI App Initialization
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.5.0", # Version bump
    description="API for FlickAI movie recommendations with authentication and recommendations endpoint."
)

# CORS Middleware (remains same)
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize Beanie and connect to MongoDB."""
    print("Starting up application...")
    client = AsyncIOMotorClient(settings.MONGODB_CONNECTION_STRING)
    db = client[settings.DATABASE_NAME]
    await init_beanie(database=db, document_models=[Movie, User])
    print(f"Beanie initialized with database '{settings.DATABASE_NAME}'.")
    print("Application startup complete.")

# --- API Routers ---
app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users_router.router, prefix="/api/v1/users", tags=["Users"])
# --- INCLUDE RECOMMENDATIONS ROUTER ---
app.include_router(recommendations_router.router, prefix="/api/v1", tags=["Recommendations"])
# ---

# --- Root Endpoint ---
@app.get("/")
async def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}!"}