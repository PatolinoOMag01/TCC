const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";
const BASE_URL = API_URL.replace(/\/+$/, "");


async function request(
  endpoint,
  options = {}
) {
  const token =
    localStorage.getItem(
      "interway-token"
    );

  const headers = {
    "Content-Type":
      "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
      signal: options.signal ?? AbortSignal.timeout(endpoint === "/ia/chat" ? 120000 : 15000),
    }
  );
  } catch (cause) {
    throw new Error(cause.name === "TimeoutError"
      ? "O servidor demorou para responder. Tente novamente."
      : "Não foi possível conectar à API. Verifique se o backend está iniciado e se VITE_API_URL está correto.", { cause });
  }

  let data;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      (Array.isArray(data?.detail)
        ? data.detail.map((item) => item.msg).join("; ")
        : data?.detail) ||
        "Erro ao comunicar com o servidor."
    );
    error.status = response.status;
    throw error;
  }

  return data;
}


export const api = {
  cadastrar(dados) {
    return request(
      "/auth/cadastro",
      {
        method: "POST",
        body:
          JSON.stringify(
            dados
          ),
      }
    );
  },

  login(dados) {
    return request(
      "/auth/login",
      {
        method: "POST",
        body:
          JSON.stringify(
            dados
          ),
      }
    );
  },

  meuPerfil() {
    return request(
      "/usuarios/me"
    );
  },

  meuPassport() {
    return request(
      "/passport/me"
    );
  },

  atualizarPassport(
    dados
  ) {
    return request(
      "/passport/me",
      {
        method: "PUT",
        body:
          JSON.stringify(
            dados
          ),
      }
    );
  },

  atualizarChecklist(
    id,
    concluido
  ) {
    return request(
      "/passport/checklist",
      {
        method: "PATCH",
        body:
          JSON.stringify({
            id,
            concluido,
          }),
      }
    );
  },

  meuPlanejamento() {
    return request(
      "/planejador/me"
    );
  },

  atualizarPlanejamento(dados) {
    return request(
      "/planejador/me",
      {
        method: "PUT",
        body: JSON.stringify(dados),
      }
    );
  },


  meuPerfilIntercambio() {
    return request("/perfil-intercambio/me");
  },

  atualizarPerfilIntercambio(dados) {
    return request("/perfil-intercambio/me", { method: "PUT", body: JSON.stringify(dados) });
  },

  planoInterWay() {
    return request("/planejador/plano-interway");
  },

  listarMensagensComunidade(limite = 50) {
    return request(`/comunidade/mensagens?limite=${limite}`);
  },

  enviarMensagemComunidade(mensagem) {
    return request("/comunidade/mensagens", {
      method: "POST",
      body: JSON.stringify({ mensagem }),
    });
  },

  historicoIA() {
    return request("/ia/historico");
  },

  limparHistoricoIA() {
    return request("/ia/historico", { method: "DELETE" });
  },

  conversarIA(mensagem, historico = []) {
    return request(
      "/ia/chat",
      {
        method: "POST",
        body: JSON.stringify({
          mensagem,
          historico,
        }),
      }
    );
  },
};
