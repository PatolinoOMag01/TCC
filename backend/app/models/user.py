import os

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "usuarios"

    @property
    def is_admin(self):
        emails = {email.strip().lower() for email in os.getenv("ADMIN_EMAILS", "").split(",") if email.strip()}
        return self.email.lower() in emails

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    nome = Column(
        String(120),
        nullable=False,
    )

    email = Column(
        String(180),
        unique=True,
        nullable=False,
        index=True,
    )

    senha_hash = Column(
        String(255),
        nullable=False,
    )

    criado_em = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )
