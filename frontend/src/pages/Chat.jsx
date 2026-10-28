import PageNavigation from "../components/PageNavigation";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Send,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function formatarHora(dataIso) {
  try {
    const data = new Date(dataIso);

    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    });
  } catch {
    return "";
  }
}

function corAvatar(nome) {
  const cores = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  let hash = 0;

  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }

  return cores[Math.abs(hash) % cores.length];
}

function formatarMensagem(item, usuarioId) {
  return {
    id: item.id,
    usuarioId: item.usuario_id,
    nome: item.nome || "Intercambista",
    mensagem: item.mensagem,
    data: item.criado_em,
    propria: item.usuario_id === usuarioId,
  };
}

export default function Chat() {
  const { usuario } = useAuth();
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [texto, setTexto] = useState("");
  const fimRef = useRef(null);

  useEffect(() => {
    let ativo = true;
    let carregamentoEmAndamento = false;

    async function carregarMensagens() {
      if (carregamentoEmAndamento) return;
      carregamentoEmAndamento = true;
      try {
        const dados = await api.listarMensagensComunidade();
        if (!ativo) return;
        const atualizadas = dados.map((item) => formatarMensagem(item, usuario?.id));
        setMensagens((anteriores) => {
          const iguais = anteriores.length === atualizadas.length
            && anteriores.every((item, indice) => (
              item.id === atualizadas[indice]?.id
              && item.propria === atualizadas[indice]?.propria
            ));
          return iguais ? anteriores : atualizadas;
        });
        setErro("");
      } catch (falha) {
        if (ativo) setErro(falha.message);
      } finally {
        carregamentoEmAndamento = false;
        if (ativo) setCarregando(false);
      }
    }

    carregarMensagens();
    const intervalo = window.setInterval(() => {
      if (document.visibilityState === "visible") carregarMensagens();
    }, 5000);

    return () => {
      ativo = false;
      window.clearInterval(intervalo);
    };
  }, [usuario?.id]);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  function enviarMensagem(e) {
    e.preventDefault();
    const mensagemLimpa = texto.trim();
    if (!mensagemLimpa || !usuario || enviando) return;

    setEnviando(true);
    setErro("");
    api.enviarMensagemComunidade(mensagemLimpa)
      .then((salva) => {
        const nova = formatarMensagem(salva, usuario.id);
        setMensagens((anteriores) => anteriores.some((item) => item.id === nova.id)
          ? anteriores
          : [...anteriores, nova]);
        setTexto("");
      })
      .catch((falha) => setErro(falha.message))
      .finally(() => setEnviando(false));
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        padding: "40px 20px 40px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "min(900px, 100%)",
          margin: "0 auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PageNavigation />

        <div
          style={{
            background: "var(--surface)",
            borderRadius: 24,
            boxShadow: "0 18px 50px rgba(24, 55, 90, 0.08)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 560,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #e8eef5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(59, 130, 246, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageCircle size={24} color="#3b82f6" />
              </div>

              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 22,
                    color: "var(--text)",
                  }}
                >
                  Comunidade InterWay
                </h1>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "var(--muted)",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Users size={14} />
                  Chat entre intercambistas
                </p>
              </div>
            </div>

            <p role="note" style={{ margin: "12px 20px", color: "var(--muted)", fontSize: 13 }}>
              As mensagens são compartilhadas com a comunidade e atualizadas automaticamente.
            </p>

            {!usuario && (
              <Link
                to="/login"
                style={{
                  fontSize: 14,
                  color: "var(--accent)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Entrar para aparecer com seu nome →
              </Link>
            )}
          </div>

          {/* Mensagens */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              background: "var(--background)",
            }}
          >
            {carregando && (
              <p role="status" style={{ textAlign: "center", color: "var(--muted)" }}>
                Carregando mensagens...
              </p>
            )}
            {erro && (
              <p role="alert" style={{ textAlign: "center", color: "#b42318" }}>
                {erro} Tentaremos novamente em alguns segundos.
              </p>
            )}
            {!carregando && !erro && mensagens.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--muted)", margin: "auto 0" }}>
                {usuario
                  ? "Ainda não há mensagens. Seja a primeira pessoa a começar a conversa."
                  : "Ainda não há mensagens. Entre na conta para iniciar a conversa."}
              </p>
            )}
            {mensagens.map((msg) => {
              const ePropria = msg.propria;

              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: ePropria
                      ? "flex-end"
                      : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "78%",
                      display: "flex",
                      gap: 10,
                      flexDirection: ePropria
                        ? "row-reverse"
                        : "row",
                    }}
                  >
                    {!ePropria && (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: corAvatar(msg.nome),
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 15,
                          flexShrink: 0,
                        }}
                      >
                        {msg.nome.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 4,
                            paddingLeft: 4,
                          }}
                        >
                          <strong
                            style={{
                              fontSize: 13,
                              color: "var(--text)",
                            }}
                          >
                            {ePropria ? `${msg.nome} (você)` : msg.nome}
                          </strong>
                      </div>

                      <div
                        style={{
                          background: ePropria
                            ? "#173b67"
                            : "#fff",
                          color: ePropria
                            ? "#fff"
                            : "#0b1f33",
                          padding: "12px 16px",
                          borderRadius: ePropria
                            ? "18px 18px 4px 18px"
                            : "18px 18px 18px 4px",
                          boxShadow: ePropria
                            ? "none"
                            : "0 4px 14px rgba(24, 55, 90, 0.06)",
                          lineHeight: 1.5,
                          fontSize: 15,
                        }}
                      >
                        {msg.mensagem}
                      </div>

                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--muted)",
                          marginTop: 4,
                          textAlign: ePropria
                            ? "right"
                            : "left",
                          paddingLeft: ePropria ? 0 : 4,
                          paddingRight: ePropria ? 4 : 0,
                        }}
                      >
                        {formatarHora(msg.data)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={fimRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={enviarMensagem}
            style={{
              padding: "16px 20px",
              borderTop: "1px solid #e8eef5",
              display: "flex",
              gap: 12,
              background: "var(--surface)",
            }}
          >
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={1000}
              disabled={!usuario || enviando}
              placeholder={
                usuario
                  ? "Escreva sua mensagem..."
                  : "Entre na conta para enviar uma mensagem..."
              }
              style={{
                flex: 1,
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: "14px 18px",
                fontSize: 15,
                outline: "none",
                background: "var(--background)",
              }}
            />

            <button
              type="submit"
              disabled={!texto.trim() || !usuario || enviando}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: texto.trim() && usuario && !enviando
                  ? "#173b67"
                  : "#94a3b8",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "0 22px",
                fontWeight: 700,
                fontSize: 15,
                cursor: texto.trim() && usuario && !enviando
                  ? "pointer"
                  : "not-allowed",
              }}
            >
              {enviando ? "Enviando..." : "Enviar"}
              <Send size={17} />
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            fontSize: 13,
            marginTop: 16,
          }}
        >
          As mensagens ficam salvas no InterWay e aparecem em todos os dispositivos.
          {usuario
            ? ` Você está como ${usuario.nome}.`
            : " Entre na conta para participar da conversa."}
        </p>
      </div>
    </main>
  );
}
