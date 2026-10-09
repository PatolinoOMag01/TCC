import re

import httpx

from app.services.context_service import (
    normalizar_texto,
)


CURRENCY_API = (
    "https://api.frankfurter.dev/v1"
)


MOEDAS = {
    "real": "BRL",
    "reais": "BRL",
    "brl": "BRL",

    "dolar": "USD",
    "dolares": "USD",
    "usd": "USD",

    "euro": "EUR",
    "euros": "EUR",
    "eur": "EUR",

    "libra": "GBP",
    "libras": "GBP",
    "gbp": "GBP",

    "dolar canadense": "CAD",
    "cad": "CAD",

    "iene": "JPY",
    "ienes": "JPY",
    "jpy": "JPY",
}


def detectar_moedas(
    mensagem: str,
) -> tuple[str, str] | None:

    texto = normalizar_texto(
        mensagem
    )

    nomes = sorted(MOEDAS, key=len, reverse=True)
    nomes.insert(0, "dolares canadenses")
    padrao = r"\b(?:" + "|".join(re.escape(n) for n in nomes) + r")\b"
    encontradas = []
    for match in re.finditer(padrao, texto):
        nome = match.group(0)
        codigo = "CAD" if nome == "dolares canadenses" else MOEDAS[nome]
        if codigo not in encontradas:
            encontradas.append(codigo)

    if len(encontradas) >= 2:
        return (
            encontradas[0],
            encontradas[1],
        )

    return None


def extrair_valor(
    mensagem: str,
) -> float | None:

    texto = mensagem.replace(
        ".",
        "",
    ).replace(
        ",",
        ".",
    )

    resultado = re.search(
        r"\b(\d+(?:\.\d+)?)\b",
        texto,
    )

    if not resultado:
        return None

    try:
        return float(
            resultado.group(1)
        )

    except ValueError:
        return None


async def converter_moeda(
    client: httpx.AsyncClient,
    valor: float,
    origem: str,
    destino: str,
) -> dict:

    response = await client.get(
        f"{CURRENCY_API}/latest",
        params={
            "amount": valor,
            "from": origem,
            "to": destino,
        },
        timeout=8.0,
    )

    response.raise_for_status()

    dados = response.json()

    convertido = (
        dados
        .get("rates", {})
        .get(destino)
    )

    return {
        "valor": valor,
        "origem": origem,
        "destino": destino,
        "convertido": convertido,
        "data": dados.get("date"),
    }


def criar_contexto_moeda(
    dados: dict,
) -> str:

    return (
        "\n\nDADOS DE CAMBIO:\n"
        f"Valor original: "
        f"{dados['valor']} {dados['origem']}\n"
        f"Valor convertido: "
        f"{dados['convertido']} {dados['destino']}\n"
        f"Data da cotacao: {dados['data']}\n"
        "Use esses valores na resposta e informe "
        "que taxas bancarias podem alterar o valor "
        "final pago pelo usuario."
    )