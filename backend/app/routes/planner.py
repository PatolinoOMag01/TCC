import math
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.planner import Planner
from app.models.user import User
from app.schemas.planner import PlannerUpdate
from app.services.security import obter_usuario_atual

router = APIRouter(prefix="/planejador", tags=["Planejador"])

def calcular(p: Planner):
    meta, guardado, mensal = p.meta or 0, p.guardado or 0, p.mensal or 0
    falta = max(meta - guardado, 0)
    progresso = min(round((guardado / meta) * 100), 100) if meta > 0 else 0
    meses = math.ceil(falta / mensal) if falta > 0 and mensal > 0 else 0
    return {"id": p.id, "usuario_id": p.usuario_id, "destino": p.destino, "meta": meta, "guardado": guardado, "mensal": mensal, "falta": falta, "progresso": progresso, "meses": meses}

def obter_ou_criar(db: Session, usuario: User):
    item = db.query(Planner).filter(Planner.usuario_id == usuario.id).first()
    if item: return item
    item = Planner(usuario_id=usuario.id)
    db.add(item); db.commit(); db.refresh(item)
    return item

@router.get("/me")
def meu_planejamento(db: Session = Depends(get_db), usuario: User = Depends(obter_usuario_atual)):
    return calcular(obter_ou_criar(db, usuario))

@router.put("/me")
def atualizar_planejamento(dados: PlannerUpdate, db: Session = Depends(get_db), usuario: User = Depends(obter_usuario_atual)):
    item = obter_ou_criar(db, usuario)
    for campo, valor in dados.model_dump().items(): setattr(item, campo, valor)
    db.commit(); db.refresh(item)
    return calcular(item)

@router.get("/plano-interway")
def plano_interway(db: Session = Depends(get_db), usuario: User = Depends(obter_usuario_atual)):
    from app.routes.passport import obter_ou_criar_passport, formatar_passport
    from app.models.profile import ExchangeProfile
    planner = calcular(obter_ou_criar(db, usuario))
    passport = formatar_passport(obter_ou_criar_passport(db, usuario))
    perfil = db.query(ExchangeProfile).filter(ExchangeProfile.usuario_id == usuario.id).first()
    progresso_passport = passport.get("progresso", 0)
    progresso_financeiro = planner.get("progresso", 0)
    progresso_geral = round((progresso_passport + progresso_financeiro) / 2)
    pendentes = [i["titulo"] for i in passport.get("checklist", []) if not i.get("concluido")]
    proximos = pendentes[:3]
    if planner.get("meta", 0) > 0 and planner.get("falta", 0) > 0:
        proximos.append(f"Continuar reserva financeira: faltam R$ {planner['falta']}")
    return {
        "usuario": usuario.nome,
        "destino": (perfil.destino_cidade if perfil else None) or passport.get("cidade") or planner.get("destino"),
        "pais": (perfil.destino_pais if perfil else None) or passport.get("pais"),
        "objetivo": passport.get("objetivo"),
        "passport": passport,
        "financeiro": planner,
        "perfil_intercambio": ({c.name: getattr(perfil, c.name) for c in perfil.__table__.columns} if perfil else None),
        "progresso_geral": progresso_geral,
        "proximos_passos": proximos,
    }
