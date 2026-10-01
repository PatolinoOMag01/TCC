from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func
from app.database import Base

class ExchangeProfile(Base):
    __tablename__ = "perfis_intercambio"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    destino_pais = Column(String(100), nullable=True)
    destino_cidade = Column(String(100), nullable=True)
    duracao_meses = Column(Integer, nullable=True)
    data_prevista = Column(String(20), nullable=True)
    tipo_programa = Column(String(120), nullable=True)
    area_interesse = Column(String(150), nullable=True)
    instituicao = Column(String(180), nullable=True)
    observacoes = Column(Text, nullable=True)
    criado_em = Column(DateTime, server_default=func.now(), nullable=False)
    atualizado_em = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
