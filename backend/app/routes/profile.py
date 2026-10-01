from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.profile import ExchangeProfile
from app.models.user import User
from app.schemas.profile import ExchangeProfileUpdate
from app.services.security import obter_usuario_atual

router = APIRouter(prefix="/perfil-intercambio", tags=["Perfil de Intercambio"])

def obter_ou_criar(db: Session, usuario: User):
    item = db.query(ExchangeProfile).filter(ExchangeProfile.usuario_id == usuario.id).first()
    if item:
        return item
    item = ExchangeProfile(usuario_id=usuario.id)
    db.add(item); db.commit(); db.refresh(item)
    return item

def formatar(item):
    return {c.name: getattr(item, c.name) for c in item.__table__.columns}

@router.get("/me")
def meu_perfil(db: Session = Depends(get_db), usuario: User = Depends(obter_usuario_atual)):
    return formatar(obter_ou_criar(db, usuario))

@router.put("/me")
def atualizar(dados: ExchangeProfileUpdate, db: Session = Depends(get_db), usuario: User = Depends(obter_usuario_atual)):
    item = obter_ou_criar(db, usuario)
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(item, campo, valor)
    db.commit(); db.refresh(item)
    return formatar(item)
