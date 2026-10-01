from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.sql import func
from app.database import Base

class Planner(Base):
    __tablename__ = "planejamentos"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    destino = Column(String(180), nullable=True)
    meta = Column(Integer, nullable=False, default=0)
    guardado = Column(Integer, nullable=False, default=0)
    mensal = Column(Integer, nullable=False, default=0)
    criado_em = Column(DateTime, server_default=func.now(), nullable=False)
    atualizado_em = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
