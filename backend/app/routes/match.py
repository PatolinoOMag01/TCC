import math
from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, StrictBool
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.saved_match import SavedMatch
from app.models.user import User
from app.services.administration import catalogo
from app.services.security import obter_usuario_atual

router = APIRouter(prefix="/match", tags=["Match"])


class Answers(BaseModel):
    objetivo: Literal["idioma", "faculdade", "trabalho", "experiencia"]
    idioma: str = Field(min_length=2, max_length=40, pattern=r"^[a-z]+$")
    orcamento: int = Field(ge=1, le=4, strict=True)
    duracao: Literal["1-mes", "3-meses", "6-meses", "1-ano", "mais-1-ano"]
    clima: Literal["frio", "moderado", "quente"]
    trabalho: StrictBool


class SaveRequest(BaseModel):
    respostas: Answers
    destinoPreferido: str | None = Field(default=None, max_length=120)


def score(destino, respostas):
    perfil = destino.get("match", {})
    pontos, maximo = 0, 70
    for campo, chave, peso in [("objetivo", "objetivos", 20), ("idioma", "idiomas", 20), ("clima", "clima", 10)]:
        if getattr(respostas, campo) in perfil.get(chave, []):
            pontos += peso
    faixa = perfil.get("orcamento")
    if isinstance(faixa, (int, float)):
        diff = faixa - respostas.orcamento
        pontos += 20 if diff <= 0 else 8 if diff == 1 else 3 if diff == 2 else 0
    if perfil.get("duracoes"):
        maximo += 10
        if respostas.duracao in perfil["duracoes"]:
            pontos += 10
    if respostas.trabalho:
        maximo += 5
        if perfil.get("trabalho") is True:
            pontos += 5
    return math.floor(pontos / maximo * 100 + 0.5)


def serialize(row):
    return {**row.dados, "salvo_em": row.salvo_em}


@router.get("/me")
def get_match(db: Session = Depends(get_db), usuario: User = Depends(obter_usuario_atual)):
    row = db.get(SavedMatch, usuario.id)
    return serialize(row) if row else None


@router.put("/me")
def save_match(dados: SaveRequest, db: Session = Depends(get_db), usuario: User = Depends(obter_usuario_atual)):
    destinos = catalogo(db)
    if not destinos:
        raise HTTPException(409, "Nenhum destino disponível para salvar o Match.")
    preferido = (dados.destinoPreferido or "").strip().lower()
    ranking = [{**destino, "compatibilidade": score(destino, dados.respostas)} for destino in destinos]
    ranking.sort(key=lambda d: (-d["compatibilidade"], -int(bool(preferido and preferido in f'{d["pais"]} {d["cidade"]}'.lower()))))
    payload = {"respostas": dados.respostas.model_dump(), "destinoPreferido": dados.destinoPreferido, "ranking": ranking}
    row = db.get(SavedMatch, usuario.id)
    if row is None:
        row = SavedMatch(usuario_id=usuario.id)
        db.add(row)
    row.dados = payload
    row.salvo_em = datetime.now(timezone.utc).replace(tzinfo=None)
    db.commit()
    db.refresh(row)
    return serialize(row)
