import os

from dotenv import load_dotenv
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = os.getenv("DATABASE_URL") or URL.create(
    "mysql+pymysql",
    username=DB_USER or "root",
    password=DB_PASSWORD or "",
    host=DB_HOST,
    port=int(DB_PORT),
    database=DB_NAME or "banco_interway",
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()