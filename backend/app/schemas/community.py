from datetime import datetime

from pydantic import BaseModel, Field


class CommunityMessageCreate(BaseModel):
    mensagem: str = Field(min_length=1, max_length=1000)


class CommunityMessageResponse(BaseModel):
    id: int
    usuario_id: int
    nome: str
    mensagem: str
    criado_em: datetime
