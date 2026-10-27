from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.sql import func

from app.database import Base


class PlusSubscription(Base):
    __tablename__ = "assinaturas_plus"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    provedor_id = Column(String(80), unique=True, nullable=False, index=True)
    status = Column(String(32), nullable=False, default="pending")
    valor_mensal = Column(Numeric(10, 2), nullable=False, default=29.90)
    moeda = Column(String(3), nullable=False, default="BRL")
    checkout_url = Column(Text, nullable=False)
    criado_em = Column(DateTime, server_default=func.now(), nullable=False)
    atualizado_em = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
