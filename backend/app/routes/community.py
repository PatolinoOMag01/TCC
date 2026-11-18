from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.community_message import CommunityMessage
from app.models.user import User
from app.schemas.community import (
    CommunityMessageCreate,
    CommunityMessageResponse,
)
from app.services.security import obter_usuario_atual


router = APIRouter(
    prefix="/comunidade/mensagens",
    tags=["Comunidade"],
)


def formatar_mensagem(mensagem: CommunityMessage, nome: str):
    return {
        "id": mensagem.id,
        "usuario_id": mensagem.usuario_id,
        "nome": nome,
        "mensagem": mensagem.mensagem,
        "criado_em": mensagem.criado_em,
    }


@router.get("", response_model=list[CommunityMessageResponse])
def listar_mensagens(
    db: Session = Depends(get_db),
    limite: int = Query(default=50, ge=1, le=100),
):
    resultados = (
        db.query(CommunityMessage, User.nome)
        .join(User, User.id == CommunityMessage.usuario_id)
        .order_by(CommunityMessage.id.desc())
        .limit(limite)
        .all()
    )
    resultados.reverse()
    return [formatar_mensagem(mensagem, nome) for mensagem, nome in resultados]


@router.post(
    "",
    response_model=CommunityMessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def enviar_mensagem(
    dados: CommunityMessageCreate,
    db: Session = Depends(get_db),
    usuario: User = Depends(obter_usuario_atual),
):
    texto = dados.mensagem.strip()
    if not texto:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="A mensagem não pode estar vazia.",
        )

    mensagem = CommunityMessage(
        usuario_id=usuario.id,
        mensagem=texto,
    )
    db.add(mensagem)
    db.commit()
    db.refresh(mensagem)
    return formatar_mensagem(mensagem, usuario.nome)


@router.patch(
    "/{mensagem_id}",
    response_model=CommunityMessageResponse,
)
def editar_mensagem(
    mensagem_id: int,
    dados: CommunityMessageCreate,
    db: Session = Depends(get_db),
    usuario: User = Depends(obter_usuario_atual),
):
    mensagem = db.query(CommunityMessage).filter(CommunityMessage.id == mensagem_id).first()
    if mensagem is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mensagem não encontrada.",
        )
    if mensagem.usuario_id != usuario.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode editar suas próprias mensagens.",
        )

    texto = dados.mensagem.strip()
    if not texto:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="A mensagem não pode estar vazia.",
        )

    mensagem.mensagem = texto
    db.commit()
    db.refresh(mensagem)
    return formatar_mensagem(mensagem, usuario.nome)


@router.delete(
    "/{mensagem_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def apagar_mensagem(
    mensagem_id: int,
    db: Session = Depends(get_db),
    usuario: User = Depends(obter_usuario_atual),
):
    mensagem = db.query(CommunityMessage).filter(CommunityMessage.id == mensagem_id).first()
    if mensagem is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mensagem não encontrada.",
        )
    if mensagem.usuario_id != usuario.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode apagar suas próprias mensagens.",
        )

    db.delete(mensagem)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
