import time

import httpx


OPENROUTER_URL = (
    "https://openrouter.ai/api/v1"
)

CACHE_DURACAO = 600

_modelos_cache = []
_cache_criado_em = 0.0
_modelo_preferido = None


def modelo_inadequado(
    modelo: dict,
) -> bool:

    texto = " ".join(
        [
            str(modelo.get("id", "")),
            str(modelo.get("name", "")),
            str(
                modelo.get(
                    "description",
                    "",
                )
            ),
        ]
    ).lower()

    bloqueadas = [
        "safety",
        "moderation",
        "classifier",
        "guard",
        "embedding",
        "rerank",
        "transcribe",
        "speech",
        "image generation",
    ]

    return any(
        palavra in texto
        for palavra in bloqueadas
    )


def modelo_gratuito(
    modelo: dict,
) -> bool:

    pricing = (
        modelo.get("pricing")
        or {}
    )

    try:
        return (
            float(
                pricing.get(
                    "prompt",
                    1,
                )
            )
            == 0
            and
            float(
                pricing.get(
                    "completion",
                    1,
                )
            )
            == 0
        )

    except (TypeError, ValueError):
        return False


async def buscar_modelos(
    client: httpx.AsyncClient,
    headers: dict,
) -> list[str]:

    global _modelos_cache
    global _cache_criado_em

    agora = time.monotonic()

    cache_valido = (
        _modelos_cache
        and (
            agora
            - _cache_criado_em
        ) < CACHE_DURACAO
    )

    if cache_valido:
        return _modelos_cache.copy()

    response = await client.get(
        f"{OPENROUTER_URL}/models",
        headers=headers,
        timeout=8.0,
    )

    response.raise_for_status()

    gratuitos = []

    for modelo in (
        response
        .json()
        .get("data", [])
    ):
        if not modelo_gratuito(
            modelo
        ):
            continue

        if modelo_inadequado(
            modelo
        ):
            continue

        modelo_id = modelo.get(
            "id"
        )

        if modelo_id:
            gratuitos.append(
                modelo_id
            )

    _modelos_cache = gratuitos
    _cache_criado_em = agora

    return gratuitos.copy()


def ordenar_modelos(
    modelos: list[str],
) -> list[str]:

    if (
        _modelo_preferido
        and _modelo_preferido
        in modelos
    ):
        modelos.remove(
            _modelo_preferido
        )

        modelos.insert(
            0,
            _modelo_preferido,
        )

    return modelos


def definir_preferido(
    modelo: str,
):
    global _modelo_preferido

    _modelo_preferido = modelo


def limpar_preferido():
    global _modelo_preferido

    _modelo_preferido = None


def limpar_cache():
    global _modelos_cache
    global _cache_criado_em

    _modelos_cache = []
    _cache_criado_em = 0.0
    