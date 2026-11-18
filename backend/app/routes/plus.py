import hashlib
import hmac
import os
from uuid import uuid4

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.plus_subscription import PlusSubscription
from app.models.user import User
from app.services.security import obter_usuario_atual


router = APIRouter(prefix="/plus", tags=["InterWay Plus"])
MERCADO_PAGO_API = "https://api.mercadopago.com"
VALOR_MENSAL = 29.90


def _access_token() -> str:
    return os.getenv("MERCADOPAGO_ACCESS_TOKEN", "").strip()


def _modo_demonstracao() -> bool:
    return os.getenv("PLUS_DEMO_MODE", "true").strip().lower() in {
        "1", "true", "yes", "on",
    }


def _consultar_assinatura_mp(provedor_id: str, token: str) -> dict | None:
    try:
        response = httpx.get(
            f"{MERCADO_PAGO_API}/preapproval/{provedor_id}",
            headers={"Authorization": f"Bearer {token}"},
            timeout=12,
        )
        response.raise_for_status()
        return response.json()
    except (httpx.HTTPError, ValueError):
        return None


def _sincronizar_status(assinatura: PlusSubscription, token: str) -> bool:
    dados_mp = _consultar_assinatura_mp(assinatura.provedor_id, token)
    if not dados_mp:
        return False

    if str(dados_mp.get("external_reference")) != str(assinatura.usuario_id):
        return False

    status_mp = dados_mp.get("status")
    if status_mp:
        assinatura.status = status_mp
    return True


def _validar_assinatura_webhook(
    assinatura_header: str | None,
    request_id: str | None,
    data_id: str | None,
    segredo: str,
) -> bool:
    if not assinatura_header or not request_id or not data_id:
        return False

    partes = {}
    for item in assinatura_header.split(","):
        chave, separador, valor = item.strip().partition("=")
        if separador:
            partes[chave] = valor

    timestamp = partes.get("ts")
    assinatura_recebida = partes.get("v1")
    if not timestamp or not assinatura_recebida:
        return False

    manifesto = f"id:{data_id.lower()};request-id:{request_id};ts:{timestamp};"
    assinatura_esperada = hmac.new(
        segredo.encode("utf-8"),
        manifesto.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(assinatura_recebida, assinatura_esperada)


def _resposta_assinatura(assinatura: PlusSubscription | None) -> dict:
    if assinatura is None:
        return {
            "status": "none",
            "ativa": False,
            "valor_mensal": VALOR_MENSAL,
            "modo_demonstracao": _modo_demonstracao(),
        }

    return {
        "status": assinatura.status,
        "ativa": assinatura.status == "authorized",
        "valor_mensal": float(assinatura.valor_mensal),
        "moeda": assinatura.moeda,
        "criado_em": assinatura.criado_em,
        "demonstracao": assinatura.provedor_id.startswith("demo-"),
        "modo_demonstracao": _modo_demonstracao(),
    }


@router.post("/assinatura/demo")
def ativar_plus_demo(
    db: Session = Depends(get_db),
    usuario: User = Depends(obter_usuario_atual),
):
    if not _modo_demonstracao():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="A ativação de demonstração do Plus não está habilitada.",
        )

    ultima = (
        db.query(PlusSubscription)
        .filter(PlusSubscription.usuario_id == usuario.id)
        .order_by(PlusSubscription.id.desc())
        .first()
    )
    if ultima and ultima.status == "authorized":
        return _resposta_assinatura(ultima)

    assinatura = PlusSubscription(
        usuario_id=usuario.id,
        provedor_id=f"demo-{uuid4().hex}",
        status="authorized",
        valor_mensal=VALOR_MENSAL,
        moeda="BRL",
        checkout_url="demo://interway-plus",
    )
    db.add(assinatura)
    db.commit()
    db.refresh(assinatura)
    return _resposta_assinatura(assinatura)


@router.post("/assinatura/checkout")
def criar_checkout_plus(
    db: Session = Depends(get_db),
    usuario: User = Depends(obter_usuario_atual),
):
    token = _access_token()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="O checkout do Mercado Pago ainda não foi configurado no servidor.",
        )

    ultima = (
        db.query(PlusSubscription)
        .filter(PlusSubscription.usuario_id == usuario.id)
        .order_by(PlusSubscription.id.desc())
        .first()
    )

    if ultima:
        _sincronizar_status(ultima, token)
        if ultima.status == "authorized":
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Sua assinatura InterWay Plus já está ativa.",
            )
        if ultima.status == "pending" and ultima.checkout_url:
            db.commit()
            return {
                "checkout_url": ultima.checkout_url,
                "status": ultima.status,
            }

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    payload = {
        "reason": "Assinatura mensal InterWay Plus",
        "external_reference": str(usuario.id),
        "payer_email": usuario.email,
        "auto_recurring": {
            "frequency": 1,
            "frequency_type": "months",
            "transaction_amount": VALOR_MENSAL,
            "currency_id": "BRL",
        },
        "back_url": f"{frontend_url}/plus/retorno",
    }
    backend_public_url = os.getenv("BACKEND_PUBLIC_URL", "").rstrip("/")
    if backend_public_url:
        payload["notification_url"] = f"{backend_public_url}/plus/webhook"

    try:
        response = httpx.post(
            f"{MERCADO_PAGO_API}/preapproval",
            headers={"Authorization": f"Bearer {token}"},
            json=payload,
            timeout=15,
        )
        response.raise_for_status()
        dados_mp = response.json()
    except (httpx.HTTPError, ValueError) as erro:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Não foi possível iniciar o checkout no Mercado Pago. Tente novamente.",
        ) from erro

    provedor_id = dados_mp.get("id")
    checkout_url = dados_mp.get("init_point")
    if not provedor_id or not checkout_url:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="O Mercado Pago não retornou o endereço de checkout esperado.",
        )

    assinatura = PlusSubscription(
        usuario_id=usuario.id,
        provedor_id=str(provedor_id),
        status=dados_mp.get("status") or "pending",
        valor_mensal=VALOR_MENSAL,
        moeda="BRL",
        checkout_url=checkout_url,
    )
    db.add(assinatura)
    db.commit()

    return {"checkout_url": checkout_url, "status": assinatura.status}


@router.get("/assinatura/me")
def minha_assinatura_plus(
    db: Session = Depends(get_db),
    usuario: User = Depends(obter_usuario_atual),
):
    assinatura = (
        db.query(PlusSubscription)
        .filter(PlusSubscription.usuario_id == usuario.id)
        .order_by(PlusSubscription.id.desc())
        .first()
    )
    if assinatura and _access_token():
        _sincronizar_status(assinatura, _access_token())
        db.commit()
        db.refresh(assinatura)
    return _resposta_assinatura(assinatura)


@router.post("/assinatura/cancelar")
def cancelar_assinatura_plus(
    db: Session = Depends(get_db),
    usuario: User = Depends(obter_usuario_atual),
):
    assinatura = (
        db.query(PlusSubscription)
        .filter(PlusSubscription.usuario_id == usuario.id)
        .order_by(PlusSubscription.id.desc())
        .first()
    )
    if not assinatura:
        raise HTTPException(status_code=404, detail="Nenhuma assinatura Plus foi encontrada.")

    if assinatura.provedor_id.startswith("demo-"):
        assinatura.status = "canceled"
        db.commit()
        db.refresh(assinatura)
        return _resposta_assinatura(assinatura)

    token = _access_token()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="O gerenciamento do Mercado Pago ainda não está configurado no servidor.",
        )

    try:
        response = httpx.put(
            f"{MERCADO_PAGO_API}/preapproval/{assinatura.provedor_id}",
            headers={"Authorization": f"Bearer {token}"},
            json={"status": "canceled"},
            timeout=15,
        )
        response.raise_for_status()
        dados_mp = response.json()
    except (httpx.HTTPError, ValueError) as erro:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Não foi possível cancelar a assinatura no Mercado Pago.",
        ) from erro

    assinatura.status = dados_mp.get("status", "canceled")
    db.commit()
    return _resposta_assinatura(assinatura)


@router.post("/webhook")
async def webhook_mercado_pago(
    request: Request,
    db: Session = Depends(get_db),
):
    try:
        body = await request.json()
    except ValueError:
        body = {}

    tipo = request.query_params.get("type") or body.get("type")
    if tipo != "subscription_preapproval":
        return {"recebido": True}

    data_id = request.query_params.get("data.id") or str(
        (body.get("data") or {}).get("id", "")
    )
    segredo = os.getenv("MERCADOPAGO_WEBHOOK_SECRET", "").strip()
    if not segredo:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="A assinatura de notificações do Mercado Pago não foi configurada.",
        )

    if not _validar_assinatura_webhook(
        request.headers.get("x-signature"),
        request.headers.get("x-request-id"),
        data_id,
        segredo,
    ):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Assinatura de webhook inválida.")

    token = _access_token()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="O Mercado Pago não foi configurado no servidor.",
        )

    dados_mp = _consultar_assinatura_mp(data_id, token)
    if not dados_mp:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Não foi possível consultar a assinatura notificada.",
        )

    referencia = str(dados_mp.get("external_reference", ""))
    if not referencia.isdigit():
        return {"recebido": True}
    assinatura = (
        db.query(PlusSubscription)
        .filter(
            PlusSubscription.provedor_id == data_id,
            PlusSubscription.usuario_id == int(referencia),
        )
        .first()
    )
    if assinatura and dados_mp.get("status"):
        assinatura.status = dados_mp["status"]
        db.commit()

    return {"recebido": True}
