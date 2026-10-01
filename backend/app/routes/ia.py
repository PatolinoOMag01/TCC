import os
import re
import unicodedata

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


load_dotenv()

router = APIRouter(
    prefix="/ia",
    tags=["Inteligencia Artificial"],
)

OPENROUTER_URL = "https://openrouter.ai/api/v1"
OPEN_METEO_GEOCODING_URL = (
    "https://geocoding-api.open-meteo.com/v1/search"
)
OPEN_METEO_FORECAST_URL = (
    "https://api.open-meteo.com/v1/forecast"
)


class MensagemHistorico(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    mensagem: str
    historico: list[MensagemHistorico] = []


class ChatResponse(BaseModel):
    resposta: str


def normalizar_texto(texto: str) -> str:
    texto = unicodedata.normalize(
        "NFD",
        texto.lower(),
    )

    return "".join(
        caractere
        for caractere in texto
        if unicodedata.category(caractere) != "Mn"
    )


def modelo_inadequado(modelo: dict) -> bool:
    texto = " ".join(
        [
            str(modelo.get("id", "")),
            str(modelo.get("name", "")),
            str(modelo.get("description", "")),
        ]
    ).lower()

    palavras_bloqueadas = [
        "safety",
        "moderation",
        "classifier",
        "guard",
        "medical",
        "health",
        "finance",
        "embedding",
        "rerank",
        "transcribe",
        "speech",
        "image generation",
    ]

    return any(
        palavra in texto
        for palavra in palavras_bloqueadas
    )


def modelo_gratuito(modelo: dict) -> bool:
    pricing = modelo.get("pricing") or {}

    try:
        prompt = float(
            pricing.get("prompt", 1)
        )
        completion = float(
            pricing.get("completion", 1)
        )

        return (
            prompt == 0
            and completion == 0
        )
    except (TypeError, ValueError):
        return False


async def buscar_modelos_gratuitos(
    client: httpx.AsyncClient,
    headers: dict,
) -> list[str]:

    response = await client.get(
        f"{OPENROUTER_URL}/models",
        headers=headers,
    )

    response.raise_for_status()

    dados = response.json()
    modelos = dados.get("data", [])

    gratuitos = []

    for modelo in modelos:
        if not modelo_gratuito(modelo):
            continue

        if modelo_inadequado(modelo):
            continue

        modelo_id = modelo.get("id")

        if modelo_id:
            gratuitos.append(modelo_id)

    return gratuitos


def pergunta_sobre_clima(
    mensagem: str,
) -> bool:

    texto = normalizar_texto(mensagem)

    palavras = [
        "clima",
        "temperatura",
        "tempo em",
        "tempo agora",
        "quantos graus",
        "graus em",
        "chovendo",
        "chuva em",
        "previsao do tempo",
        "previsao em",
    ]

    return any(
        palavra in texto
        for palavra in palavras
    )


def extrair_cidade(
    mensagem: str,
) -> str | None:

    texto = mensagem.strip()

    padroes = [
        r"(?:temperatura|clima|tempo|graus|chuva)"
        r".*?\bem\s+(.+?)(?:\?|$)",

        r"(?:como esta|como está)"
        r".*?\bem\s+(.+?)(?:\?|$)",

        r"(?:previsao|previsão)"
        r".*?\b(?:para|em|de)\s+(.+?)(?:\?|$)",
    ]

    for padrao in padroes:
        resultado = re.search(
            padrao,
            texto,
            flags=re.IGNORECASE,
        )

        if resultado:
            cidade = resultado.group(1).strip()

            cidade = re.sub(
                r"\b(agora|hoje|nesse momento)\b",
                "",
                cidade,
                flags=re.IGNORECASE,
            ).strip(" ,.-")

            if cidade:
                return cidade

    return None


async def buscar_clima(
    client: httpx.AsyncClient,
    cidade: str,
) -> dict | None:

    geo_response = await client.get(
        OPEN_METEO_GEOCODING_URL,
        params={
            "name": cidade,
            "count": 1,
            "language": "pt",
            "format": "json",
        },
    )

    geo_response.raise_for_status()

    geo_data = geo_response.json()
    resultados = geo_data.get(
        "results",
        [],
    )

    if not resultados:
        return None

    local = resultados[0]

    latitude = local["latitude"]
    longitude = local["longitude"]

    clima_response = await client.get(
        OPEN_METEO_FORECAST_URL,
        params={
            "latitude": latitude,
            "longitude": longitude,
            "current": (
                "temperature_2m,"
                "apparent_temperature,"
                "relative_humidity_2m,"
                "precipitation,"
                "weather_code,"
                "wind_speed_10m"
            ),
            "timezone": "auto",
        },
    )

    clima_response.raise_for_status()

    clima_data = clima_response.json()
    atual = clima_data.get(
        "current",
        {},
    )

    return {
        "cidade": local.get(
            "name",
            cidade,
        ),
        "estado": local.get(
            "admin1"
        ),
        "pais": local.get(
            "country"
        ),
        "temperatura": atual.get(
            "temperature_2m"
        ),
        "sensacao": atual.get(
            "apparent_temperature"
        ),
        "umidade": atual.get(
            "relative_humidity_2m"
        ),
        "precipitacao": atual.get(
            "precipitation"
        ),
        "vento": atual.get(
            "wind_speed_10m"
        ),
        "codigo_clima": atual.get(
            "weather_code"
        ),
        "horario": atual.get(
            "time"
        ),
    }


def contexto_clima(
    clima: dict,
) -> str:

    local = clima["cidade"]

    if clima.get("estado"):
        local += (
            f", {clima['estado']}"
        )

    if clima.get("pais"):
        local += (
            f", {clima['pais']}"
        )

    return (
        "\n\nDADOS DE CLIMA EM TEMPO REAL:\n"
        f"Local: {local}\n"
        f"Temperatura: {clima['temperatura']} C\n"
        f"Sensacao termica: {clima['sensacao']} C\n"
        f"Umidade: {clima['umidade']}%\n"
        f"Precipitacao: {clima['precipitacao']} mm\n"
        f"Vento: {clima['vento']} km/h\n"
        f"Codigo meteorologico: {clima['codigo_clima']}\n"
        f"Horario dos dados: {clima['horario']}\n"
        "Fonte dos dados meteorologicos: Open-Meteo.\n"
        "Use estes dados para responder ao usuario. "
        "Nao invente valores diferentes."
    )


@router.post(
    "/chat",
    response_model=ChatResponse,
)
async def conversar(
    dados: ChatRequest,
):

    mensagem = dados.mensagem.strip()

    if not mensagem:
        raise HTTPException(
            status_code=400,
            detail=(
                "A mensagem nao pode "
                "estar vazia."
            ),
        )

    api_key = os.getenv(
        "OPENROUTER_API_KEY"
    )

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail=(
                "OPENROUTER_API_KEY "
                "nao configurada."
            ),
        )

    headers = {
        "Authorization":
            f"Bearer {api_key}",
        "Content-Type":
            "application/json",
        "X-Title":
            "InterWay",
    }

    try:
        async with httpx.AsyncClient(
            timeout=60.0
        ) as client:

            contexto_extra = ""

            if pergunta_sobre_clima(
                mensagem
            ):
                cidade = extrair_cidade(
                    mensagem
                )

                if cidade:
                    print(
                        "Buscando clima:",
                        cidade,
                    )

                    clima = await buscar_clima(
                        client,
                        cidade,
                    )

                    if clima:
                        print(
                            "Clima encontrado:",
                            clima,
                        )

                        contexto_extra = (
                            contexto_clima(
                                clima
                            )
                        )
                    else:
                        contexto_extra = (
                            "\n\nO usuario perguntou "
                            "sobre clima, mas a cidade "
                            "informada nao foi encontrada. "
                            "Peca para ele informar uma "
                            "cidade valida."
                        )
                else:
                    contexto_extra = (
                        "\n\nO usuario perguntou sobre "
                        "clima, mas nenhuma cidade pode "
                        "ser identificada. Peca o nome "
                        "da cidade antes de responder."
                    )

            mensagens = [
                {
                    "role": "system",
                    "content": (
                        "Voce e o Assistente InterWay, "
                        "um assistente especializado em "
                        "intercambio e estudos no exterior. "
                        "Ajude com destinos, bolsas, "
                        "documentacao, planejamento "
                        "financeiro, idiomas e adaptacao "
                        "internacional. Responda sempre "
                        "em portugues do Brasil de forma "
                        "clara, amigavel e objetiva. "
                        "Nao invente informacoes. "
                        "Quando receber dados externos "
                        "em tempo real no contexto, "
                        "use esses dados na resposta. "
                        "Para vistos, imigracao, precos "
                        "ou regras que possam mudar, "
                        "recomende confirmar em fontes "
                        "oficiais."
                        + contexto_extra
                    ),
                },
               
            ]
            historico_valido = []

            for item in dados.historico[-8:]:
                if item.role not in [
                    "user",
                    "assistant",
                ]:
                    continue

                conteudo = item.content.strip()

                if not conteudo:
                    continue

                historico_valido.append(
                    {
                        "role": item.role,
                        "content": conteudo[:4000],
                    }
                )

            mensagens.extend(
                historico_valido
            )

            mensagens.append(
                {
                    "role": "user",
                    "content": mensagem,
                }
            )

            modelos = (
                await buscar_modelos_gratuitos(
                    client,
                    headers,
                )
            )

            if not modelos:
                raise HTTPException(
                    status_code=503,
                    detail=(
                        "Nenhum modelo gratuito "
                        "adequado esta disponivel."
                    ),
                )

            for modelo in modelos[:8]:

                payload = {
                    "model": modelo,
                    "messages": mensagens,
                }

                print(
                    "Tentando modelo:",
                    modelo,
                )

                response = await client.post(
                    (
                        f"{OPENROUTER_URL}"
                        "/chat/completions"
                    ),
                    headers=headers,
                    json=payload,
                )

                if (
                    response.status_code
                    != 200
                ):
                    print(
                        "Modelo falhou:",
                        modelo,
                        response.status_code,
                    )
                    continue

                resultado = response.json()

                choices = resultado.get(
                    "choices",
                    [],
                )

                if not choices:
                    continue

                resposta = (
                    choices[0]
                    .get("message", {})
                    .get("content", "")
                    .strip()
                )

                if not resposta:
                    continue

                resposta_lower = (
                    resposta.lower()
                )

                if (
                    resposta_lower.startswith(
                        "user safety:"
                    )
                    or "safety categories:"
                    in resposta_lower
                ):
                    print(
                        "Classificador ignorado:",
                        modelo,
                    )
                    continue

                print(
                    "Modelo escolhido:",
                    modelo,
                )

                return {
                    "resposta": resposta,
                }

        raise HTTPException(
            status_code=503,
            detail=(
                "Os modelos gratuitos estao "
                "indisponiveis no momento."
            ),
        )

    except httpx.RequestError as erro:
        print(
            "Erro externo:",
            erro,
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "Nao foi possivel conectar "
                "aos servicos externos."
            ),
        )