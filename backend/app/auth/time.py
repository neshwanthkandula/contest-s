from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from app.models import Contest

IST = ZoneInfo("Asia/Kolkata")

def is_contest_running(contest: Contest) -> bool:
    start_dt = datetime.strptime(
        f"{contest.start_date} {contest.start_time}",
        "%Y-%m-%d %H:%M"
    ).replace(tzinfo=IST)

    end_dt = start_dt + timedelta(minutes=int(contest.duration))
    now = datetime.now(IST)

    return start_dt <= now <= end_dt
