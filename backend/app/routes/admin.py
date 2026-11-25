from fastapi import APIRouter, Depends, HTTPException, Query, Response
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.administration import Destination, UserAccess
from app.models.community_message import CommunityMessage
from app.models.user import User
from app.routes.community import formatar_mensagem
from app.services.administration import catalogo, obter_admin

router = APIRouter(prefix="/admin", tags=["Administração"], dependencies=[Depends(obter_admin)])
public_router = APIRouter(tags=["Destinos"])


class UserEdit(BaseModel):
    nome: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=180, pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
    bloqueado: bool = False

    @field_validator("nome", "email", mode="before")
    @classmethod
    def trim(cls, value):
        return value.strip() if isinstance(value, str) else value


class MatchData(BaseModel):
    objetivos: list[str] = Field(default_factory=list)
    idiomas: list[str] = Field(default_factory=list)
    orcamento: int = Field(default=2, ge=1, le=4)
    duracoes: list[str] = Field(default_factory=list)
    clima: list[str] = Field(default_factory=list)
    trabalho: bool = False


class DestinationData(BaseModel):
    slug: str = Field(min_length=1, max_length=100, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    pais: str = Field(min_length=2, max_length=120)
    cidade: str = Field(min_length=2, max_length=120)
    cidades: list[str] = Field(default_factory=list, max_length=100)
    bandeira: str = Field(default="", max_length=20)
    continente: str = Field(min_length=2, max_length=80)
    idioma: str = Field(min_length=2, max_length=120)
    moeda: str = Field(min_length=2, max_length=120)
    destaque: str = Field(default="", max_length=120)
    imagem: str = Field(max_length=2000, pattern=r"^https?://[^\s]+$")
    descricao: str = Field(min_length=10, max_length=2000)
    texto: str = Field(min_length=10, max_length=10000)
    beneficios: list[str] = Field(default_factory=list, max_length=30)
    climaResumo: str = Field(default="", max_length=500)
    compatibilidade: int = Field(default=0, ge=0, le=100)
    match: MatchData = Field(default_factory=MatchData)

    @field_validator("pais", "cidade", "continente", "idioma", "moeda", "descricao", "texto", mode="before")
    @classmethod
    def trim(cls, value):
        return value.strip() if isinstance(value, str) else value


@router.get("/usuarios")
def users(db: Session = Depends(get_db), busca: str = Query(default="", max_length=120), pagina: int = Query(default=1, ge=1)):
    query = db.query(User)
    if busca.strip():
        query = query.filter(User.nome.contains(busca.strip(), autoescape=True) | User.email.contains(busca.strip(), autoescape=True))
    total = query.count()
    rows = query.order_by(User.id.desc()).offset((pagina - 1) * 20).limit(20).all()
    blocked = {row.usuario_id for row in db.query(UserAccess).filter(UserAccess.bloqueado.is_(True)).all()}
    return {"total": total, "itens": [{"id": u.id, "nome": u.nome, "email": u.email, "criado_em": u.criado_em, "is_admin": u.is_admin, "bloqueado": u.id in blocked} for u in rows]}


@router.patch("/usuarios/{user_id}")
def update_user(user_id: int, dados: UserEdit, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(404, "Usuário não encontrado.")
    email = dados.email.lower()
    if db.query(User).filter(User.email == email, User.id != user_id).first():
        raise HTTPException(409, "Já existe uma conta com este e-mail.")
    if user.is_admin and (dados.bloqueado or email != user.email):
        raise HTTPException(409, "O e-mail e o acesso de administradores são gerenciados no servidor.")
    user.nome, user.email = dados.nome, email
    access = db.get(UserAccess, user_id)
    if access is None:
        access = UserAccess(usuario_id=user_id)
        db.add(access)
    access.bloqueado = dados.bloqueado
    db.commit()
    return {"message": "Usuário atualizado."}


@router.get("/comunidade")
def messages(db: Session = Depends(get_db), busca: str = Query(default="", max_length=120), pagina: int = Query(default=1, ge=1)):
    query = db.query(CommunityMessage, User.nome).join(User, User.id == CommunityMessage.usuario_id)
    if busca.strip():
        query = query.filter(CommunityMessage.mensagem.contains(busca.strip(), autoescape=True) | User.nome.contains(busca.strip(), autoescape=True))
    total = query.count()
    rows = query.order_by(CommunityMessage.id.desc()).offset((pagina - 1) * 20).limit(20).all()
    return {"total": total, "itens": [formatar_mensagem(m, nome) for m, nome in rows]}


@router.delete("/comunidade/{message_id}", status_code=204)
def delete_message(message_id: int, db: Session = Depends(get_db)):
    row = db.get(CommunityMessage, message_id)
    if row is None:
        raise HTTPException(404, "Mensagem não encontrada.")
    db.delete(row)
    db.commit()
    return Response(status_code=204)


@public_router.get("/destinos")
def public_destinations(db: Session = Depends(get_db)):
    return catalogo(db)


@router.get("/destinos")
def destinations(db: Session = Depends(get_db)):
    return catalogo(db)


def save_destination(dados):
    payload = dados.model_dump()
    payload["cidades"] = list(dict.fromkeys([dados.cidade, *[c.strip() for c in dados.cidades if c.strip()]]))
    return payload


@router.post("/destinos", status_code=201)
def create_destination(dados: DestinationData, db: Session = Depends(get_db)):
    if db.get(Destination, dados.slug):
        raise HTTPException(409, "Já existe um destino com este identificador.")
    payload = save_destination(dados)
    db.add(Destination(slug=dados.slug, dados=payload))
    db.commit()
    return payload


@router.put("/destinos/{slug}")
def update_destination(slug: str, dados: DestinationData, db: Session = Depends(get_db)):
    row = db.get(Destination, slug)
    if row is None or slug == "_catalogo_inicializado":
        raise HTTPException(404, "Destino não encontrado.")
    if dados.slug != slug:
        raise HTTPException(422, "O identificador de um destino existente não pode ser alterado.")
    row.dados = save_destination(dados)
    db.commit()
    return row.dados


@router.delete("/destinos/{slug}", status_code=204)
def delete_destination(slug: str, db: Session = Depends(get_db)):
    row = db.get(Destination, slug)
    if row is None or slug == "_catalogo_inicializado":
        raise HTTPException(404, "Destino não encontrado.")
    db.delete(row)
    db.commit()
    return Response(status_code=204)
