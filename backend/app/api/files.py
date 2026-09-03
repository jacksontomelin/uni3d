import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.project import Project, ModelFile
from app.schemas import ModelFileOut
from app.services.storage import get_minio_client, upload_file, get_presigned_url, delete_file

router = APIRouter(prefix="/projects/{project_id}/files", tags=["files"])

ALLOWED_EXTENSIONS = {".stl", ".obj", ".3mf", ".gcode"}


async def _get_project(project_id: int, user: User, db: AsyncSession) -> Project:
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.owner_id == user.id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    return project


@router.get("/", response_model=list[ModelFileOut])
async def list_files(
    project_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project = await _get_project(project_id, user, db)
    result = await db.execute(
        select(ModelFile).where(ModelFile.project_id == project.id).order_by(ModelFile.created_at.desc())
    )
    return result.scalars().all()


@router.post("/upload", response_model=ModelFileOut, status_code=201)
async def upload_model(
    project_id: int,
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project = await _get_project(project_id, user, db)

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Formato {ext} não suportado. Use: {ALLOWED_EXTENSIONS}")

    data = await file.read()
    storage_key = f"{user.id}/{project.id}/{uuid.uuid4().hex}{ext}"

    client = get_minio_client()
    upload_file(client, storage_key, data, file.content_type or "application/octet-stream")

    model_file = ModelFile(
        project_id=project.id,
        original_name=file.filename,
        storage_key=storage_key,
        format=ext.lstrip("."),
        file_size=len(data),
    )
    db.add(model_file)
    await db.commit()
    await db.refresh(model_file)
    return model_file


@router.get("/{file_id}/download")
async def download_url(
    project_id: int,
    file_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_project(project_id, user, db)
    result = await db.execute(select(ModelFile).where(ModelFile.id == file_id))
    mf = result.scalar_one_or_none()
    if not mf:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    client = get_minio_client()
    url = get_presigned_url(client, mf.storage_key)
    return {"url": url}


@router.delete("/{file_id}", status_code=204)
async def remove_file(
    project_id: int,
    file_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_project(project_id, user, db)
    result = await db.execute(select(ModelFile).where(ModelFile.id == file_id))
    mf = result.scalar_one_or_none()
    if not mf:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    client = get_minio_client()
    delete_file(client, mf.storage_key)
    if mf.gcode_key:
        delete_file(client, mf.gcode_key)
    await db.delete(mf)
    await db.commit()
