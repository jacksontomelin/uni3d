import io
from minio import Minio
from minio.error import S3Error
from app.core.config import settings


def get_minio_client() -> Minio:
    return Minio(
        settings.MINIO_ENDPOINT,
        access_key=settings.MINIO_USER,
        secret_key=settings.MINIO_PASSWORD,
        secure=settings.MINIO_SECURE,
    )


def ensure_bucket(client: Minio):
    if not client.bucket_exists(settings.MINIO_BUCKET):
        client.make_bucket(settings.MINIO_BUCKET)


def upload_file(client: Minio, object_name: str, data: bytes, content_type: str) -> str:
    ensure_bucket(client)
    client.put_object(
        settings.MINIO_BUCKET,
        object_name,
        io.BytesIO(data),
        length=len(data),
        content_type=content_type,
    )
    return object_name


def get_presigned_url(client: Minio, object_name: str, expires_hours: int = 2) -> str:
    from datetime import timedelta
    return client.presigned_get_object(
        settings.MINIO_BUCKET,
        object_name,
        expires=timedelta(hours=expires_hours),
    )


def delete_file(client: Minio, object_name: str):
    try:
        client.remove_object(settings.MINIO_BUCKET, object_name)
    except S3Error:
        pass
