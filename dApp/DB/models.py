from sqlalchemy import Column, Integer, String
from database import Base

class Voter(Base):
    __tablename__ = 'voters'

    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(45), primary_key=False)
    lastname = Column(String(45), primary_key=False)
    email = Column(String(45), primary_key=False)
    password = Column(String(45), primary_key=False)
    role = Column(Integer, primary_key=False)