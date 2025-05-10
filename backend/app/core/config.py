# app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict # Import SettingsConfigDict
import secrets

class Settings(BaseSettings):
    # --- Project Config ---
    PROJECT_NAME: str = "FlickAI Backend"
    API_V1_STR: str = "/api/v1"

    # --- JWT Settings ---
    SECRET_KEY: str = "default_secret_replace_me_in_prod" # Default if not in .env
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # --- Database ---
    MONGODB_CONNECTION_STRING: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "movie_db"

    # --- AI Model Settings ---
    SENTENCE_MODEL_NAME: str = 'all-MiniLM-L6-v2'

    # --- External API Keys ---
    TMDB_API_KEY: str = "YOUR_TMDB_API_KEY_DEFAULT" # Default if not in .env

    # --- Pydantic-Settings Configuration ---
    # Use model_config instead of inner Config class for v2
    model_config = SettingsConfigDict(
        env_file='.env',             # Load .env file
        env_file_encoding='utf-8',
        extra='ignore'               # Ignore extra fields in .env
    )

settings = Settings()

# --- Security Warning ---
if settings.SECRET_KEY == "default_secret_replace_me_in_prod":
    print("WARNING: Using default SECRET_KEY. Generate a strong key for production and set it in .env!")
if settings.TMDB_API_KEY == "YOUR_TMDB_API_KEY_DEFAULT":
    print("WARNING: TMDB_API_KEY not set in .env file. Enrichment script will fail.")