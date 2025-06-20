from typing import List, Optional
from datetime import datetime
import sqlalchemy.dialects.postgresql as pg
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Boolean, Enum, Integer, String, Column, DateTime, text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from app.utils.enums import ProjectStatusEnum, TaskStatusEnum

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, index=True, primary_key=True, default=uuid.uuid4)
    )
    full_name: str = Field(
        sa_column=Column(String(50), nullable=False)
    )
    username: str = Field(
        sa_column=Column(String(25), nullable=False, unique=True, index=True)
    )
    email: str = Field(
        sa_column=Column(String, nullable=False, unique=True, index=True)
    )
    password: str | None = Field(
        sa_column=Column(String, nullable=True)
    )
    profile_pic: str | None = Field(
        sa_column=Column(String, nullable=True)
    )
    github_id:  int | None = Field(
        sa_column=Column(Integer, nullable=True)
    )
    github_login:  str | None = Field(
        sa_column=Column(String, nullable=True)
    )
    is_github_connected:  bool = Field(
        sa_column=Column(Boolean, server_default="false")
    )
    refresh_token: str | None = Field(
        sa_column=Column(String, nullable=True, unique=True)
    ) 
    created_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    )
    updated_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP"), onupdate=func.now())
    )
    
    projects: List["Project"] = Relationship(back_populates="owner", cascade_delete=True) 
    tasks: List["Task"] = Relationship(back_populates="reporter",  cascade_delete=True)
    
    
# -----------------------------------------------------------------------------------------------------


class Project(SQLModel, table=True):
    __tablename__ = "projects"

    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, index=True, primary_key=True, default=uuid.uuid4)
    )

    title: str = Field(
        sa_column=Column(String(100), nullable=False)
    )

    description: str = Field(
        sa_column=Column(String, nullable=False)
    )

    status: str = Field(
        default=ProjectStatusEnum.BACKLOG.value,
        sa_column=Column(String, nullable=False, server_default=text("'backlog'"))
    )

    start_date: datetime = Field(
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )

    end_date: Optional[datetime] = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True)
    )

    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP")
        )
    )

    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP"),
            onupdate=func.now()
        )
    )

    owner_id: Optional[uuid.UUID] = Field(
        foreign_key="users.id",
        nullable=False,
        default=None
    )

    owner: Optional["User"] = Relationship(back_populates="projects") 
    tasks: Optional["Task"] = Relationship(back_populates="project", cascade_delete=True)
    
    
# ----------------------------------------------------------------------------------

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, index=True, primary_key=True, default=uuid.uuid4)
    ) 
    title: str = Field(
        sa_column=Column(String, nullable=False)
    )
    description: str = Field(
        sa_column=Column(String, nullable=False)
    )
    status:str = Field(
        default=TaskStatusEnum.BACKLOG.value,
        sa_column=Column(String, nullable=False, server_default=text("'backlog'"))
    ) 
    priority: str = Field(
        sa_column=Column(String, nullable=False, server_default=text("'low'"))
    )
    
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP")
        )
    )

    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP"),
            onupdate=func.now()
        )
    )
    
    reported_by: Optional[uuid.UUID] = Field(
        foreign_key="users.id",
        nullable=False,
        default=None
    )
    
    project_id: Optional[uuid.UUID] = Field(
        foreign_key="projects.id",
        nullable=False,
        default=None
    )
    
    reporter: Optional["User"] = Relationship(back_populates="tasks")
    project: Optional["Project"] = Relationship(back_populates="tasks")