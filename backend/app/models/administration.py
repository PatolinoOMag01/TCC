from sqlalchemy import Boolean, Column, ForeignKey, Integer, JSON, String

from app.database import Base


class UserAccess(Base):
    __tablename__ = "usuarios_acesso"

    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), primary_key=True)
    bloqueado = Column(Boolean, nullable=False, default=False)


class Destination(Base):
    __tablename__ = "destinos_catalogo"

    slug = Column(String(100), primary_key=True)
    dados = Column(JSON, nullable=False)
