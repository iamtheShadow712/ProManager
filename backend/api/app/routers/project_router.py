from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from sqlmodel import select
from app.models import Project, Task
from app.utils.security import get_current_user
from config.db_config import get_session
from app.schemas import ProjectCreate, ProjectResponse, TaskCreate, TaskResponse, TaskUpdate, ProjectUpdate
from sqlalchemy.orm import selectinload

project_router = APIRouter(
    tags=["Project"]
)

@project_router.post('/')
def create_project(project_details: ProjectCreate, session = Depends(get_session), user_id = Depends(get_current_user)):
    statement = select(Project).where(Project.title == project_details.title, Project.owner_id == UUID(user_id))
    project_exist = session.execute(statement).scalars().first()
    if project_exist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Project already exists")
    project = project_details.model_dump(exclude_unset=True)
    project.update({"owner_id": user_id})
    
    new_project = Project(**project)
    session.add(new_project)
    session.commit()
    session.refresh(new_project)
    
    return new_project

@project_router.get('/')
def get_all_projects(session = Depends(get_session), user_id = Depends(get_current_user)):
    statement = select(Project).where(Project.owner_id == UUID(user_id))
    projects = session.execute(statement).scalars().all()
    return projects


@project_router.get('/{project_id}', response_model=ProjectResponse, status_code=status.HTTP_200_OK)
def get_project_by_id(project_id: str,session = Depends(get_session), user_id = Depends(get_current_user)):
    print(project_id)
    try:
        project_uuid = UUID(project_id)
        owner_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid UUID format")

    statement = select(Project).options(
            selectinload(Project.owner)
        ).where(
        Project.id == project_uuid,
        Project.owner_id == owner_uuid
    )
    project = session.execute(statement).scalars().first()

    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project does not exist")

    return project



@project_router.patch('/{project_id}', response_model=ProjectResponse, status_code=status.HTTP_200_OK)
def update_project(project_id: str,project_details: ProjectUpdate, session = Depends(get_session), user_id = Depends(get_current_user)):
    print(project_id)
    try:
        project_uuid = UUID(project_id)
        owner_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid UUID format")

    statement = select(Project).options(
            selectinload(Project.owner)
        ).where(
        Project.id == project_uuid,
        Project.owner_id == owner_uuid
    )
    project = session.execute(statement).scalars().first()

    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project does not exist")

    project_details = project_details.model_dump(exclude_unset=True)
    
    for key, value in project_details.items():
        setattr(project, key, value)
        
    session.add(project)
    session.commit()
    session.refresh(project)

    return project



@project_router.post('/{project_id}/tasks', response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(project_id: str, task_details: TaskCreate, session = Depends(get_session), user_id = Depends(get_current_user)):
    print(task_details)
    try:
        project_uuid = UUID(project_id)
        owner_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid UUID format")
    
    statement = select(Project).options(selectinload(Project.owner)).where(
        Project.id == project_uuid,
        Project.owner_id == owner_uuid
    )
    project = session.execute(statement).scalars().first()

    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project does not exist") 
    
    new_task = Task(**task_details.model_dump(exclude_unset=True), project_id=project_uuid, reported_by=owner_uuid)
    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    
    return new_task


@project_router.get('/{project_id}/tasks', response_model=List[TaskResponse], status_code=status.HTTP_200_OK)
# @project_router.get('/{project_id}/tasks', status_code=status.HTTP_200_OK)
def get_project_tasks(project_id: str, session = Depends(get_session), user_id = Depends(get_current_user)):
    try:
        project_uuid = UUID(project_id)
        owner_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid UUID format")
    
    statement = select(Project).options(selectinload(Project.owner)).where(
        Project.id == project_uuid,
        Project.owner_id == owner_uuid
    )
    project = session.execute(statement).scalars().first()

    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project does not exist") 
    
    task_statement = select(Task).options(selectinload(Task.reporter)).where(
        Task.project_id == project_uuid
    )
    tasks = session.execute(task_statement).scalars().all()
    
    return tasks

@project_router.patch('/{project_id}/tasks/{task_id}', response_model=TaskResponse, status_code=status.HTTP_200_OK)
def update_project_task(project_id: str, task_id: str, task_details: TaskUpdate, session = Depends(get_session), user_id = Depends(get_current_user)):
    try:
        project_uuid = UUID(project_id)
        owner_uuid = UUID(user_id)
        task_uuid = UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid UUID format")
    
    statement = select(Project).options(selectinload(Project.owner)).where(
        Project.id == project_uuid,
        Project.owner_id == owner_uuid
    )
    project = session.execute(statement).scalars().first()

    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project does not exist") 
    
    task_statement = select(Task).where(Task.project_id == project_uuid, Task.id == task_uuid)
    task = session.execute(task_statement).scalars().first()
    
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task does not exist") 
    task_details = task_details.model_dump(exclude_unset=True)
    for key, value in task_details.items():
        setattr(task, key, value)
        
    session.add(task)
    session.commit()
    session.refresh(task)
    
    return task
