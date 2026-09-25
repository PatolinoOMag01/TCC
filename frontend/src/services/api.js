const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


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

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data = null;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        "Erro ao comunicar com o servidor."
    );
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
};