from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Uni3D"
    DATABASE_URL: str = "postgresql+asyncpg://uni3d:change_me@postgres:5432/uni3d"
    SECRET_KEY: str = "generate_a_real_secret_key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24h
    ALGORITHM: str = "HS256"

    MINIO_ENDPOINT: str = "minio:9000"
    MINIO_USER: str = "uni3d"
    MINIO_PASSWORD: str = "change_me_in_production"
    MINIO_BUCKET: str = "uni3d-files"
    MINIO_SECURE: bool = False

    ALLOWED_ORIGINS: str = "https://uni3d.unicontroller.com.br"

    model_config = {"env_file": ".env"}


settings = Settings()
