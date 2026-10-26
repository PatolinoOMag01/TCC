import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Globe2,
  Send,
  Sparkles,
  User,
  Trash2,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  api,
} from "../services/api";
import RespostaFormatada from "../components/RespostaFormatada";

import "../styles/AssistenteIA.css";


const SUGESTOES = [
  "Quais são os melhores destinos para intercâmbio?",
  "Como conseguir uma bolsa de estudos?",
  "Quanto dinheiro preciso para um intercâmbio?",
  "Quais documentos preciso preparar?",
];


function AssistenteIA() {
  const navigate = useNavigate();
  const location = useLocation();
  const voltar = () => location.key === "default" ? navigate("/") : navigate(-1);
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
  const operacaoRef = useRef(false);
  const [carregandoHistorico, setCarregandoHistorico] = useState(true);
  const [erroHistorico, setErroHistorico] = useState("");

  useEffect(() => {
    finalRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [mensagens, enviando]);

  useEffect(() => {
    let ativo = true;
    async function carregarHistorico() {
      if (!localStorage.getItem("interway-token")) { setCarregandoHistorico(false); return; }
      try {
        const itens = await api.historicoIA();
        if (ativo && itens.length) {
          setMensagens(itens.map((item) => ({
            id: item.id,
            autor: item.role === "user" ? "usuario" : "ia",
            texto: item.content,
          })));
        }
      } catch (erro) {
        if (ativo) setErroHistorico(erro.message);
      } finally {
        if (ativo) setCarregandoHistorico(false);
      }
    }
    carregarHistorico();
    return () => { ativo = false; };
  }, []);

  async function limparHistorico() {
    if (operacaoRef.current || carregandoHistorico) return;
    operacaoRef.current = true;
    setEnviando(true);
    setErroHistorico("");
    if (!localStorage.getItem("interway-token")) {
      setMensagens([]);
      operacaoRef.current = false;
      setEnviando(false);
      return;
    }
    try {
      await api.limparHistoricoIA();
      setMensagens([]);
    } catch (erro) {
      setErroHistorico(erro.message);
    } finally {
      operacaoRef.current = false;
      setEnviando(false);
    }
  }


  async function enviarMensagem(
    textoPersonalizado
  ) {
    const texto = (
      textoPersonalizado ||
      mensagem
    ).trim();

    if (!texto || operacaoRef.current || carregandoHistorico) {
      return;
    }

    operacaoRef.current = true;
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
      operacaoRef.current = false;
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
            <button
              type="button"
              className="assistente-voltar"
              aria-label="Voltar"
              title="Voltar para a página anterior"
              onClick={voltar}
            >
              <ArrowLeft size={21} />
            </button>

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

          <div className="assistente-header-actions" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link to="/" className="assistente-inicio">Voltar para início <ArrowRight size={16} /></Link>
            <button type="button" onClick={limparHistorico} disabled={enviando || carregandoHistorico} title="Limpar conversa" aria-label="Limpar conversa" style={{ border: 0, background: "transparent", cursor: "pointer" }}>
              <Trash2 size={19} />
            </button>
            <div className="assistente-online">
              <span />
              Online
            </div>
          </div>
        </header>


        <section className="assistente-chat">
          {carregandoHistorico && <p role="status">Carregando conversa...</p>}
          {erroHistorico && <p role="alert">{erroHistorico}</p>}

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
                    {item.autor === "ia" ? (
                      <RespostaFormatada texto={item.texto} />
                    ) : (
                      item.texto.split("\n").map((linha, index) => (
                        <p key={`${item.id}-${index}`}>{linha || "\u00A0"}</p>
                      ))
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


          {mensagens.length <= 1 && !carregandoHistorico && (
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
                disabled={enviando || carregandoHistorico}
              />

              <button
                type="button"
                className="assistente-enviar"
                onClick={() =>
                  enviarMensagem()
                }
                disabled={
                  enviando || carregandoHistorico ||
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
