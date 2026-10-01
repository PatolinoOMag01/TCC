from typing import Literal

from pydantic import BaseModel, Field


class MensagemHistorico(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(
        min_length=1,
        max_length=4000,
    )


class ChatRequest(BaseModel):
    mensagem: str = Field(
        min_length=1,
        max_length=4000,
    )
    historico: list[MensagemHistorico] = Field(
        default_factory=list,
        max_length=12,
    )


class ChatResponse(BaseModel):
    resposta: str