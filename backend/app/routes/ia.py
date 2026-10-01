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


# Cache enquanto o backend estiver ligado.
MODELOS_CACHE = []
MODELO_PREFERIDO = None


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
        timeout=10.0,
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
            gratuitos.append(
                modelo_id
            )

    return gratuitos


def pergunta_sobre_clima(
    mensagem: str,
) -> bool:

    texto = normalizar_texto(
        mensagem
    )

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
        (
            r"(?:temperatura|clima|tempo|graus|chuva)"
            r".*?\bem\s+(.+?)(?:\?|$)"
        ),
        (
            r"(?:como esta)"
            r".*?\bem\s+(.+?)(?:\?|$)"
        ),
        (
            r"(?:previsao)"
            r".*?\b(?:para|em|de)\s+(.+?)(?:\?|$)"
        ),
    ]

    for padrao in padroes:
        resultado = re.search(
            padrao,
            normalizar_texto(texto),
            flags=re.IGNORECASE,
        )

        if resultado:
            cidade = (
                resultado
                .group(1)
                .strip()
            )

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
        timeout=10.0,
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
        timeout=10.0,
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
    global MODELOS_CACHE
    global MODELO_PREFERIDO

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
        async with httpx.AsyncClient() as client:

            contexto_extra = ""

            # CLIMA
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

                    try:
                        clima = await buscar_clima(
                            client,
                            cidade,
                        )

                    except httpx.RequestError:
                        clima = None

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

            # SYSTEM PROMPT
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
                        "internacional. "
                        "Responda sempre em portugues "
                        "do Brasil de forma clara, "
                        "amigavel e objetiva. "
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

            # MEMORIA CURTA
            historico_valido = []

            for item in dados.historico[-8:]:
                if item.role not in [
                    "user",
                    "assistant",
                ]:
                    continue

                conteudo = (
                    item.content
                    .strip()
                )

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

            # MODELOS
            if MODELOS_CACHE:
                modelos = (
                    MODELOS_CACHE.copy()
                )

                print(
                    "Usando cache de modelos."
                )

            else:
                print(
                    "Buscando modelos gratuitos..."
                )

                modelos = (
                    await buscar_modelos_gratuitos(
                        client,
                        headers,
                    )
                )

                MODELOS_CACHE = (
                    modelos.copy()
                )

            if (
                MODELO_PREFERIDO
                and MODELO_PREFERIDO in modelos
            ):
                modelos.remove(
                    MODELO_PREFERIDO
                )

                modelos.insert(
                    0,
                    MODELO_PREFERIDO,
                )

            if not modelos:
                raise HTTPException(
                    status_code=503,
                    detail=(
                        "Nenhum modelo gratuito "
                        "adequado esta disponivel."
                    ),
                )

            # Tenta no maximo quatro modelos.
            for modelo in modelos[:4]:

                payload = {
                    "model": modelo,
                    "messages": mensagens,
                }

                print(
                    "Tentando modelo:",
                    modelo,
                )

                try:
                    response = await client.post(
                        (
                            f"{OPENROUTER_URL}"
                            "/chat/completions"
                        ),
                        headers=headers,
                        json=payload,
                        timeout=15.0,
                    )

                except httpx.TimeoutException:
                    print(
                        "Modelo demorou demais:",
                        modelo,
                    )
                    continue

                except httpx.RequestError as erro:
                    print(
                        "Erro no modelo:",
                        modelo,
                        erro,
                    )
                    continue

                if response.status_code != 200:
                    print(
                        "Modelo falhou:",
                        modelo,
                        response.status_code,
                    )

                    # Se o preferido deixou de funcionar,
                    # deixa de trata-lo como preferido.
                    if (
                        MODELO_PREFERIDO
                        == modelo
                    ):
                        MODELO_PREFERIDO = None

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

                # Evita selecionar classificadores.
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

                # Esse modelo funcionou.
                MODELO_PREFERIDO = modelo

                print(
                    "Modelo escolhido:",
                    modelo,
                )

                return {
                    "resposta": resposta,
                }

            # Se todos os modelos do cache falharem,
            # limpa o cache para a proxima requisicao
            # buscar a lista atualizada.
            MODELOS_CACHE = []
            MODELO_PREFERIDO = None

            raise HTTPException(
                status_code=503,
                detail=(
                    "Os modelos gratuitos estao "
                    "indisponiveis no momento. "
                    "Tente novamente."
                ),
            )

    except HTTPException:
        raise

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