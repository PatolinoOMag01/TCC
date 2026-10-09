from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


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


    @field_validator("senha")
    @classmethod
    def validar_senha_bytes(cls, valor):
        if len(valor.encode("utf-8")) > 72:
            raise ValueError("A senha deve ter no máximo 72 bytes em UTF-8.")
        return valor


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