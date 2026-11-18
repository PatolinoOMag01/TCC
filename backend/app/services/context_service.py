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


def pergunta_sobre_clima(mensagem: str) -> bool:
    texto = normalizar_texto(mensagem)
    palavras = [
        "clima", "temperatura", "tempo em", "tempo agora",
        "tempo hoje", "tempo amanha", "quantos graus", "graus",
        "chovendo", "chover", "vai chover", "chuva", "previsao",
        "sensacao termica", "umidade", "vento", "meteorologia",
        "faz frio", "faz calor", "esta frio", "esta calor",
    ]
    return any(palavra in texto for palavra in palavras)


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


def extrair_cidade(mensagem: str) -> str | None:
    texto = normalizar_texto(mensagem.strip())
    padroes = [
        r"\b(?:em|de|do|da|para|no|na)\s+([a-z][a-z\s.'-]{1,65})",
    ]
    if not pergunta_sobre_clima(mensagem):
        return None
    for padrao in padroes:
        candidatos = re.findall(padrao, texto)
        if not candidatos:
            continue
        cidade = candidatos[-1]
        cidade = re.split(
            r"\b(?:agora|hoje|amanha|nesse momento|atualmente|"
            r"por favor|neste momento|essa semana|proximos dias)\b",
            cidade,
        )[0].strip(" ,.-?!")
        cidade = re.sub(r"^(?:a|o|um|uma)\s+", "", cidade)
        if cidade and cidade not in ("hoje", "amanha", "agora", "tempo"):
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