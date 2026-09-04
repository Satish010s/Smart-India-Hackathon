from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
)

# Configure CORS using environment-driven origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes under /api/v1
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {
        "status": "ok",
        "service": "quantum-ai-engine",
        "message": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "quantum-ai-engine",
        "environment": settings.ENVIRONMENT,
    }
