import jwt
from fastapi import Cookie, HTTPException
from app.db.session import SessionLocal
from app.core.config import settings

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user_id(accessToken: str = Cookie(None)) -> str:
    if not accessToken:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(accessToken, settings.JWT_ACCESS_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("userId")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
