from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.passport import router as passport_router
from app.routes.planner import router as planner_router
from app.routes.ia import router as ia_router
from app.routes.profile import router as profile_router
from app.routes.conversations import router as conversations_router
__all__ = ["auth_router", "users_router", "passport_router", "planner_router", "ia_router", "profile_router", "conversations_router"]
