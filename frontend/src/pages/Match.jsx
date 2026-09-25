import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  Check,
  Clock3,
  Globe2,
  GraduationCap,
  Languages,
  MapPin,
  RotateCcw,
  Sparkles,
  SunMedium,
} from "lucide-react";

import { destinos } from "../data/destinos";

import "../styles/Match.css";

const perguntas = [
  {
    id: "objetivo",
    titulo: "Qual é o seu principal objetivo?",
    descricao:
      "Isso ajuda o InterWay a entender qual tipo de experiência faz mais sentido para você.",
    opcoes: [
      {
        valor: "idioma",
        titulo: "Aprender um idioma",
        descricao: "Quero melhorar minha fluência.",
        icone: Languages,
      },
      {
        valor: "faculdade",
        titulo: "Estudar em uma faculdade",
        descricao: "Quero uma experiência acadêmica.",
        icone: GraduationCap,
      },
      {
        valor: "trabalho",
        titulo: "Estudar e trabalhar",
        descricao: "Quero experiência profissional.",
        icone: BriefcaseBusiness,
      },
      {
        valor: "experiencia",
        titulo: "Viver uma experiência",
        descricao: "Quero conhecer outra cultura.",
        icone: Globe2,
      },
    ],
  },

  {
    id: "idioma",
    titulo: "Qual idioma você quer desenvolver?",
    descricao:
      "Vamos priorizar destinos onde esse idioma faz parte da experiência.",
    opcoes: [
      {
        valor: "ingles",
        titulo: "Inglês",
        descricao: "Quero desenvolver meu inglês.",
        emoji: "🇬🇧",
      },
      {
        valor: "frances",
        titulo: "Francês",
        descricao: "Quero desenvolver meu francês.",
        emoji: "🇫🇷",
      },
    ],
  },

  {
    id: "orcamento",
    titulo: "Quanto você pretende investir?",
    descricao:
      "Não precisa ser um valor exato. Escolha a faixa mais próxima da sua realidade.",
    opcoes: [
      {
        valor: 1,
        titulo: "Até R$ 10 mil",
        descricao: "Quero priorizar economia.",
        icone: Banknote,
      },
      {
        valor: 2,
        titulo: "R$ 10 mil a R$ 20 mil",
        descricao: "Tenho um orçamento intermediário.",
        icone: Banknote,
      },
      {
        valor: 3,
        titulo: "R$ 20 mil a R$ 40 mil",
        descricao: "Posso investir mais na experiência.",
        icone: Banknote,
      },
      {
        valor: 4,
        titulo: "Acima de R$ 40 mil",
        descricao: "Busco mais liberdade de escolha.",
        icone: Banknote,
      },
    ],
  },

  {
    id: "duracao",
    titulo: "Por quanto tempo você quer ficar?",
    descricao:
      "A duração influencia bastante o tipo de programa ideal.",
    opcoes: [
      {
        valor: "1-mes",
        titulo: "Até 1 mês",
        descricao: "Experiência curta.",
        icone: Clock3,
      },
      {
        valor: "3-meses",
        titulo: "Até 3 meses",
        descricao: "Tempo para mergulhar na cultura.",
        icone: Clock3,
      },
      {
        valor: "6-meses",
        titulo: "Até 6 meses",
        descricao: "Uma experiência completa.",
        icone: Clock3,
      },
      {
        valor: "1-ano",
        titulo: "Até 1 ano",
        descricao: "Quero realmente viver fora.",
        icone: Clock3,
      },
      {
        valor: "mais-1-ano",
        titulo: "Mais de 1 ano",
        descricao: "Estou pensando no longo prazo.",
        icone: Clock3,
      },
    ],
  },

  {
    id: "clima",
    titulo: "Qual clima combina mais com você?",
    descricao:
      "Não decide tudo, mas pode mudar completamente sua experiência.",
    opcoes: [
      {
        valor: "frio",
        titulo: "Prefiro frio",
        descricao: "Casaco, inverno e temperaturas baixas.",
        emoji: "❄️",
      },
      {
        valor: "moderado",
        titulo: "Clima moderado",
        descricao: "Nem muito quente, nem muito frio.",
        emoji: "🌤️",
      },
      {
        valor: "quente",
        titulo: "Prefiro calor",
        descricao: "Sol, praia e temperaturas altas.",
        icone: SunMedium,
      },
    ],
  },

  {
    id: "trabalho",
    titulo: "Você pretende trabalhar durante o intercâmbio?",
    descricao:
      "Isso pode mudar bastante quais destinos fazem mais sentido.",
    opcoes: [
      {
        valor: true,
        titulo: "Sim",
        descricao: "Quero estudar e também trabalhar.",
        icone: BriefcaseBusiness,
      },
      {
        valor: false,
        titulo: "Não",
        descricao: "Meu foco será apenas estudar e viver a experiência.",
        icone: GraduationCap,
      },
    ],
  },
];

function calcularMatch(destino, respostas) {
  let pontos = 0;
  let maximo = 0;

  maximo += 30;

  if (destino.match.objetivos.includes(respostas.objetivo)) {
    pontos += 30;
  }

  maximo += 20;

  if (destino.match.idiomas.includes(respostas.idioma)) {
    pontos += 20;
  }

  maximo += 20;

  const diferencaOrcamento = Math.abs(
    destino.match.orcamento - respostas.orcamento
  );

  if (diferencaOrcamento === 0) {
    pontos += 20;
  } else if (diferencaOrcamento === 1) {
    pontos += 14;
  } else if (diferencaOrcamento === 2) {
    pontos += 7;
  }

  maximo += 10;

  if (destino.match.duracoes.includes(respostas.duracao)) {
    pontos += 10;
  }

  maximo += 10;

  if (destino.match.clima.includes(respostas.clima)) {
    pontos += 10;
  }

  maximo += 10;

  if (destino.match.trabalho === respostas.trabalho) {
    pontos += 10;
  }

  return Math.round((pontos / maximo) * 100);
}

function Match() {
  const [etapa, setEtapa] = useState(0);

  const [respostas, setRespostas] = useState({});

  const [finalizado, setFinalizado] = useState(false);

  const perguntaAtual = perguntas[etapa];

  const respostaAtual = respostas[perguntaAtual?.id];

  const progresso = finalizado
    ? 100
    : ((etapa + 1) / perguntas.length) * 100;

  const resultados = useMemo(() => {
    if (!finalizado) {
      return [];
    }

    return destinos
      .map((destino) => ({
        ...destino,
        compatibilidade: calcularMatch(destino, respostas),
      }))
      .sort(
        (a, b) =>
          b.compatibilidade - a.compatibilidade
      );
  }, [finalizado, respostas]);

  function escolherResposta(valor) {
    setRespostas((anteriores) => ({
      ...anteriores,
      [perguntaAtual.id]: valor,
    }));
  }

  function avancar() {
    if (respostaAtual === undefined) {
      return;
    }

    if (etapa === perguntas.length - 1) {
      setFinalizado(true);
      return;
    }

    setEtapa((valor) => valor + 1);
  }

  function voltar() {
    if (etapa > 0) {
      setEtapa((valor) => valor - 1);
    }
  }

  function reiniciar() {
    setEtapa(0);
    setRespostas({});
    setFinalizado(false);
  }

  if (finalizado) {
    const principal = resultados[0];

    return (
      <main className="match-page result-page">
        <div className="match-topbar">
          <Link to="/">
            <ArrowLeft size={18} />
            InterWay
          </Link>

          <span>INTERWAY MATCH</span>
        </div>

        <motion.section
          className="result-container"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <div className="result-heading">
            <div className="result-spark">
              <Sparkles size={19} />
            </div>

            <span>Encontramos seu destino</span>

            <h1>
              Seu melhor match é
              <strong>
                {" "}
                {principal.pais}.
              </strong>
            </h1>

            <p>
              Cruzamos suas preferências com os
              destinos disponíveis no InterWay.
            </p>
          </div>

          <div className="winner-card">
            <div
              className="winner-image"
              style={{
                backgroundImage: `
                  linear-gradient(
                    to top,
                    rgba(3, 12, 28, 0.96),
                    rgba(3, 12, 28, 0.05)
                  ),
                  url(${principal.imagem})
                `,
              }}
            >
              <span className="winner-badge">
                Melhor escolha
              </span>

              <div className="winner-info">
                <span className="winner-flag">
                  {principal.bandeira}
                </span>

                <div>
                  <p>
                    <MapPin size={15} />
                    {principal.cidade}
                  </p>

                  <h2>{principal.pais}</h2>
                </div>
              </div>
            </div>

            <div className="winner-content">
              <div className="score-circle">
                <strong>
                  {principal.compatibilidade}%
                </strong>

                <span>compatível</span>
              </div>

              <div className="winner-copy">
                <span className="result-label">
                  POR QUE COMBINA COM VOCÊ?
                </span>

                <h3>
                  Uma experiência alinhada ao seu
                  perfil.
                </h3>

                <p>{principal.descricao}</p>

                <div className="winner-benefits">
                  {principal.beneficios
                    .slice(0, 3)
                    .map((beneficio) => (
                      <div key={beneficio}>
                        <Check size={16} />
                        {beneficio}
                      </div>
                    ))}
                </div>

                <Link
                  to={`/destinos/${principal.slug}`}
                  className="winner-button"
                >
                  Conhecer {principal.pais}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          <div className="ranking-section">
            <div className="ranking-heading">
              <div>
                <span className="result-label">
                  OUTRAS POSSIBILIDADES
                </span>

                <h2>
                  Seu ranking InterWay
                </h2>
              </div>

              <button onClick={reiniciar}>
                <RotateCcw size={17} />
                Refazer teste
              </button>
            </div>

            <div className="ranking-grid">
              {resultados
                .slice(1)
                .map((destino, index) => (
                  <Link
                    to={`/destinos/${destino.slug}`}
                    className="ranking-card"
                    key={destino.slug}
                  >
                    <div className="ranking-position">
                      #{index + 2}
                    </div>

                    <img
                      src={destino.imagem}
                      alt={destino.pais}
                    />

                    <div className="ranking-card-content">
                      <span className="ranking-flag">
                        {destino.bandeira}
                      </span>

                      <div>
                        <h3>{destino.pais}</h3>

                        <p>{destino.cidade}</p>
                      </div>

                      <strong>
                        {destino.compatibilidade}%
                      </strong>
                    </div>

                    <div className="ranking-progress">
                      <div
                        style={{
                          width: `${destino.compatibilidade}%`,
                        }}
                      />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="match-page">
      <div className="match-topbar">
        <Link to="/">
          <ArrowLeft size={18} />
          Sair
        </Link>

        <span>INTERWAY MATCH</span>
      </div>

      <div className="match-progress-area">
        <div className="match-progress-info">
          <span>
            Etapa {etapa + 1} de {perguntas.length}
          </span>

          <strong>
            {Math.round(progresso)}%
          </strong>
        </div>

        <div className="match-progress-bar">
          <motion.div
            animate={{
              width: `${progresso}%`,
            }}
          />
        </div>
      </div>

      <section className="match-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={etapa}
            className="question-container"
            initial={{
              opacity: 0,
              x: 35,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -35,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <div className="question-number">
              0{etapa + 1}
            </div>

            <h1>
              {perguntaAtual.titulo}
            </h1>

            <p>
              {perguntaAtual.descricao}
            </p>

            <div className="match-options">
              {perguntaAtual.opcoes.map(
                (opcao) => {
                  const Icone = opcao.icone;

                  const selecionado =
                    respostaAtual === opcao.valor;

                  return (
                    <button
                      key={String(opcao.valor)}
                      type="button"
                      className={
                        selecionado
                          ? "match-option selected"
                          : "match-option"
                      }
                      onClick={() =>
                        escolherResposta(
                          opcao.valor
                        )
                      }
                    >
                      <div className="option-icon">
                        {Icone ? (
                          <Icone size={24} />
                        ) : (
                          <span>
                            {opcao.emoji}
                          </span>
                        )}
                      </div>

                      <div className="option-text">
                        <strong>
                          {opcao.titulo}
                        </strong>

                        <span>
                          {opcao.descricao}
                        </span>
                      </div>

                      <div className="option-check">
                        {selecionado && (
                          <Check size={16} />
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <footer className="match-footer">
        <button
          className="match-back"
          onClick={voltar}
          disabled={etapa === 0}
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <button
          className="match-next"
          onClick={avancar}
          disabled={
            respostaAtual === undefined
          }
        >
          {etapa === perguntas.length - 1
            ? "Ver meu resultado"
            : "Continuar"}

          <ArrowRight size={18} />
        </button>
      </footer>
    </main>
  );
}

export default Match;