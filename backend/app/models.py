from sqlalchemy import Column,Integer,String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base 

class Questions(Base):
    __tablename__ = "questions"

    id = Column(Integer , primary_key = True)
    title = Column(String)
    description = Column(String)
    correctindex = Column(Integer)
    options = relationship(
        "Mcq_Options",
        back_populates="question",
        cascade="all, delete-orphan"
    )


class Mcq_Options(Base):
    __tablename__ = "mcq_options"

    id = Column(Integer , primary_key = True)
    index = Column(Integer)
    text = Column(String)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))

    question = relationship("Questions", back_populates="options")


class Contest(Base):
    __tablename__ = "contests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    start_date = Column(String)
    start_time = Column(String)
    duration = Column(String)
    question_ids = Column(JSON, nullable=False) 

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String)
    password = Column(String)

class Submission(Base):
    __tablename__ = "submission"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    contest_id = Column(Integer, nullable=False)

    verdict = Column(String)
    points = Column(Integer, default=0)

    user = relationship("User")
    question = relationship("Questions")



class Leaderboard(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer , primary_key=True)
    contest_id = Column(Integer , nullable=False)
    user_id = Column(Integer)
    user_name = Column(String)
    total_points = Column(Integer)
    rank =Column(Integer)
