from fastapi import FastAPI,HTTPException,Depends
from sqlalchemy.orm import Session 
from app.database import Base, engine , get_db
from app.models import Questions,Mcq_Options,Contest,Submission,User
from app.schema import questionIn,OptionIn,ContestCreate,ContestSummary,ContestDetailOut,Submit,ContestUpdate
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from app.utils.time import get_contest_end_time
from app.auth.index import router as AuthRouter
from app.auth.middleware import get_user
from app.leaderboard.routes import router as LeaderboardRouter
from app.leaderboard.function import add_points
from datetime import timezone
from app.utils.time import IST
from app.schema import UseRes
from app.auth.time import is_contest_running

Base.metadata.create_all(bind = engine)

app = FastAPI()
app.include_router(AuthRouter)
app.include_router(LeaderboardRouter)
# Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


@app.post("/add_mcq")
def add_Mcq( payload : questionIn, db : Session = Depends(get_db)):
    try :
        if payload.correctindex >3 or payload.correctindex <0 :
            raise HTTPException(
                status_code = 400,
                detail = "correctindex is out of range"
            )
        
        question = Questions(
            title = payload.title,
            description = payload.description,
            correctindex = payload.correctindex
        )

        for i,option_text in enumerate(payload.options):
            question.options.append(
                Mcq_Options(
                    index=i,
                    text = option_text
                )
            )


        db.add(question)
        db.commit()
        db.refresh(question)

        return {
            "id": question.id,
            "message": "Question created successfully"
        }
    
    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
        
@app.get("/questions")
def get_questions(db : Session = Depends(get_db)):
    questions = db.query(Questions).all()

    return [
        {
            "id" : q.id,
            "title" : q.title,
        }

        for q in questions
    ]

@app.post("/create/contest", status_code=201)
def create_contest(payload: ContestCreate, db: Session = Depends(get_db)):
    # Validate question IDs exist
    found_ids = {
        q.id for q in db.query(Questions.id)
        .filter(Questions.id.in_(payload.question_ids))
        .all()
    }
    missing = set(payload.question_ids) - found_ids
    if missing:
        raise HTTPException(
            status_code=404,
            detail=f"Invalid question IDs: {sorted(list(missing))}"
        )

    contest = Contest(
        title=payload.title,
        description=payload.description,
        start_date=payload.start_date,
        start_time=payload.start_time,
        duration = payload.duration,
        question_ids=payload.question_ids
    )

    db.add(contest)
    db.commit()
    db.refresh(contest)

    return {
        "message": "Contest created successfully",
        "contest_id": contest.id
    }


@app.get("/active_contest", response_model=list[ContestSummary])
def active_contest(db : Session = Depends(get_db)):
    now = datetime.now(IST)
    active_contests = []

    contests = db.query(Contest).all()

    for contest in contests:
        end_time = get_contest_end_time(
            contest.start_date,
            contest.start_time,
            contest.duration
        )

        print(end_time) 
        print(now)

        # UPCOMING + ONGOING
        if now <= end_time:
            active_contests.append(contest)

    return active_contests


@app.get("/past_contest", response_model=list[ContestSummary])
def get_past_contests(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    past_contests = []

    contests = db.query(Contest).all()

    for contest in contests:
        end_time = get_contest_end_time(
            contest.start_date,
            contest.start_time,
            contest.duration
        )

        if now > end_time:
            past_contests.append(contest)

    return  past_contests


@app.get("/contest/{contest_id}", response_model=ContestDetailOut)
def get_contest_detail(contest_id: int, db: Session = Depends(get_db)):
    print(contest_id)
    contest = db.query(Contest).filter(Contest.id == contest_id).first()

    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")

    # Fetch questions using stored question_ids
    questions = (
        db.query(Questions)
        .filter(Questions.id.in_(contest.question_ids))
        .all()
    )

    return {
        "id": contest.id,
        "title": contest.title,
        "description": contest.description,
        "start_date": contest.start_date,
        "start_time": contest.start_time,
        "duration": contest.duration,
        "questions": [
            {
                "id": q.id,
                "title": q.title,
                "description": q.description,
                "options": [
                    {
                        "index": opt.index,
                        "text": opt.text
                    }
                    for opt in q.options
                ]
            }
            for q in questions
        ]
    }



@app.post("/submit")
def submit(
    payload: Submit,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user),
):
    # Fetch question
    question = db.query(Questions).filter(
        Questions.id == payload.question_id
    ).first()

    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Fetch contest
    contest = db.query(Contest).filter(
        Contest.id == payload.contest_id
    ).first()

    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")

    contest_running = is_contest_running(contest)

    # Check if already solved
    existing = db.query(Submission).filter(
        Submission.user_id == user_id,
        Submission.question_id == payload.question_id,
        Submission.contest_id == payload.contest_id,
        Submission.verdict == "AC"
    ).first()

    # Evaluate answer
    is_correct = question.correctindex == payload.correct_index

    submission = Submission(
        user_id=user_id,
        question_id=payload.question_id,
        contest_id=payload.contest_id,
        verdict="AC" if is_correct else "WA",
        points=50 if (is_correct and contest_running and not existing) else 0,
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    # Add points only if allowed
    if is_correct and not existing and contest_running:
        user = db.query(User).filter(User.id == user_id).first()
        add_points(payload.contest_id,user_id, user.username, 50)

    return {
        "message": "Submission recorded",
        "verdict": submission.verdict,
        "points": submission.points,
        "contest_running": contest_running
    }



@app.get("/me", response_model=UseRes)
def me(
    user_id: int = Depends(get_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "username": user.username
    }


@app.put("/contest/{contest_id}")
def update_contest(
    contest_id: int,
    payload: ContestUpdate,
    db: Session = Depends(get_db)
):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()

    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")

    contest.title = payload.title
    contest.description = payload.description
    contest.start_date = payload.start_date
    contest.start_time = payload.start_time
    contest.duration = payload.duration
    contest.question_ids = payload.question_ids

    db.commit()
    db.refresh(contest)

    return {"message": "Contest updated successfully"}
