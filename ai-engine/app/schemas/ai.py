from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'model' / 'ai'")
    content: str = Field(..., description="The message text")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="The user's query or question")
    context: Optional[str] = Field("general", description="Mode: 'general', 'code', 'circuit', or 'concept'")
    history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Past conversation history")
    apiKey: Optional[str] = Field(None, description="Optional override Gemini API key")


class ChatResponse(BaseModel):
    success: bool = True
    reply: str
    source: str = "gemini"
    context: str = "general"
    timestamp: str


class VideoRequest(BaseModel):
    topic: str = Field(..., min_length=1, description="Quantum or STEM topic to explain")
    level: Optional[str] = Field("Beginner", description="'Beginner', 'Intermediate', or 'Advanced'")
    duration: Optional[str] = Field("standard", description="'quick' (~1-2m) or 'standard' (~3-4m)")
    apiKey: Optional[str] = Field(None, description="Optional override Gemini API key")


class VideoSceneData(BaseModel):
    headline: Optional[str] = None
    subheadline: Optional[str] = None
    equation: Optional[str] = None
    points: Optional[List[str]] = None
    blochSphere: Optional[Dict[str, Any]] = None
    circuit: Optional[Dict[str, Any]] = None
    probabilities: Optional[List[Dict[str, Any]]] = None
    codeSnippet: Optional[str] = None


class VideoScene(BaseModel):
    sceneNumber: int
    title: str
    durationSeconds: int
    narration: str
    visualType: str
    visualData: VideoSceneData
    keyTakeaway: Optional[str] = None
    accentColor: Optional[str] = "cyan"


class VideoQuiz(BaseModel):
    question: str
    options: List[str]
    correctIndex: int
    explanation: str


class VideoData(BaseModel):
    title: str
    topic: str
    level: str
    totalDurationSeconds: int
    summary: str
    scenes: List[VideoScene]
    quizQuestion: Optional[VideoQuiz] = None


class VideoResponse(BaseModel):
    success: bool = True
    source: str = "gemini"
    data: VideoData


