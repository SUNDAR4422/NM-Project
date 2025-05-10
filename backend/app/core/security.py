# app/core/security.py
from datetime import datetime, timedelta, timezone
from typing import Optional, Any

from jose import jwt, JWTError
from passlib.context import CryptContext

from .config import settings # Import settings from config.py

# Password Hashing Context (using bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = settings.ALGORITHM

def create_access_token(subject: str | Any, expires_delta: timedelta | None = None) -> str:
    """Generates a JWT access token."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hashes a plain password."""
    return pwd_context.hash(password)

# Function to decode token (will be used in dependency)
def decode_token(token: str) -> Optional[str]:
     """Decodes JWT token to get the subject (e.g., email)."""
     try:
         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
         # Ensure 'sub' claim exists
         email: Optional[str] = payload.get("sub")
         if email is None:
              return None
         # Optionally check token expiration here if not handled by jwt.decode
         return email
     except JWTError:
         # Catches invalid signature, expired token etc.
         return None