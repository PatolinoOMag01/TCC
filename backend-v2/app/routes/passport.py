import json

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.passport import (
    CHECKLIST_PADRAO,
    Passport,
)
from app.models.user import User
from app.schemas.passport import (
    ChecklistUpdate,
    PassportUpdate,
)
from app.services.security import (
    obter_usuario_atual,
)


router = APIRouter(
    prefix="/passport",
    tags=["InterWay Passport"],
)


def carregar_checklist(
    passport: Passport,
):
    try:
        return json.loads(
            passport.checklist
        )
    except (
        json.JSONDecodeError,
        TypeError,
    ):
        return CHECKLIST_PADRAO.copy()


def calcular_progresso(
    checklist,
):
    if not checklist:
        return 0

    concluidos = sum(
        1
        for item in checklist
        if item.get("concluido")
    )

    return round(
        (
            concluidos
            / len(checklist)
        )
        * 100
    )


def formatar_passport(
    passport: Passport,
):
    checklist = carregar_checklist(
        passport
    )

    return {
        "id": passport.id,
        "usuario_id": (
            passport.usuario_id
        ),
        "pais": passport.pais,
        "cidade": passport.cidade,
        "objetivo": passport.objetivo,
        "nivel_idioma": (
            passport.nivel_idioma
        ),
        "orcamento": (
            passport.orcamento
        ),
        "checklist": checklist,
        "progresso": (
            calcular_progresso(
                checklist
            )
        ),
    }


def obter_ou_criar_passport(
    db: Session,
    usuario: User,
):
    passport = (
        db.query(Passport)
        .filter(
            Passport.usuario_id
            == usuario.id
        )
        .first()
    )

    if passport:
        return passport

    passport = Passport(
        usuario_id=usuario.id,
        checklist=json.dumps(
            CHECKLIST_PADRAO,
            ensure_ascii=False,
        ),
    )

    db.add(passport)
    db.commit()
    db.refresh(passport)

    return passport


@router.get("/me")
def meu_passport(
    db: Session = Depends(
        get_db
    ),
    usuario: User = Depends(
        obter_usuario_atual
    ),
):
    passport = (
        obter_ou_criar_passport(
            db,
            usuario,
        )
    )

    return formatar_passport(
        passport
    )


@router.put("/me")
def atualizar_passport(
    dados: PassportUpdate,
    db: Session = Depends(
        get_db
    ),
    usuario: User = Depends(
        obter_usuario_atual
    ),
):
    passport = (
        obter_ou_criar_passport(
            db,
            usuario,
        )
    )

    valores = dados.model_dump(
        exclude_unset=True
    )

    for campo, valor in (
        valores.items()
    ):
        setattr(
            passport,
            campo,
            valor,
        )

    db.commit()
    db.refresh(passport)

    return formatar_passport(
        passport
    )


@router.patch("/checklist")
def atualizar_checklist(
    dados: ChecklistUpdate,
    db: Session = Depends(
        get_db
    ),
    usuario: User = Depends(
        obter_usuario_atual
    ),
):
    passport = (
        obter_ou_criar_passport(
            db,
            usuario,
        )
    )

    checklist = (
        carregar_checklist(
            passport
        )
    )

    item_encontrado = False

    for item in checklist:
        if item["id"] == dados.id:
            item["concluido"] = (
                dados.concluido
            )

            item_encontrado = True
            break

    if not item_encontrado:
        raise HTTPException(
            status_code=404,
            detail=(
                "Item do checklist "
                "não encontrado."
            ),
        )

    passport.checklist = (
        json.dumps(
            checklist,
            ensure_ascii=False,
        )
    )

    db.commit()
    db.refresh(passport)

    return formatar_passport(
        passport
    )