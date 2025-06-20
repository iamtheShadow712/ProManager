from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from uuid import UUID

class UserBase(BaseModel):
    username: str
    full_name: str
    email: EmailStr
    profile_pic: Optional[str] = None
    
class UserRegister(UserBase):
    password: str
    
class UserLogin(BaseModel):
    username: str
    password: str
   
class UserResponse(BaseModel):
    created_at: datetime
    id: UUID 
    username: str
    full_name: str
    email: EmailStr
    profile_pic: Optional[str] = None
    
class Token(BaseModel):
    access_token: str
    token_type: str

class LoginResponse(BaseModel):
    token: Token
    user: UserResponse
    