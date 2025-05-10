# app/api/deps.py
from typing import Generator, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from app.models import User, TokenData
from app.core import security
from app.core.config import settings

# --- UPDATE THIS LINE ---
# Point tokenUrl to the actual endpoint path including router prefix
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")
# --- END OF UPDATE ---

async def get_current_user(token: str = Depends(oauth2_scheme)) -> Optional[User]:
    """
    Dependency to get the current user from the token.
    Raises HTTPException if token is invalid or user not found.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    user = await User.find_one(User.email == token_data.email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency to get the current *active* user.
    Raises HTTPException if user is inactive.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user