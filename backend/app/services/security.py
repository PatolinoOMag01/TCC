import os
from datetime import datetime, timedelta, timezone

import bcrypt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

load_dotenv()

SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "troque-essa-chave-em-producao",
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

bearer_scheme = HTTPBearer()


def criar_hash_senha(senha: str) -> str:
    senha_bytes = senha.encode("utf-8")

    salt = bcrypt.gensalt()

    hash_senha = bcrypt.hashpw(
        senha_bytes,
        salt,
    )

    return hash_senha.decode("utf-8")


def verificar_senha(
    senha: str,
    senha_hash: str,
) -> bool:
    return bcrypt.checkpw(
        senha.encode("utf-8"),
        senha_hash.encode("utf-8"),
    )


def criar_access_token(user_id: int) -> str:
    expiracao = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expiracao,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def obter_usuario_atual(
    credenciais: HTTPAuthorizationCredentials = Depends(
        bearer_scheme
    ),
    db: Session = Depends(get_db),
):
    token = credenciais.credentials

    erro_credenciais = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido ou expirado.",
        headers={
            "WWW-Authenticate": "Bearer"
        },
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise erro_credenciais

        user_id = int(user_id)

    except (JWTError, ValueError):
        raise erro_credenciais

    usuario = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if usuario is None:
        raise erro_credenciais

    return usuario