import datetime
from fastapi import APIRouter, HTTPException, Header, Depends
from typing import Optional

from app.schemas.ai import (
    ChatRequest,
    ChatResponse,
    VideoRequest,
    VideoResponse,
)
from app.ai.tutor.service import (
    chat_with_tutor,
    generate_explanation_video,
    get_gemini_client,
)
from app.core.config import settings
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user_id

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def tutor_chat(
    req: ChatRequest,
    x_gemini_key: Optional[str] = Header(None, alias="x-gemini-key"),
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Conversational AI Tutor endpoint powered by Gemini."""
    try:
        user_key = req.apiKey or x_gemini_key
        history_dicts = [h.model_dump() for h in (req.history or [])]
        
        result = await chat_with_tutor(
            message=req.message,
            context=req.context or "general",
            history=history_dicts,
            user_api_key=user_key,
            db=db,
            user_id=user_id,
        )

        return ChatResponse(
            success=True,
            reply=result.get("reply", ""),
            source=result.get("source", "gemini"),
            context=req.context or "general",
            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Tutor error: {str(e)}")


@router.post("/generate-video", response_model=VideoResponse)
async def tutor_generate_video(
    req: VideoRequest,
    x_gemini_key: Optional[str] = Header(None, alias="x-gemini-key"),
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Interactive quantum video storyboard generator."""
    try:
        user_key = req.apiKey or x_gemini_key
        result = await generate_explanation_video(
            topic=req.topic,
            level=req.level or "Beginner",
            duration=req.duration or "standard",
            user_api_key=user_key,
            db=db,
            user_id=user_id,
        )

        return VideoResponse(
            success=True,
            source=result.get("source", "gemini"),
            data=result["data"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video generator error: {str(e)}")



