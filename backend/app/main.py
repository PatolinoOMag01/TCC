from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from app.database import (
    Base,
    engine,
)

from app.models import (
    Passport,
    Planner,
    User,
    ExchangeProfile,
    ConversationMessage,
)

from app.routes import (
    auth_router,
    ia_router,
    passport_router,
    planner_router,
    users_router,
    profile_router,
    conversations_router,
)


Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="InterWay API",
    description=(
        "API oficial da "
        "plataforma InterWay."
    ),
    version="3.0.0",
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