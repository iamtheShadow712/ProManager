from enum import Enum

class TaskStatusEnum(str, Enum):
    BACKLOG = "backlog"
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DEMO = "demo"
    DONE = "done"

class ProjectStatusEnum(str, Enum):
    BACKLOG = "backlog"
    ACTIVE = "active"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"
    CANCELLED = "cancelled"
    ARCHIVED = "archived" 