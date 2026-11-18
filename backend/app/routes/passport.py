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
from app.models.profile import ExchangeProfile
from app.models.planner import Planner
from app.schemas.passport import (
    ChecklistUpdate,
    PassportUpdate,
)
from app.services.security import (
    obter_assinante_plus,
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
    return round((concluidos / len(checklist)) * 100)


def sincronizar_checklist(db: Session, passport: Passport, usuario: User):
    perfil = db.query(ExchangeProfile).filter(ExchangeProfile.usuario_id == usuario.id).first()
    planejamento = db.query(Planner).filter(Planner.usuario_id == usuario.id).first()
    dados_alterados = False
    if perfil:
        if not passport.pais and perfil.destino_pais:
            passport.pais = perfil.destino_pais
            dados_alterados = True
        if not passport.cidade and perfil.destino_cidade:
            passport.cidade = perfil.destino_cidade
            dados_alterados = True
    checklist = carregar_checklist(passport)
    destino_pais = passport.pais or (perfil.destino_pais if perfil else None)
    destino_cidade = passport.cidade or (perfil.destino_cidade if perfil else None)
    itens_automaticos = {
        "perfil": bool(usuario.nome and usuario.email and passport.objetivo and passport.nivel_idioma),
        "destino": bool(destino_pais or destino_cidade),
        "orcamento": bool((passport.orcamento or 0) > 0 or (planejamento and (planejamento.meta or 0) > 0)),
    }
    alterado = dados_alterados
    for item in checklist:
        if item.get("id") in itens_automaticos:
            concluido = itens_automaticos[item["id"]]
            if item.get("concluido") != concluido:
                item["concluido"] = concluido
                alterado = True
    if alterado:
        passport.checklist = json.dumps(checklist, ensure_ascii=False)
        db.commit()
        db.refresh(passport)
    return checklist

def formatar_passport(
    passport: Passport,
    checklist=None,
):
    checklist = checklist if checklist is not None else carregar_checklist(passport)

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
        obter_assinante_plus
    ),
):
    passport = (
        obter_ou_criar_passport(
            db,
            usuario,
        )
    )

    checklist = sincronizar_checklist(db, passport, usuario)
    return formatar_passport(passport, checklist)


@router.put("/me")
def atualizar_passport(
    dados: PassportUpdate,
    db: Session = Depends(
        get_db
    ),
    usuario: User = Depends(
        obter_assinante_plus
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

    campos_destino = {
        "pais": "destino_pais",
        "cidade": "destino_cidade",
    }
    destino_atualizado = {
        campo: valores[campo]
        for campo in campos_destino
        if campo in valores
    }
    if destino_atualizado:
        perfil = (
            db.query(ExchangeProfile)
            .filter(ExchangeProfile.usuario_id == usuario.id)
            .first()
        )
        if perfil:
            for campo, valor in destino_atualizado.items():
                setattr(perfil, campos_destino[campo], valor)

    db.commit()
    db.refresh(passport)
    checklist = sincronizar_checklist(db, passport, usuario)
    return formatar_passport(passport, checklist)


@router.patch("/checklist")
def atualizar_checklist(
    dados: ChecklistUpdate,
    db: Session = Depends(
        get_db
    ),
    usuario: User = Depends(
        obter_assinante_plus
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
            if dados.id in {"perfil", "destino", "orcamento"}:
                break
            item["concluido"] = (
                dados.concluido
            )

            item_encontrado = True
            break

    if dados.id in {"perfil", "destino", "orcamento"}:
        checklist = sincronizar_checklist(db, passport, usuario)
        return formatar_passport(passport, checklist)
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
    checklist = sincronizar_checklist(db, passport, usuario)
    return formatar_passport(passport, checklist)
