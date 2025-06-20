from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_router, project_router
import uvicorn
from config.env_config import settings

app = FastAPI()


origins = settings.ORIGINS.split(";")
print(origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prefix="/api/v1/auth", router=auth_router)
app.include_router(prefix="/api/v1/projects", router=project_router)


if __name__ == "__main__":
    uvicorn.run(app="main:app", host="localhost", port=8000, reload=True)