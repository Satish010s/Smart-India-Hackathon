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

# 1. Navigate to the project directory:
#cd ai-engine

# 2. Activate the Virtual Environment
# source venv/bin/activate

# 3. Start the Server You can use the provided start.sh script to run the server:
# ./start.sh

# Alternatively, if you want to run it directly using Uvicorn (the ASGI server), you can run:
# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
