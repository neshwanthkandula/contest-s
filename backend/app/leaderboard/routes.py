from fastapi import FastAPI,APIRouter,Depends
from app.leaderboard.function import get_leaderboard, get_user_rank,add_points,ensure_contest_exists,persist_leaderboard,reset_leaderboard
from app.auth.middleware import get_user
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/{contest_id}/me")
def get_rank(contest_id: str,user_id : str = Depends(get_user), db: Session = Depends(get_db)):
    rank = get_user_rank(contest_id,user_id,db )
    
    return rank

@router.get("/{contest_id}")
def leaderboard(contest_id: str, db: Session = Depends(get_db)):
    return get_leaderboard(contest_id, db)


@router.post("/{contest_id}/end")
def end_contest(contest_id: int, db: Session = Depends(get_db)):
    """
    Ends the active contest:
    1. Persist leaderboard from Redis → DB
    2. Reset Redis leaderboard
    """

    # 1. Validate contest
    ensure_contest_exists(contest_id, db)

    # 2. Persist leaderboard (Redis → DB)
    persist_leaderboard(contest_id, db)

    # 3. Reset Redis leaderboard
    reset_leaderboard()

    return {
        "message": "Contest ended successfully",
        "contest_id": contest_id,
    }
