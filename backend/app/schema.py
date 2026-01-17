from pydantic import BaseModel,Field
from typing import List

class questionIn(BaseModel):
    title : str
    description  : str 
    correctindex : int 
    options : List[str]

    class config : 
        from_attributes = True


class OptionIn(BaseModel):
    correctindex : int

    class config : 
        from_attributes : True

class ContestCreate(BaseModel):
    title: str
    description: str
    start_date: str
    start_time: str
    duration : str
    question_ids: List[int] = Field(..., min_items=1)

class ContestSummary(BaseModel):
    id: int
    title: str
    start_time: str
    start_date : str
    duration: str

    class Config:
        orm_mode = True

class OptionOut(BaseModel):
    index: int
    text: str

class QuestionOut(BaseModel):
    id: int
    title: str
    description: str
    options: List[OptionOut]

class ContestDetailOut(BaseModel):
    id: int
    title: str
    description: str
    start_date: str
    start_time: str
    duration: str
    questions: List[QuestionOut]

    class Config:
        orm_mode = True

class Signup(BaseModel):
    username : str
    email : str
    password : str

    class Config:
        orm_mode = True

class Login(BaseModel):
    email : str
    password : str
    
    class Config:
        orm_mode = True

class Submit(BaseModel):
    question_id: int
    correct_index: int
    contest_id: int

    class Config:
        orm_mode = True

class UseRes(BaseModel):
    username : str

    class Config:
        orm_mode = True

class ContestUpdate(BaseModel):
    title: str
    description: str | None = None
    start_date: str
    start_time: str
    duration: str
    question_ids: List[int]

    class Config:
        orm_mode = True