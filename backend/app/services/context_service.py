import re
import unicodedata


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


def historico_para_texto(
    historico,
) -> str:
    partes = []

    for item in historico[-8:]:
        partes.append(
            f"{item.role}: {item.content}"
        )

    return "\n".join(partes)


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
        "graus",
        "chovendo",
        "chuva",
        "previsao do tempo",
        "previsao",
    ]

    return any(
        palavra in texto
        for palavra in palavras
    )


def pergunta_sobre_moeda(
    mensagem: str,
) -> bool:
    texto = normalizar_texto(mensagem)

    palavras = [
        "converter",
        "converte",
        "cotacao",
        "cambio",
        "moeda",
        "quanto da",
        "quanto vale",
        "reais em",
        "real em",
        "dolar",
        "euro",
        "libra",
    ]

    return any(
        palavra in texto
        for palavra in palavras
    )


def extrair_cidade(
    mensagem: str,
) -> str | None:
    texto = normalizar_texto(
        mensagem.strip()
    )

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
            texto,
            flags=re.IGNORECASE,
        )

        if resultado:
            cidade = (
                resultado
                .group(1)
                .strip()
            )

            cidade = re.sub(
                (
                    r"\b("
                    r"agora|hoje|amanha|"
                    r"nesse momento"
                    r")\b"
                ),
                "",
                cidade,
                flags=re.IGNORECASE,
            ).strip(" ,.-")

            if cidade:
                return cidade

    return None


def extrair_ultima_cidade(
    historico,
) -> str | None:
    for item in reversed(
        historico[-8:]
    ):
        cidade = extrair_cidade(
            item.content
        )

        if cidade:
            return cidade

    return None


def usa_referencia_contextual(
    mensagem: str,
) -> bool:
    texto = normalizar_texto(mensagem)

    referencias = [
        " la",
        "ai",
        "nessa cidade",
        "nesse lugar",
        "desse lugar",
        "dessa cidade",
    ]

    texto = f" {texto} "

    return any(
        referencia in texto
        for referencia in referencias
    )