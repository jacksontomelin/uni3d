from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, func, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class FileFormat(str, enum.Enum):
    STL = "stl"
    OBJ = "obj"
    THREE_MF = "3mf"
    GCODE = "gcode"


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    owner = relationship("User", back_populates="projects")
    files = relationship("ModelFile", back_populates="project", cascade="all, delete-orphan")


class ModelFile(Base):
    __tablename__ = "model_files"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    original_name = Column(String(255), nullable=False)
    storage_key = Column(String(512), nullable=False)
    format = Column(String(10), nullable=False)
    file_size = Column(Integer, default=0)
    # Metadata from mesh analysis
    vertex_count = Column(Integer, nullable=True)
    face_count = Column(Integer, nullable=True)
    volume_cm3 = Column(Float, nullable=True)
    is_manifold = Column(String(10), default="unknown")  # yes / no / unknown
    # Slicer output
    gcode_key = Column(String(512), nullable=True)
    slicer_profile = Column(Text, nullable=True)
    print_time_seconds = Column(Integer, nullable=True)
    filament_grams = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="files")
