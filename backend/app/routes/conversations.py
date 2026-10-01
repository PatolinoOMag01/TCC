from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.conversation import ConversationMessage
from app.models.user import User
from app.services.security import obter_usuario_atual

router = APIRouter(prefix="/ia/historico", tags=["Historico da IA"])

@router.get("")
def listar(db: Session = Depends(get_db), usuario: User = Depends(obter_usuario_atual)):
    itens = (db.query(ConversationMessage).filter(ConversationMessage.usuario_id == usuario.id)
             .order_by(ConversationMessage.id.desc()).limit(40).all())
    itens.reverse()
    return [{"id": i.id, "role": i.role, "content": i.content, "criado_em": i.criado_em} for i in itens]

@router.delete("")
def limpar(db: Session = Depends(get_db), usuario: User = Depends(obter_usuario_atual)):
    db.query(ConversationMessage).filter(ConversationMessage.usuario_id == usuario.id).delete()
    db.commit()
    return {"ok": True}
