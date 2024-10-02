# import dotenv
# import os
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.encoders import jsonable_encoder
# import mysql
# from mysql.connector import errorcode
from fastapi import FastAPI, HTTPException, Request, Depends, status
from pydantic import BaseModel
from typing import Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from passlib.context import CryptContext

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:8080",
]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

class VoterBase(BaseModel):
    id: str 
    name: str
    lastname: str
    email:str
    password: str
    role: int

class CredentialsBase(BaseModel):
    id: int
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.get("/getVoter/{voterJMBG}", status_code=status.HTTP_200_OK)
async def get_voter(voterJMBG: int, db: db_dependency):
    voter = db.query(models.Voter).filter(models.Voter.id == voterJMBG).first()
    if voter is None:
        return None
    return voter

async def authenticate_voter(credentials: CredentialsBase, db: db_dependency):
    voter = await get_voter(credentials.id, db) 
    if verify_password(credentials.password, voter.password):
        return voter
    return None

@app.post("/login/", status_code=status.HTTP_200_OK)
async def login_voter(credentials: CredentialsBase, db: db_dependency):
    exists = await authenticate_voter(credentials, db)
    if exists is None:
        return {"message": "ERROR", "role": credentials.id}
    else:
        return {"message": "Voter successfully loged in", "role": exists.role}

@app.post("/register/", status_code=status.HTTP_201_CREATED)
async def register_voter(voter: VoterBase, db: db_dependency):
    temp = await get_voter(voter.id, db) 
    if temp is None:
        voter.password = hash_password(voter.password)
        db_voter = models.Voter(**voter.model_dump())
        db.add(db_voter)
        db.commit()
        return {"message": "Voter registered successfully", "jmbg": db_voter.id}
    return {"message": "ERROR", "jmbg": voter.id}
