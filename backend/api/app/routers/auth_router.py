from datetime import timedelta
from fastapi  import APIRouter, HTTPException, Request, Response, status, Depends
from fastapi.responses import JSONResponse, RedirectResponse
import jwt
from sqlmodel import select
from config.db_config import get_session
from config.env_config import settings
from app.schemas import UserRegister, UserLogin, UserResponse, LoginResponse,   Token
from app.models import User
from app.utils.security import get_current_user, hash_password, verify_password, generate_access_token, generate_refresh_token
from config.env_config import settings
import httpx



GITHUB_CLIENT_ID = settings.GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET = settings.GITHUB_CLIENT_SECRET


auth_router = APIRouter(
    tags=["Auth"]
)

@auth_router.post('/register', status_code=status.HTTP_201_CREATED)
def register(user_details: UserRegister, session = Depends(get_session)):
    statement = select(User).where(User.username == user_details.username)
    user_exist = session.execute(statement).scalars().first()
    if user_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    user = user_details.model_dump(exclude_unset=True)
    user["password"] = hash_password(user["password"])
    new_user = User(**user)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {"message":"User Registration Successfull"}


@auth_router.post('/login', response_model=LoginResponse, status_code=status.HTTP_200_OK)
def login(user_details: UserLogin, res: Response, session = Depends(get_session)):
    statement = select(User).where(User.username == user_details.username)
    user = session.execute(statement).scalars().first()
    if not user:
       raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Username or Password") 
    
    if not verify_password(user_details.password, user.password):
       raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Username or Password") 
    
    payload = {
        "user_id": str(user.id),    
    }
    
    access_token = generate_access_token(payload, expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh_token = generate_refresh_token(payload, expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    
    user.refresh_token = refresh_token
    session.add(user)
    session.commit()
    session.refresh(user)
    
    res.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age= 60 * 60 * 24 * settings.REFRESH_TOKEN_EXPIRE_DAYS,
        secure= settings.ENVIRONMENT == "production",
        samesite="strict",
        httponly=True
    )
    user_data = user.model_dump()
    user_data["id"] = str(user_data["id"])
    # response = LoginResponse(user=UserResponse(**user.model_dump()), token= {"access_token":access_token, "token_type":"bearer"})
    response = LoginResponse(
        user=UserResponse(**user_data),
        token={"access_token": access_token, "token_type": "bearer"}
    )
    return response


@auth_router.post('/logout', status_code=status.HTTP_200_OK)
def logout(res: Response, session = Depends(get_session), user_id = Depends(get_current_user)):
    print(user_id)
    user = session.execute(select(User).where(User.id == user_id)).scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    user.refresh_token = None
    session.add(user)
    session.commit()
    session.refresh(user)
    res.delete_cookie("refresh_token", httponly=True, samesite="strict", secure=settings.ENVIRONMENT == "production")
    return {"message": "Logged Out Successfully"}



@auth_router.get('/github/login')
def github_login():
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&scope=read:user user:email"
    )
    

@auth_router.get('/github/callback')
async def github_callback(code: str, session = Depends(get_session), user_id = Depends(get_current_user)):
    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            url="https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code
            }
        )
        
        token = token_res.json().get("access_token")
        
        
        if not token:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="GitHub token fetch failed")
        
        user_res = await client.get(
            url="https://api.github.com/user",
            headers={"Authorizatioin": f"token {token}"}
        )
        
        gh_user = user_res.json()
        gh_email_res = await client.get(
            url="https://api.github.com/user/emails",
            headers={"Authorizatioin": f"token {token}"} 
        )
        
        gh_email = next((email["email"] for email in gh_email_res if email["primary"]), None)
        
        if not gh_email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not fetch GitHub email")
       
        user = session.execute(select(User).where(User.github_id == gh_user["id"])).scalars().first()
        
        if not user:
            user = session.execute(select(User).where(User.email == gh_email)).scalars().first()
            
            if user:
                # Link github to the user
                user.github_id = gh_user["id"]
                user.github_login = gh_user["login"]
                user.is_github_connected = True
                
            else:
                user = User(
                    email=gh_email,
                    username=gh_user["login"],
                    name=gh_user["name"],
                    github_id=gh_user["id"],
                    github_login=gh_user["login"],
                    is_github_connected=True
                )
            session.add(user)
            session.commit()
            session.refresh(user)
            
            payload = {"id": user.id, "username": user.username}
            access_token = generate_access_token(payload)
            refresh_token = generate_refresh_token(payload)

            user.refresh_token = refresh_token
            session.commit()
            session.refresh(user)
            
            response = JSONResponse(content={"access_token": access_token, "token_type": "bearer"})
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure= settings.ENVIRONMENT == "production",  
                samesite="lax",
                max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
                path="/api/v1/auth/refresh"
            )
            return response


@auth_router.post("/refresh")
def refresh_access_token(request: Request):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")

    try:
        payload = jwt.decode(refresh_token, settings.REFRESH_SECRET_KEY, algorithms=[settings.ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=403, detail="Invalid refresh token")

    new_access_token = generate_access_token({"id": payload["id"], "username": payload["username"]})
    return {"access_token": new_access_token}