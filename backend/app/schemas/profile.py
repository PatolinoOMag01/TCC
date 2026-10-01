from pydantic import BaseModel, Field

class ExchangeProfileUpdate(BaseModel):
    destino_pais: str | None = Field(default=None, max_length=100)
    destino_cidade: str | None = Field(default=None, max_length=100)
    duracao_meses: int | None = Field(default=None, ge=1, le=120)
    data_prevista: str | None = Field(default=None, max_length=20)
    tipo_programa: str | None = Field(default=None, max_length=120)
    area_interesse: str | None = Field(default=None, max_length=150)
    instituicao: str | None = Field(default=None, max_length=180)
    observacoes: str | None = Field(default=None, max_length=2000)
