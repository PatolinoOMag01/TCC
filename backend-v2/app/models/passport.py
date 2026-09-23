import json

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.sql import func

from app.database import Base


CHECKLIST_PADRAO = [
    {
        "id": "perfil",
        "titulo": "Perfil completo",
        "concluido": False,
    },
    {
        "id": "destino",
        "titulo": "Destino escolhido",
        "concluido": False,
    },
    {
        "id": "orcamento",
        "titulo": "Orçamento definido",
        "concluido": False,
    },
    {
        "id": "passaporte",
        "titulo": "Passaporte",
        "concluido": False,
    },
    {
        "id": "visto",
        "titulo": "Visto",
        "concluido": False,
    },
    {
        "id": "comprovacao",
        "titulo": "Comprovação financeira",
        "concluido": False,
    },
    {
        "id": "seguro",
        "titulo": "Seguro viagem",
        "concluido": False,
    },
    {
        "id": "hospedagem",
        "titulo": "Hospedagem",
        "concluido": False,
    },
    {
        "id": "passagem",
        "titulo": "Passagem aérea",
        "concluido": False,
    },
]


class Passport(Base):
    __tablename__ = "passports"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    usuario_id = Column(
        Integer,
        ForeignKey(
            "usuarios.id",
            ondelete="CASCADE",
        ),
        unique=True,
        nullable=False,
        index=True,
    )

    pais = Column(
        String(100),
        nullable=True,
    )

    cidade = Column(
        String(100),
        nullable=True,
    )

    objetivo = Column(
        String(150),
        nullable=True,
    )

    nivel_idioma = Column(
        String(80),
        nullable=True,
    )

    orcamento = Column(
        Integer,
        nullable=True,
    )

    checklist = Column(
        Text,
        nullable=False,
        default=lambda: json.dumps(
            CHECKLIST_PADRAO,
            ensure_ascii=False,
        ),
    )

    criado_em = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    atualizado_em = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )