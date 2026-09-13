import datetime
import uuid
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class AiChatHistory(Base):
    __tablename__ = "AiChatHistory"

    id = Column(String, primary_key=True, default=lambda: f"cuid_{uuid.uuid4().hex[:16]}")
    userId = Column(String, nullable=False, index=True)
    message = Column(Text, nullable=False)
    context = Column(String, nullable=False)
    reply = Column(Text, nullable=False)
    source = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)

class AiGeneratedVideo(Base):
    __tablename__ = "AiGeneratedVideo"

    id = Column(String, primary_key=True, default=lambda: f"cuid_{uuid.uuid4().hex[:16]}")
    userId = Column(String, nullable=False, index=True)
    topic = Column(String, nullable=False)
    level = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    videoData = Column(JSONB, nullable=False)
    source = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
