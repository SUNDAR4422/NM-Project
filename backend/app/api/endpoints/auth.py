# app/api/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any

# Import models, schemas
from app.models import User, Token # User is Beanie Document, Token is Pydantic schema
from app.schemas.user import UserCreate, UserPublic # User schemas
# Import security module helpers
from app.core import security as security_helpers
from app.core.config import settings

router = APIRouter()

@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register_new_user(
    *,
    user_in: UserCreate
) -> Any:
    """
    Create new user.
    """
    existing_user = await User.find_one(User.email == user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    hashed_password = security_helpers.get_password_hash(user_in.password)
    user_doc = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        is_active=True
    )
    await user_doc.insert()

    created_user = await User.find_one(User.email == user_in.email)

    if not created_user:
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve user after creation.")

    # --- MODIFIED LINE ---
    # Try dumping the model with mode='json' to force ObjectId -> str conversion
    return created_user.model_dump(mode='json')
    # --- END OF MODIFICATION ---


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = await User.find_one(User.email == form_data.username)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not security_helpers.verify_password(form_data.password, user.hashed_password):
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = security_helpers.create_access_token(
        subject=user.email
    )

    return {"access_token": access_token, "token_type": "bearer"}