from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from app.database import Base


class CommunityMessage(Base):
    __tablename__ = "mensagens_comunidade"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    mensagem = Column(Text, nullable=False)
    criado_em = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
        index=True,
    )
