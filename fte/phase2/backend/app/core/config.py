from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    R2_ACCOUNT_ID: str
    R2_ACCESS_KEY_ID: str
    R2_SECRET_ACCESS_KEY: str
    R2_BUCKET_NAME: str
    R2_PUBLIC_URL: str
    JWT_SECRET: str
    ANTHROPIC_API_KEY: str
    APP_ENV: str = "development"
    CORS_ORIGINS: list = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
