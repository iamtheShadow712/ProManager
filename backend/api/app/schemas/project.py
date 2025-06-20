from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from app.utils.enums import ProjectStatusEnum, TaskStatusEnum

class Project(BaseModel):
    title: str
    description: str
    start_date: datetime
    end_date: datetime | None = None
    status: ProjectStatusEnum
    
class ProjectCreate(Project):
    pass

class TaskCreate(BaseModel):
    title: str
    description: str
    status: TaskStatusEnum
    priority: str
    
    
class ProjectUpdate(BaseModel):
    title: Optional[str] = None 
    description: Optional[str] = None
    end_date: Optional[datetime] = None
    status: Optional[ProjectStatusEnum] = None

class UserDetails(BaseModel):
    id: UUID
    username: str
    email: str
    full_name: str
    profile_pic: str | None = None
    
    model_config = ConfigDict(from_attributes=True)
    
class TaskResponse(BaseModel):
    id: UUID
    title: str
    description: str
    status: TaskStatusEnum
    priority: str 
    created_at: datetime
    updated_at: datetime
    project_id: UUID | None = None
    reporter: UserDetails | None = None
    
    model_config = ConfigDict(from_attributes=True)

class ProjectResponse(BaseModel):
    id: UUID
    title: str
    description: str
    start_date: datetime
    end_date: datetime | None = None
    status: ProjectStatusEnum
    created_at: datetime
    owner_id: UUID
    owner: UserDetails
    
    model_config = ConfigDict(from_attributes=True) 
    
class TaskUpdate(BaseModel):
    status: Optional[TaskStatusEnum] = None
    priority: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None

    
    