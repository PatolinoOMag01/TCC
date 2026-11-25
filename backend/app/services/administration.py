import json
from pathlib import Path

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.administration import Destination
from app.models.user import User
from app.services.security import obter_usuario_atual


def obter_admin(usuario: User = Depends(obter_usuario_atual)):
    if not usuario.is_admin:
        raise HTTPException(403, "Acesso exclusivo para administradores.")
    return usuario


def seed_destinations(db: Session):
    # An empty catalog can be intentional. Seed exactly once using a marker row.
    if db.get(Destination, "_catalogo_inicializado") is None:
        data = json.loads((Path(__file__).resolve().parents[1] / "data/destinos.json").read_text(encoding="utf-8"))
        for item in data:
            if db.get(Destination, item["slug"]) is None:
                db.add(Destination(slug=item["slug"], dados=item))
        db.add(Destination(slug="_catalogo_inicializado", dados={}))
        db.commit()


def catalogo(db: Session = Depends(get_db)):
    return [row.dados for row in db.query(Destination).filter(Destination.slug != "_catalogo_inicializado").order_by(Destination.slug).all()]
