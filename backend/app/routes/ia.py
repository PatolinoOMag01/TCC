import os

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


load_dotenv()


router = APIRouter(
    prefix="/ia",
    tags=["Inteligência Artificial"],
)


class ChatRequest(BaseModel):
    mensagem: str


class ChatResponse(BaseModel):
    resposta: str


@router.post(
    "/chat",
    response_model=ChatResponse,
)
async def conversar(dados: ChatRequest):
    mensagem = dados.mensagem.strip()

    if not mensagem:
        raise HTTPException(
            status_code=400,
            detail="A mensagem não pode estar vazia.",
        )

    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENROUTER_API_KEY não configurada.",
        )

    payload = {
        "model": "nvidia/nemotron-3-ultra:free",
        "messages": [
            {
                "role": "system",
                "content": (
                    "Você é o Assistente InterWay, "
                    "um assistente especializado em "
                    "intercâmbio, estudos no exterior, "
                    "bolsas, documentação, planejamento "
                    "financeiro e adaptação internacional. "
                    "Responda sempre em português do Brasil, "
                    "de forma clara, amigável e objetiva. "
                    "Não invente informações. Quando uma "
                    "informação depender de regras atuais, "
                    "como vistos, imigração ou valores, "
                    "avise que o usuário deve confirmar em "
                    "fontes oficiais."
                ),
            },
            {
                "role": "user",
                "content": mensagem,
            },
        ],
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(
            timeout=60.0
        ) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
            )

        if response.status_code != 200:
    print("OPENROUTER STATUS:", response.status_code)
    print("OPENROUTER ERRO:", response.text)

    raise HTTPException(
        status_code=502,
        detail=f"Erro do OpenRouter: {response.status_code}",
    )

        resultado = response.json()

        resposta = (
            resultado["choices"][0]["message"]["content"]
        )

        return {
            "resposta": resposta,
        }

    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail=(
                "Não foi possível conectar ao serviço "
                "de inteligência artificial."
            ),
        )