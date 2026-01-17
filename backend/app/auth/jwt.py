from jose import jwt 
from datetime import datetime,timedelta

SECRET_KEY = "SECRET_KEY"
ALGORITHM = "HS256"
EXPIRE_HOURS = 24

def create_jwt(user_id : int)->str:
    payload = {
        "sub" : str(user_id),
        "exp" : datetime.utcnow() + timedelta(hours=EXPIRE_HOURS)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_jwt(token : str):

    user_id = jwt.decode(token, SECRET_KEY , algorithms=[ALGORITHM])
    print(user_id)
    return user_id
