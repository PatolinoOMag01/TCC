from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    CadastroRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
)
from app.services.security import (
    criar_access_token,
    criar_hash_senha,
    verificar_senha,
)

router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"],
)


@router.post(
    "/cadastro",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def cadastrar(
    dados: CadastroRequest,
    db: Session = Depends(get_db),
):
    email = dados.email.strip().lower()
    nome = dados.nome.strip()

    usuario_existente = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe uma conta com este e-mail.",
        )

    novo_usuario = User(
        nome=nome,
        email=email,
        senha_hash=criar_hash_senha(
            dados.senha
        ),
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return novo_usuario


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    dados: LoginRequest,
    db: Session = Depends(get_db),
):
    email = dados.email.strip().lower()

    usuario = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
        )

    senha_correta = verificar_senha(
        dados.senha,
        usuario.senha_hash,
    )

    if not senha_correta:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
        )

    token = criar_access_token(
        usuario.id
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": usuario,
    }