from fastapi import FastAPI,Depends,APIRouter,Response,HTTPException
from app.database import get_db
from sqlalchemy.orm import Session
from app.schema import Signup,Login
from app.models import User
from app.auth.jwt import create_jwt
from app.auth.password import verify_passord,hash_password


router = APIRouter()

@router.post("/signup")
def signup(payload : Signup,response : Response,db :Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status=400, detail="User already exsists")
    
    user = User(
        username = payload.username,
        email = payload.email,
        password = hash_password(payload.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)


    token = create_jwt(user.id)
    response.set_cookie(
        key = "token",
        value = token,
        httponly=True,
        secure=False,         # REQUIRED for SameSite=None
        samesite="lax",     # REQUIRED for cross-site
        path="/"
    )

    return { "message" : "Signup successful"}

@router.post("/login")
def login(payload : Login,response : Response,db :  Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_passord(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    
    token = create_jwt(user.id)
    response.set_cookie(
        key = "token",
        value = token,
        httponly=True,
        secure=False,         # REQUIRED for SameSite=None
        samesite="lax",     # REQUIRED for cross-site
        path="/"
    )

    return { "message" : "Login successful"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out"}