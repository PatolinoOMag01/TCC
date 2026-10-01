from pydantic import BaseModel, Field

class PlannerUpdate(BaseModel):
    destino: str | None = Field(default=None, max_length=180)
    meta: int = Field(default=0, ge=0)
    guardado: int = Field(default=0, ge=0)
    mensal: int = Field(default=0, ge=0)

class PlannerResponse(PlannerUpdate):
    id: int
    usuario_id: int
    falta: int
    progresso: int
    meses: int
