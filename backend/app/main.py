import os
from contextlib import asynccontextmanager

from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from app.database import (
    Base,
    engine,
    SessionLocal,
)
from app.routes.admin import router as admin_router, public_router as destinations_router
from app.services.administration import seed_destinations
from app.routes.match import router as match_router

from app.models import (
    Passport,
    Planner,
    User,
    ExchangeProfile,
    ConversationMessage,
    CommunityMessage,
    PlusSubscription,
)

from app.routes import (
    auth_router,
    ia_router,
    passport_router,
    planner_router,
    users_router,
    profile_router,
    conversations_router,
    community_router,
    plus_router,
)


Base.metadata.create_all(
    bind=engine
)


@asynccontextmanager
async def lifespan(app):
    with SessionLocal() as db:
        seed_destinations(db)
    yield


app = FastAPI(
    lifespan=lifespan,
    title="InterWay API",
    description=(
        "API oficial da "
        "plataforma InterWay."
    ),
    version="3.0.0",
)


origens_permitidas = [
    origem.strip()
    for origem in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origem.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origens_permitidas,
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

app.include_router(
    passport_router
)

app.include_router(
    planner_router
)

app.include_router(
    ia_router
)

app.include_router(profile_router)
app.include_router(conversations_router)
app.include_router(community_router)
app.include_router(plus_router)
app.include_router(admin_router)
app.include_router(destinations_router)
app.include_router(match_router)

@app.get("/")
def home():
    return {
        "message": (
            "InterWay API 3.0"
        ),
        "status": "online",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
    }
