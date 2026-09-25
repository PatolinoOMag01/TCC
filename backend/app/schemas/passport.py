from typing import Optional

from pydantic import BaseModel


class ChecklistItem(BaseModel):
    id: str
    titulo: str
    concluido: bool


class PassportUpdate(BaseModel):
    pais: Optional[str] = None
    cidade: Optional[str] = None
    objetivo: Optional[str] = None
    nivel_idioma: Optional[str] = None
    orcamento: Optional[int] = None


class ChecklistUpdate(BaseModel):
    id: str
    concluido: bool


class PassportResponse(BaseModel):
    id: int
    usuario_id: int

    pais: Optional[str] = None
    cidade: Optional[str] = None
    objetivo: Optional[str] = None
    nivel_idioma: Optional[str] = None
    orcamento: Optional[int] = None

    checklist: list[ChecklistItem]
    progresso: int