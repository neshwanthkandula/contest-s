from fastapi import FastAPI, Response , HTTPException, Request
from app.auth.jwt import decode_jwt

def get_user(request :  Request):
    token =request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = decode_jwt(token)
        user_id = int(payload["sub"])
        return user_id
    except Exception as e:
        raise HTTPException(status_code=401, detail="invalid token")