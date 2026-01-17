from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.middleware import get_user
from app.leaderboard.function import (
    get_leaderboard,
    get_user_rank,
    ensure_contest_exists,
    persist_leaderboard,
    reset_leaderboard,
)

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.get("/{contest_id}/me")
def get_rank(
    contest_id: int,
    user_id: int = Depends(get_user),
    db: Session = Depends(get_db),
):
    return get_user_rank(contest_id, user_id, db)


@router.get("/{contest_id}")
def leaderboard(contest_id: int, db: Session = Depends(get_db)):
    return get_leaderboard(contest_id, db)


@router.post("/{contest_id}/end")
def end_contest(contest_id: int, db: Session = Depends(get_db)):
    """
    Ends the contest:
    1. Persist leaderboard from Redis → DB
    2. Clear Redis leaderboard for this contest
    """

    ensure_contest_exists(contest_id, db)
    persist_leaderboard(contest_id, db)
    reset_leaderboard(contest_id)

    return {
        "message": "Contest ended successfully",
        "contest_id": contest_id,
    }
