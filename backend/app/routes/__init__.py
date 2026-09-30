from app.routes.auth import (
    router as auth_router,
)

from app.routes.users import (
    router as users_router,
)

from app.routes.passport import (
    router as passport_router,
)

from app.routes.ia import (
    router as ia_router,
)


__all__ = [
    "auth_router",
    "users_router",
    "passport_router",
    "ia_router",
]