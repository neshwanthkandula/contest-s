from app.leaderboard.redis_client import redis_client
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Leaderboard, Contest, User

# Since only ONE contest runs at a time
LEADERBOARD_KEY = "leaderboard:active"

# =========================
# CORE HELPERS
# =========================

def ensure_contest_exists(contest_id: int, db: Session):
    contest = (
        db.query(Contest.id)
        .filter(Contest.id == contest_id)
        .first()
    )
    if not contest:
        raise HTTPException(status_code=404, detail="Invalid contest_id")


# =========================
# REDIS (LIVE LEADERBOARD)
# =========================

def add_points(user_id: int, username: str, points: int):
    """
    Redis ZSET member format:
    {user_id}:{username}
    """
    member = f"{user_id}:{username}"

    redis_client.zincrby(
        LEADERBOARD_KEY,
        points,
        member
    )


def get_leaderboard_from_redis():
    raw = redis_client.zrevrange(
        LEADERBOARD_KEY,
        0,
        -1,
        withscores=True
    )

    leaderboard = []

    for idx, (member, score) in enumerate(raw, start=1):
        user_id, username = member.split(":")

        leaderboard.append({
            "rank": idx,
            "user_id": int(user_id),
            "username": username,
            "points": int(score),
        })

    return leaderboard


def get_user_rank_from_redis(user_id: int):
    raw = redis_client.zrevrange(
        LEADERBOARD_KEY,
        0,
        -1,
        withscores=True
    )

    for idx, (member, score) in enumerate(raw, start=1):
        m_user_id, username = member.split(":")

        if int(m_user_id) == user_id:
            return {
                "rank": idx,
                "user_id": user_id,
                "username": username,
                "points": int(score),
            }

    return None


def reset_leaderboard():
    redis_client.delete(LEADERBOARD_KEY)


# =========================
# DATABASE (FINAL LEADERBOARD)
# =========================

def persist_leaderboard(contest_id: int, db: Session):
    raw = redis_client.zrevrange(
        LEADERBOARD_KEY,
        0,
        -1,
        withscores=True
    )

    # Clear existing leaderboard for contest (idempotent)
    db.query(Leaderboard).filter(
        Leaderboard.contest_id == contest_id
    ).delete()

    for idx, (member, score) in enumerate(raw, start=1):
        user_id, username = member.split(":")

        db.add(
            Leaderboard(
                contest_id=contest_id,
                user_id=int(user_id),
                user_name=username,
                total_points=int(score),
                rank=idx,
            )
        )

    db.commit()


def get_leaderboard_from_db(contest_id: int, db: Session):
    rows = (
        db.query(Leaderboard)
        .filter(Leaderboard.contest_id == contest_id)
        .order_by(Leaderboard.rank.asc())
        .all()
    )

    return [
        {
            "rank": row.rank,
            "user_id": row.user_id,
            "username": row.user_name,
            "points": row.total_points,
        }
        for row in rows
    ]


def get_user_rank_from_db(contest_id: int, user_id: int, db: Session):
    row = (
        db.query(Leaderboard)
        .filter(
            Leaderboard.contest_id == contest_id,
            Leaderboard.user_id == user_id,
        )
        .first()
    )

    if not row:
        return None

    return {
        "rank": row.rank,
        "user_id": row.user_id,
        "username": row.user_name,
        "points": row.total_points,
    }


# =========================
# SMART ACCESSORS
# =========================

def get_leaderboard(contest_id: int, db: Session):
    ensure_contest_exists(contest_id, db)

    rows = (
        db.query(Leaderboard)
        .filter(Leaderboard.contest_id == contest_id)
        .order_by(Leaderboard.rank.asc())
        .all()
    )

    # Contest ended → DB
    if rows:
        return [
            {
                "rank": row.rank,
                "user_id": row.user_id,
                "username": row.user_name,
                "points": row.total_points,
            }
            for row in rows
        ]

    # Contest running → Redis
    return get_leaderboard_from_redis()


def get_user_rank(contest_id: int, user_id: int, db: Session):
    ensure_contest_exists(contest_id, db)

    row = (
        db.query(Leaderboard)
        .filter(
            Leaderboard.contest_id == contest_id,
            Leaderboard.user_id == user_id,
        )
        .first()
    )

    if row:
        return {
            "rank": row.rank,
            "user_id": row.user_id,
            "username": row.user_name,
            "points": row.total_points,
        }

    return get_user_rank_from_redis(user_id)
