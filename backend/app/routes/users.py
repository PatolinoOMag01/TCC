from fastapi import APIRouter, Depends

from app.models.user import User
from app.schemas.user import UserResponse
from app.services.security import obter_usuario_atual

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"],
)


@router.get(
    "/me",
    response_model=UserResponse,
)
def meu_perfil(
    usuario: User = Depends(
        obter_usuario_atual
    ),
):
    return usuario