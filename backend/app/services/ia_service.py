import os

import httpx
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User

from app.services.context_service import (
    extrair_cidade,
    extrair_ultima_cidade,
    pergunta_sobre_clima,
    pergunta_sobre_moeda,
    usa_referencia_contextual,
)

from app.services.currency_service import (
    converter_moeda,
    criar_contexto_moeda,
    detectar_moedas,
    extrair_valor,
)

from app.services.model_service import (
    OPENROUTER_URL,
    buscar_modelos,
    definir_preferido,
    limpar_cache,
    limpar_preferido,
    ordenar_modelos,
)

from app.services.catalog_service import contexto_catalogos
from app.services.user_context_service import criar_contexto_usuario

from app.services.weather_service import (
    buscar_clima,
    criar_contexto_clima,
)


SYSTEM_PROMPT = """
Voce e o Assistente InterWay.

Sua funcao e ajudar estudantes brasileiros que
planejam estudar, trabalhar ou fazer intercambio
no exterior.

Voce pode ajudar com:
- destinos;
- planejamento de intercambio;
- bolsas;
- documentacao;
- idiomas;
- adaptacao cultural;
- planejamento financeiro;
- clima e previsao meteorologica;
- moedas e conversoes;
- organizacao da viagem.

REGRAS:
1. Responda em portugues do Brasil.
2. Seja claro, amigavel e objetivo.
3. Use o contexto da conversa.
4. Nao invente dados atuais.
5. Quando receber dados de uma ferramenta,
   use esses dados.
6. Diferencie estimativas de valores reais.
7. Para vistos, leis, imigracao, bolsas,
   prazos e regras oficiais que possam mudar,
   recomende confirmacao em fonte oficial.
8. Nao diga que consultou uma ferramenta se
   nenhuma ferramenta foi utilizada.
9. Se nao souber uma informacao atual,
   diga que ela precisa ser verificada.
10. Considere valores de cambio como referencia;
    bancos e cartoes podem cobrar taxas.
""".strip()


async def gerar_contexto_ferramentas(
    client: httpx.AsyncClient,
    mensagem: str,
    historico,
) -> str:

    contextos = []

    # CLIMA
    if pergunta_sobre_clima(
        mensagem
    ):
        cidade = extrair_cidade(
            mensagem
        )

        if (
            not cidade
            and usa_referencia_contextual(
                mensagem
            )
        ):
            cidade = (
                extrair_ultima_cidade(
                    historico
                )
            )

        if cidade:
            try:
                clima = await buscar_clima(
                    client,
                    cidade,
                )

                if clima:
                    contextos.append(
                        criar_contexto_clima(
                            clima
                        )
                    )

                else:
                    contextos.append(
                        (
                            "\nNao foi possivel "
                            "localizar a cidade "
                            f"'{cidade}'."
                        )
                    )

            except httpx.RequestError:
                contextos.append(
                    (
                        "\nO servico meteorologico "
                        "esta temporariamente "
                        "indisponivel."
                    )
                )

        else:
            contextos.append(
                (
                    "\nO usuario perguntou sobre "
                    "clima, mas nenhuma cidade "
                    "foi identificada. Pergunte "
                    "qual cidade ele deseja consultar."
                )
            )

    # MOEDA
    if pergunta_sobre_moeda(
        mensagem
    ):
        moedas = detectar_moedas(
            mensagem
        )

        valor = extrair_valor(
            mensagem
        )

        if moedas and valor is not None:
            origem, destino = moedas

            try:
                dados = await converter_moeda(
                    client,
                    valor,
                    origem,
                    destino,
                )

                contextos.append(
                    criar_contexto_moeda(
                        dados
                    )
                )

            except httpx.RequestError:
                contextos.append(
                    (
                        "\nO servico de cambio "
                        "esta temporariamente "
                        "indisponivel."
                    )
                )

    return "\n".join(
        contextos
    )


def montar_mensagens(
    mensagem: str,
    historico,
    contexto_ferramentas: str,
    contexto_usuario: str = "",
    contexto_catalogo: str = "",
) -> list[dict]:

    system = SYSTEM_PROMPT

    if contexto_ferramentas:
        system += "\n\nCONTEXTO DE FERRAMENTAS:" + contexto_ferramentas
    if contexto_usuario:
        system += "\n\nCONTEXTO PESSOAL DO INTERWAY:\n" + contexto_usuario
    if contexto_catalogo:
        system += "\n\n" + contexto_catalogo

    mensagens = [
        {
            "role": "system",
            "content": system,
        }
    ]

    for item in historico[-8:]:
        conteudo = (
            item.content
            .strip()
        )

        if not conteudo:
            continue

        mensagens.append(
            {
                "role": item.role,
                "content": conteudo[:4000],
            }
        )

    mensagens.append(
        {
            "role": "user",
            "content": mensagem,
        }
    )

    return mensagens


async def conversar_com_ia(
    mensagem: str,
    historico,
    db: Session | None = None,
    usuario: User | None = None,
) -> str:

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

    async with httpx.AsyncClient() as client:

        contexto = (
            await gerar_contexto_ferramentas(
                client,
                mensagem,
                historico,
            )
        )

        contexto_usuario = criar_contexto_usuario(db, usuario) if db is not None else ""
        contexto_catalogo = contexto_catalogos(mensagem)

        mensagens = montar_mensagens(
            mensagem,
            historico,
            contexto,
            contexto_usuario,
            contexto_catalogo,
        )

        try:
            modelos = await buscar_modelos(
                client,
                headers,
            )

        except httpx.RequestError:
            raise HTTPException(
                status_code=503,
                detail=(
                    "Nao foi possivel consultar "
                    "os modelos de IA."
                ),
            )

        modelos = ordenar_modelos(
            modelos
        )

        if not modelos:
            raise HTTPException(
                status_code=503,
                detail=(
                    "Nenhum modelo gratuito "
                    "esta disponivel agora."
                ),
            )

        for modelo in modelos[:4]:

            print(
                "Tentando modelo:",
                modelo,
            )

            payload = {
                "model": modelo,
                "messages": mensagens,
                "temperature": 0.5,
            }

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
                    "Timeout:",
                    modelo,
                )
                continue

            except httpx.RequestError:
                continue

            if response.status_code != 200:
                print(
                    "Modelo falhou:",
                    modelo,
                    response.status_code,
                )

                limpar_preferido()
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
                continue

            definir_preferido(
                modelo
            )

            print(
                "Modelo escolhido:",
                modelo,
            )

            return resposta

        limpar_cache()
        limpar_preferido()

        raise HTTPException(
            status_code=503,
            detail=(
                "Os modelos gratuitos estao "
                "ocupados ou indisponiveis. "
                "Tente novamente em instantes."
            ),
        )