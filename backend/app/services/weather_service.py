import httpx


GEOCODING_URL = (
    "https://geocoding-api.open-meteo.com/v1/search"
)

FORECAST_URL = (
    "https://api.open-meteo.com/v1/forecast"
)


async def buscar_clima(
    client: httpx.AsyncClient,
    cidade: str,
) -> dict | None:

    response = await client.get(
        GEOCODING_URL,
        params={
            "name": cidade,
            "count": 1,
            "language": "pt",
            "format": "json",
        },
        timeout=8.0,
    )

    response.raise_for_status()

    resultados = (
        response
        .json()
        .get("results", [])
    )

    if not resultados:
        return None

    local = resultados[0]

    response = await client.get(
        FORECAST_URL,
        params={
            "latitude": local["latitude"],
            "longitude": local["longitude"],
            "current": (
                "temperature_2m,"
                "apparent_temperature,"
                "relative_humidity_2m,"
                "precipitation,"
                "weather_code,"
                "wind_speed_10m"
            ),
            "daily": (
                "weather_code,"
                "temperature_2m_max,"
                "temperature_2m_min,"
                "precipitation_probability_max"
            ),
            "timezone": "auto",
            "forecast_days": 3,
        },
        timeout=8.0,
    )

    response.raise_for_status()

    dados = response.json()

    return {
        "cidade": local.get(
            "name",
            cidade,
        ),
        "estado": local.get("admin1"),
        "pais": local.get("country"),
        "timezone": dados.get("timezone"),
        "atual": dados.get(
            "current",
            {},
        ),
        "previsao": dados.get(
            "daily",
            {},
        ),
    }


def criar_contexto_clima(
    clima: dict,
) -> str:
    atual = clima["atual"]
    previsao = clima["previsao"]

    local = clima["cidade"]

    if clima.get("estado"):
        local += (
            f", {clima['estado']}"
        )

    if clima.get("pais"):
        local += (
            f", {clima['pais']}"
        )

    texto = (
        "\n\nDADOS METEOROLOGICOS REAIS\n"
        f"Local: {local}\n"
        f"Timezone: {clima.get('timezone')}\n"
        f"Temperatura atual: "
        f"{atual.get('temperature_2m')} C\n"
        f"Sensacao termica: "
        f"{atual.get('apparent_temperature')} C\n"
        f"Umidade: "
        f"{atual.get('relative_humidity_2m')}%\n"
        f"Precipitacao: "
        f"{atual.get('precipitation')} mm\n"
        f"Vento: "
        f"{atual.get('wind_speed_10m')} km/h\n"
        f"Horario dos dados: "
        f"{atual.get('time')}\n"
    )

    datas = previsao.get(
        "time",
        [],
    )

    maximas = previsao.get(
        "temperature_2m_max",
        [],
    )

    minimas = previsao.get(
        "temperature_2m_min",
        [],
    )

    chuvas = previsao.get(
        "precipitation_probability_max",
        [],
    )

    if datas:
        texto += "\nPREVISAO:\n"

        for indice, data in enumerate(
            datas[:3]
        ):
            maxima = (
                maximas[indice]
                if indice < len(maximas)
                else None
            )

            minima = (
                minimas[indice]
                if indice < len(minimas)
                else None
            )

            chuva = (
                chuvas[indice]
                if indice < len(chuvas)
                else None
            )

            texto += (
                f"{data}: "
                f"min {minima} C, "
                f"max {maxima} C, "
                f"chuva {chuva}%\n"
            )

    texto += (
        "\nFonte: Open-Meteo. "
        "Use os valores acima e nao invente "
        "dados meteorologicos."
    )

    return texto
    