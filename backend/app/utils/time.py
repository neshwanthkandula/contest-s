from datetime import datetime, timedelta,timezone

IST = timezone(timedelta(hours=5, minutes=30))
def get_contest_end_time(
    start_date: str,
    start_time: str,
    duration: str
) -> datetime:
    start_dt_ist = datetime.strptime(
        f"{start_date} {start_time}",
        "%Y-%m-%d %H:%M"
    ).replace(tzinfo=IST)

    return start_dt_ist + timedelta(minutes=int(duration))
