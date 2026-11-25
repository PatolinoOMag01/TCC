from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON
from sqlalchemy.sql import func
from app.database import Base


class SavedMatch(Base):
    __tablename__ = "matches_salvos"
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), primary_key=True)
    dados = Column(JSON, nullable=False)
    salvo_em = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
