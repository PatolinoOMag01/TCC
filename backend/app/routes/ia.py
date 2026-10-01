from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.conversation import ConversationMessage
from app.schemas.ia import ChatRequest, ChatResponse
from app.services.ia_service import conversar_com_ia
from app.services.security import obter_usuario_opcional

router = APIRouter(prefix="/ia", tags=["Inteligencia Artificial"])

@router.post("/chat", response_model=ChatResponse)
async def conversar(dados: ChatRequest, db: Session = Depends(get_db), usuario: User | None = Depends(obter_usuario_opcional)):
    mensagem = dados.mensagem.strip()
    if not mensagem:
        raise HTTPException(status_code=400, detail="A mensagem nao pode estar vazia.")

    historico = list(dados.historico)
    if usuario:
        salvos = (db.query(ConversationMessage).filter(ConversationMessage.usuario_id == usuario.id)
                  .order_by(ConversationMessage.id.desc()).limit(12).all())
        salvos.reverse()
        if salvos:
            from app.schemas.ia import MensagemHistorico
            historico = [MensagemHistorico(role=i.role, content=i.content) for i in salvos]

    resposta = await conversar_com_ia(mensagem, historico, db, usuario)

    if usuario:
        db.add(ConversationMessage(usuario_id=usuario.id, role="user", content=mensagem[:4000]))
        db.add(ConversationMessage(usuario_id=usuario.id, role="assistant", content=resposta[:12000]))
        db.commit()

    return {"resposta": resposta}
