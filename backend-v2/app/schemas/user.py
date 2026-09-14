from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CadastroRequest(BaseModel):
    nome: str = Field(
        min_length=2,
        max_length=120,
    )

    email: str = Field(
        min_length=5,
        max_length=180,
    )

    senha: str = Field(
        min_length=6,
        max_length=72,
    )


class LoginRequest(BaseModel):
    email: str
    senha: str


class UserResponse(BaseModel):
    id: int
    nome: str
    email: str
    criado_em: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UserResponse