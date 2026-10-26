from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.profile import ExchangeProfile
from app.models.passport import Passport
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

def formatar(item, passport=None):
    dados = {c.name: getattr(item, c.name) for c in item.__table__.columns}
    if passport:
        dados["destino_pais"] = passport.pais or item.destino_pais
        dados["destino_cidade"] = passport.cidade or item.destino_cidade
    return dados

@router.get("/me")
def meu_perfil(db: Session = Depends(get_db), usuario: User = Depends(obter_usuario_atual)):
    item = obter_ou_criar(db, usuario)
    passport = db.query(Passport).filter(Passport.usuario_id == usuario.id).first()
    return formatar(item, passport)

@router.put("/me")
def atualizar(dados: ExchangeProfileUpdate, db: Session = Depends(get_db), usuario: User = Depends(obter_usuario_atual)):
    item = obter_ou_criar(db, usuario)
    valores = dados.model_dump(exclude_unset=True)
    for campo, valor in valores.items():
        setattr(item, campo, valor)
    destino_campos = {
        "destino_pais": "pais",
        "destino_cidade": "cidade",
    }
    destino_atualizado = any(campo in valores for campo in destino_campos)
    if destino_atualizado:
        passport = db.query(Passport).filter(Passport.usuario_id == usuario.id).first()
        if not passport:
            passport = Passport(usuario_id=usuario.id)
            db.add(passport)
        for campo, passport_campo in destino_campos.items():
            if campo in valores:
                setattr(passport, passport_campo, valores[campo])
    db.commit(); db.refresh(item)
    passport = db.query(Passport).filter(Passport.usuario_id == usuario.id).first()
    return formatar(item, passport)
