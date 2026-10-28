"""Fallback entre provedores de chat compatíveis com OpenAI."""
import os
import httpx

PROVIDERS = (
    ("openrouter", "OPENROUTER_API_KEY", "https://openrouter.ai/api/v1/chat/completions", "OPENROUTER_MODEL"),
    ("gemini", "GEMINI_API_KEY", "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", "GEMINI_MODEL"),
    ("groq", "GROQ_API_KEY", "https://api.groq.com/openai/v1/chat/completions", "GROQ_MODEL"),
)
DEFAULT_MODELS = {
    "openrouter": "openrouter/free",
    "gemini": "gemini-2.5-flash",
    "groq": "llama-3.3-70b-versatile",
}

async def responder_com_fallback(client: httpx.AsyncClient, mensagens: list[dict]) -> str:
    configurados = [(nome, os.getenv(chave), url, os.getenv(modelo_env, DEFAULT_MODELS[nome]))
                    for nome, chave, url, modelo_env in PROVIDERS if os.getenv(chave)]
    if not configurados:
        raise RuntimeError("Nenhum provedor de IA configurado. Configure OPENROUTER_API_KEY, GEMINI_API_KEY ou GROQ_API_KEY.")
    for nome, chave, url, modelo in configurados:
        try:
            response = await client.post(
                url,
                headers={"Authorization": f"Bearer {chave}", "Content-Type": "application/json"},
                json={"model": modelo, "messages": mensagens, "temperature": 0.5},
                timeout=25.0,
            )
            if response.status_code != 200:
                print(f"Provedor {nome} falhou: HTTP {response.status_code}")
                continue
            choices = response.json().get("choices") or []
            if not choices:
                continue
            content = choices[0].get("message", {}).get("content")
            if isinstance(content, str) and content.strip():
                return content.strip()
        except (httpx.HTTPError, ValueError, KeyError, TypeError) as exc:
            print(f"Provedor {nome} indisponivel: {type(exc).__name__}")
    raise RuntimeError("Todos os provedores de IA configurados falharam.")
