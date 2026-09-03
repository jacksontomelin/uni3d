from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# ── Auth ─────────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: str
    name: str
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    is_active: bool
    created_at: datetime
    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Project ──────────────────────────────────────────────────
class ProjectCreate(BaseModel):
    name: str
    description: str = ""


class ProjectOut(BaseModel):
    id: int
    name: str
    description: str
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


# ── ModelFile ────────────────────────────────────────────────
class ModelFileOut(BaseModel):
    id: int
    original_name: str
    format: str
    file_size: int
    vertex_count: Optional[int] = None
    face_count: Optional[int] = None
    volume_cm3: Optional[float] = None
    is_manifold: str = "unknown"
    gcode_key: Optional[str] = None
    print_time_seconds: Optional[int] = None
    filament_grams: Optional[float] = None
    created_at: datetime
    model_config = {"from_attributes": True}
