import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  Bot,
  Globe2,
  Send,
  Sparkles,
  User,
  Trash2,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  api,
} from "../services/api";

import "../styles/AssistenteIA.css";


const SUGESTOES = [
  "Quais são os melhores destinos para intercâmbio?",
  "Como conseguir uma bolsa de estudos?",
  "Quanto dinheiro preciso para um intercâmbio?",
  "Quais documentos preciso preparar?",
];


function AssistenteIA() {
  const [mensagem, setMensagem] =
    useState("");

  const [enviando, setEnviando] =
    useState(false);

  const [mensagens, setMensagens] =
    useState([
      {
        id: 1,
        autor: "ia",
        texto:
          "Olá! Eu sou o Assistente InterWay. 🌎 " +
          "Posso ajudar você com destinos, bolsas, " +
          "documentação, planejamento financeiro e " +
          "outras dúvidas sobre intercâmbio. " +
          "Como posso ajudar?",
      },
    ]);

  const finalRef = useRef(null);

  useEffect(() => {
    finalRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [mensagens, enviando]);

  useEffect(() => {
    async function carregarHistorico() {
      if (!localStorage.getItem("interway-token")) return;
      try {
        const itens = await api.historicoIA();
        if (itens.length) {
          setMensagens(itens.map((item) => ({
            id: item.id,
            autor: item.role === "user" ? "usuario" : "ia",
            texto: item.content,
          })));
        }
      } catch (erro) {
        console.error("Historico da IA:", erro);
      }
    }
    carregarHistorico();
  }, []);

  async function limparHistorico() {
    if (!localStorage.getItem("interway-token")) {
      setMensagens([]);
      return;
    }
    try {
      await api.limparHistoricoIA();
      setMensagens([]);
    } catch (erro) {
      console.error("Erro ao limpar historico:", erro);
    }
  }


  async function enviarMensagem(
    textoPersonalizado
  ) {
    const texto = (
      textoPersonalizado ||
      mensagem
    ).trim();

    if (!texto || enviando) {
      return;
    }

    const mensagemUsuario = {
      id: Date.now(),
      autor: "usuario",
      texto,
    };

    setMensagens(
      (anteriores) => [
        ...anteriores,
        mensagemUsuario,
      ]
    );

    setMensagem("");
    setEnviando(true);

    try {
  const historico = mensagens
    .filter(
      (item) =>
        item.autor === "usuario" ||
        item.autor === "ia"
    )
    .slice(-8)
    .map((item) => ({
      role:
        item.autor === "usuario"
          ? "user"
          : "assistant",
      content: item.texto.slice(0, 4000),
    }));

  const resultado =
    await api.conversarIA(
      texto,
      historico
    );

      setMensagens(
        (anteriores) => [
          ...anteriores,
          {
            id:
              Date.now() + 1,
            autor: "ia",
            texto:
              resultado.resposta,
          },
        ]
      );
    } catch (erro) {
      setMensagens(
        (anteriores) => [
          ...anteriores,
          {
            id:
              Date.now() + 1,
            autor: "erro",
            texto:
              erro.message ||
              "Não consegui responder agora. Tente novamente.",
          },
        ]
      );
    } finally {
      setEnviando(false);
    }
  }


  function aoPressionarTecla(
    event
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      enviarMensagem();
    }
  }


  return (
    <main className="assistente-page">
      <div className="assistente-shell">

        <header className="assistente-header">
          <div className="assistente-header-left">
            <Link
              to="/"
              className="assistente-voltar"
              aria-label="Voltar para o início"
            >
              <ArrowLeft size={21} />
            </Link>

            <div className="assistente-avatar">
              <Globe2 size={27} />
            </div>

            <div>
              <div className="assistente-titulo-linha">
                <h1>
                  InterWay IA
                </h1>

                <Sparkles
                  size={18}
                />
              </div>

              <p>
                Seu assistente de intercâmbio
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button type="button" onClick={limparHistorico} disabled={enviando} title="Limpar conversa" aria-label="Limpar conversa" style={{ border: 0, background: "transparent", cursor: "pointer" }}>
              <Trash2 size={19} />
            </button>
            <div className="assistente-online">
              <span />
              Online
            </div>
          </div>
        </header>


        <section className="assistente-chat">

          <div className="assistente-mensagens">
            {mensagens.map(
              (item) => (
                <div
                  key={item.id}
                  className={
                    `mensagem-linha ${item.autor}`
                  }
                >
                  {item.autor !==
                    "usuario" && (
                    <div className="mensagem-avatar ia">
                      <Bot size={19} />
                    </div>
                  )}

                  <div
                    className={
                      `mensagem-balao ${item.autor}`
                    }
                  >
                    {item.texto
                      .split("\n")
                      .map(
                        (
                          linha,
                          index
                        ) => (
                          <p
                            key={
                              `${item.id}-${index}`
                            }
                          >
                            {linha ||
                              "\u00A0"}
                          </p>
                        )
                      )}
                  </div>

                  {item.autor ===
                    "usuario" && (
                    <div className="mensagem-avatar usuario">
                      <User size={19} />
                    </div>
                  )}
                </div>
              )
            )}


            {enviando && (
              <div className="mensagem-linha ia">
                <div className="mensagem-avatar ia">
                  <Bot size={19} />
                </div>

                <div className="mensagem-balao ia pensando">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={finalRef} />
          </div>


          {mensagens.length === 1 && (
            <div className="assistente-sugestoes">
              <span className="sugestoes-titulo">
                Experimente perguntar
              </span>

              <div className="sugestoes-grid">
                {SUGESTOES.map(
                  (sugestao) => (
                    <button
                      type="button"
                      key={sugestao}
                      onClick={() =>
                        enviarMensagem(
                          sugestao
                        )
                      }
                    >
                      {sugestao}
                    </button>
                  )
                )}
              </div>
            </div>
          )}


          <div className="assistente-input-area">
            <div className="assistente-input-box">
              <textarea
                value={mensagem}
                onChange={(event) =>
                  setMensagem(
                    event.target.value
                  )
                }
                onKeyDown={
                  aoPressionarTecla
                }
                placeholder="Pergunte sobre seu intercâmbio..."
                maxLength={4000}
                rows={1}
                disabled={enviando}
              />

              <button
                type="button"
                className="assistente-enviar"
                onClick={() =>
                  enviarMensagem()
                }
                disabled={
                  enviando ||
                  !mensagem.trim()
                }
                aria-label="Enviar mensagem"
              >
                <Send size={20} />
              </button>
            </div>

            <p className="assistente-aviso">
              A IA pode cometer erros.
              Confirme informações importantes
              em fontes oficiais.
            </p>
          </div>

        </section>
      </div>
    </main>
  );
}


export default AssistenteIA;