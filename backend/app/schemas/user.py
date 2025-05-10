# app/schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# Base properties shared by different user schemas
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: bool = True
    # Add other fields like name if needed
    full_name: Optional[str] = None

# Properties required during user creation
class UserCreate(UserBase):
    email: EmailStr
    password: str = Field(..., min_length=8) # Ensure password has min length

# Properties to return via API (never return password hash)
class UserPublic(UserBase):
    id: Optional[str] = None # Representing MongoDB ObjectId as string eventually
    # email should be included here if you want to display it
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None

    class Config:
        # Removed orm_mode, Pydantic v2 uses model_validate
         pass # No specific config needed for basic conversion now