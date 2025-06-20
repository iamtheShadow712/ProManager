from fastapi import Depends
from sqlmodel import create_engine, Session
from sqlalchemy.orm import sessionmaker
from typing import Annotated

from config.env_config import settings  # Adjust path as needed

#  "postgresql://user:pass@host:port/dbname")
db_url = f"{settings.DB_TYPE}://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

# Create synchronous engine
engine = create_engine(db_url, echo=True)

# Create a session factory
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Dependency for sync routes or Alembic
def get_session():
    with SessionLocal() as session:
        yield session
        