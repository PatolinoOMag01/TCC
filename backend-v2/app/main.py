from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import User
from app.routes import (
    auth_router,
    users_router,
)

Base.metadata.create_all(
    bind=engine
)

app = FastAPI(
    title="InterWay API",
    description=(
        "API oficial da plataforma InterWay."
    ),
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router
)

app.include_router(
    users_router
)


@app.get("/")
def home():
    return {
        "message": "InterWay API 2.0",
        "status": "online",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
    }