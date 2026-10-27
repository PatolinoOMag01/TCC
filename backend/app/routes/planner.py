import math
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.planner import Planner
from app.models.user import User
from app.models.passport import Passport
from app.models.profile import ExchangeProfile
from app.schemas.planner import PlannerUpdate
from app.services.security import obter_assinante_plus

router = APIRouter(prefix="/planejador", tags=["Planejador"])

def destino_compartilhado(db: Session, usuario_id: int, legado: str | None = None):
    passport = db.query(Passport).filter(Passport.usuario_id == usuario_id).first()
    perfil = db.query(ExchangeProfile).filter(ExchangeProfile.usuario_id == usuario_id).first()
    cidade = (passport.cidade if passport else None) or (perfil.destino_cidade if perfil else None)
    pais = (passport.pais if passport else None) or (perfil.destino_pais if perfil else None)
    destino = ", ".join(parte for parte in (cidade, pais) if parte)
    return destino or legado

def calcular(p: Planner, destino: str | None = None):
    meta, guardado, mensal = p.meta or 0, p.guardado or 0, p.mensal or 0
    falta = max(meta - guardado, 0)
    progresso = min(round((guardado / meta) * 100), 100) if meta > 0 else 0
    meses = math.ceil(falta / mensal) if falta > 0 and mensal > 0 else 0
    return {"id": p.id, "usuario_id": p.usuario_id, "destino": destino if destino is not None else p.destino, "meta": meta, "guardado": guardado, "mensal": mensal, "falta": falta, "progresso": progresso, "meses": meses}

def obter_ou_criar(db: Session, usuario: User):
    item = db.query(Planner).filter(Planner.usuario_id == usuario.id).first()
    if item: return item
    item = Planner(usuario_id=usuario.id)
    db.add(item); db.commit(); db.refresh(item)
    return item

@router.get("/me")
def meu_planejamento(db: Session = Depends(get_db), usuario: User = Depends(obter_assinante_plus)):
    item = obter_ou_criar(db, usuario)
    destino = destino_compartilhado(db, usuario.id, item.destino)
    return calcular(item, destino)

@router.put("/me")
def atualizar_planejamento(dados: PlannerUpdate, db: Session = Depends(get_db), usuario: User = Depends(obter_assinante_plus)):
    item = obter_ou_criar(db, usuario)
    for campo, valor in dados.model_dump().items(): setattr(item, campo, valor)
    db.commit(); db.refresh(item)
    destino = destino_compartilhado(db, usuario.id, item.destino)
    return calcular(item, destino)

@router.get("/plano-interway")
def plano_interway(db: Session = Depends(get_db), usuario: User = Depends(obter_assinante_plus)):
    from app.routes.passport import obter_ou_criar_passport, formatar_passport
    planner = calcular(obter_ou_criar(db, usuario))
    passport = formatar_passport(obter_ou_criar_passport(db, usuario))
    perfil = db.query(ExchangeProfile).filter(ExchangeProfile.usuario_id == usuario.id).first()
    destino = destino_compartilhado(db, usuario.id, planner.get("destino"))
    planner["destino"] = destino
    progresso_passport = passport.get("progresso", 0)
    progresso_financeiro = planner.get("progresso", 0)
    progresso_geral = round((progresso_passport + progresso_financeiro) / 2)
    pendentes = [i["titulo"] for i in passport.get("checklist", []) if not i.get("concluido")]
    proximos = pendentes[:3]
    if planner.get("meta", 0) > 0 and planner.get("falta", 0) > 0:
        proximos.append(f"Continuar reserva financeira: faltam R$ {planner['falta']}")
    return {
        "usuario": usuario.nome,
        "destino": destino,
        "pais": passport.get("pais") or (perfil.destino_pais if perfil else None),
        "objetivo": passport.get("objetivo"),
        "passport": passport,
        "financeiro": planner,
        "perfil_intercambio": ({c.name: getattr(perfil, c.name) for c in perfil.__table__.columns} if perfil else None),
        "progresso_geral": progresso_geral,
        "proximos_passos": proximos,
    }
