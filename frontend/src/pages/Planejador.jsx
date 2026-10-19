import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  LoaderCircle,
  PiggyBank,
  Plane,
  Save,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

import "../styles/Planejador.css";


export default function Planejador() {
  const { usuario } = useAuth();

  const [passport, setPassport] =
    useState(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] = useState("");
  const [falhaCarregamento, setFalhaCarregamento] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [salvo, setSalvo] =
    useState(false);

  const [formulario, setFormulario] =
    useState({
      destino: "",
      meta: "",
      guardado: "",
      mensal: "",
    });



  useEffect(() => {
    let ativo = true;
    async function carregar() {
      setCarregando(true);
      setErro("");
      setFalhaCarregamento(false);
      try {
        const [dadosPassport, dadosPlanejamento] = await Promise.allSettled([
          api.meuPassport(),
          api.meuPlanejamento(),
        ]);

        if (!ativo) return;
        if (dadosPlanejamento.status === "rejected") throw dadosPlanejamento.reason;
        const planejamento = dadosPlanejamento.value;
        const passaporte = dadosPassport.status === "fulfilled" ? dadosPassport.value : null;
        setPassport(passaporte);
        setFormulario({
          destino: planejamento.destino || [passaporte?.cidade, passaporte?.pais].filter(Boolean).join(", "),
          meta: planejamento.meta != null ? String(planejamento.meta) : (passaporte?.orcamento ? String(passaporte.orcamento) : ""),
          guardado: planejamento.guardado != null ? String(planejamento.guardado) : "",
          mensal: planejamento.mensal != null ? String(planejamento.mensal) : "",
        });
      } catch (erro) {
        if (ativo) { setErro(erro.message); setFalhaCarregamento(true); }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => { ativo = false; };
  }, [usuario?.id, tentativa]);


  function alterarCampo(event) {
    const {
      name,
      value,
    } = event.target;

    setFormulario(
      (anterior) => ({
        ...anterior,
        [name]: value,
      })
    );

    setSalvo(false);
  }


  async function salvar(event) {
    event.preventDefault();
    if (salvando || falhaCarregamento) return;
    setSalvo(false);
    setErro("");
    setSalvando(true);

    try {
      await api.atualizarPlanejamento({
        destino: formulario.destino.trim() || null,
        meta: Number(formulario.meta) || 0,
        guardado: Number(formulario.guardado) || 0,
        mensal: Number(formulario.mensal) || 0,
      });
      setSalvo(true);
    } catch (erro) {
      setErro(erro.message);
    } finally {
      setSalvando(false);
    }
  }


  const calculos = useMemo(
    () => {
      const meta =
        Number(formulario.meta) || 0;

      const guardado =
        Number(formulario.guardado) || 0;

      const mensal =
        Number(formulario.mensal) || 0;

      const falta =
        Math.max(
          meta - guardado,
          0
        );

      const progresso =
        meta > 0
          ? Math.min(
              Math.round(
                (guardado / meta) *
                  100
              ),
              100
            )
          : 0;

      const meses =
        falta > 0 &&
        mensal > 0
          ? Math.ceil(
              falta / mensal
            )
          : 0;

      let previsao = "";

      if (
        meses > 0 &&
        meta > 0
      ) {
        const data =
          new Date();

        data.setDate(1);
        data.setMonth(
          data.getMonth() +
            meses
        );

        previsao =
          data.toLocaleDateString(
            "pt-BR",
            {
              month: "long",
              year: "numeric",
            }
          );
      }

      return {
        meta,
        guardado,
        mensal,
        falta,
        progresso,
        meses,
        previsao,
      };
    },
    [formulario]
  );


  function dinheiro(valor) {
    return Number(
      valor || 0
    ).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }


  if (carregando) {
    return (
      <main className="planner-loading">
        <LoaderCircle
          className="planner-spinner"
          size={36}
        />

        <p>
          Preparando seu
          planejamento...
        </p>
      </main>
    );
  }


  return (
    <main className="planner-page">
      <header className="planner-topbar">
        <Link
          to="/perfil"
          className="planner-back"
        >
          <ArrowLeft size={18} />

          Meu perfil
        </Link>

        <Link
          to="/"
          className="planner-logo"
        >
          Inter
          <span>Way</span>
        </Link>
      </header>


      <div className="planner-wrapper">
        {erro && <div role="alert"><p>{erro}</p>{falhaCarregamento && <button type="button" onClick={() => setTentativa(v => v + 1)}>Tentar carregar novamente</button>}</div>}
        <section className="planner-heading">
          <div>
            <span className="planner-eyebrow">
              PLANEJAMENTO
              FINANCEIRO
            </span>

            <h1>
              Transforme o plano
              em uma{" "}
              <span>
                data de partida.
              </span>
            </h1>

            <p>
              Organize sua meta,
              acompanhe quanto já
              juntou e descubra quanto
              tempo falta para alcançar
              seu objetivo.
            </p>
          </div>

          <div className="planner-heading-icon">
            <Plane size={31} />
          </div>
        </section>


        {passport?.pais && (
          <div className="planner-passport-info">
            <CheckCircle2
              size={19}
            />

            <span>
              Seu Passport está
              planejando{" "}
              <strong>
                {passport.cidade
                  ? `${passport.cidade}, `
                  : ""}
                {passport.pais}
              </strong>.
              Usamos essas informações
              como ponto de partida.
            </span>
          </div>
        )}


        <section className="planner-progress-card">
          <div className="planner-progress-header">
            <div>
              <span>
                PROGRESSO DA META
              </span>

              <strong>
                {calculos.progresso}%
              </strong>
            </div>

            <div className="planner-progress-money">
              <strong>
                {dinheiro(
                  calculos.guardado
                )}
              </strong>

              <span>
                de{" "}
                {dinheiro(
                  calculos.meta
                )}
              </span>
            </div>
          </div>

          <div className="planner-progress">
            <div
              className="planner-progress-fill"
              style={{
                width:
                  `${calculos.progresso}%`,
              }}
            />
          </div>
        </section>


        <div className="planner-grid">
          <form
            className="planner-form-card"
            onSubmit={salvar}
          >
            <div className="planner-card-heading">
              <div>
                <span>
                  SUA META
                </span>

                <h2>
                  Planeje sua viagem
                </h2>
              </div>

              <Target size={23} />
            </div>


            <label>
              Destino

              <div className="planner-input">
                <Plane size={18} />

                <input
                  type="text"
                  name="destino"
                  value={
                    formulario.destino
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="Ex: Dublin, Irlanda"
                />
              </div>
            </label>


            <label>
              Custo estimado da viagem

              <div className="planner-input">
                <Target size={18} />

                <span>R$</span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="meta"
                  value={
                    formulario.meta
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="20000"
                />
              </div>
            </label>


            <label>
              Quanto você já possui?

              <div className="planner-input">
                <Wallet size={18} />

                <span>R$</span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="guardado"
                  value={
                    formulario.guardado
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="5000"
                />
              </div>
            </label>


            <label>
              Quanto consegue guardar
              por mês?

              <div className="planner-input">
                <PiggyBank
                  size={18}
                />

                <span>R$</span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="mensal"
                  value={
                    formulario.mensal
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="1000"
                />
              </div>
            </label>


            <button
              type="submit"
              className="planner-save"
              disabled={salvando || falhaCarregamento}
            >
              <Save size={18} />

              {salvando ? "Salvando..." : "Salvar planejamento"}
            </button>

            {salvo && (
              <div className="planner-saved">
                <CheckCircle2
                  size={17}
                />

                Planejamento salvo.
              </div>
            )}
          </form>


          <section className="planner-results">
            <div className="planner-result-card">
              <div className="planner-result-icon">
                <CircleDollarSign
                  size={23}
                />
              </div>

              <div>
                <span>
                  Ainda falta
                </span>

                <strong>
                  {dinheiro(
                    calculos.falta
                  )}
                </strong>
              </div>
            </div>


            <div className="planner-result-card">
              <div className="planner-result-icon">
                <CalendarDays
                  size={23}
                />
              </div>

              <div>
                <span>
                  Tempo estimado
                </span>

                <strong>
                  {calculos.falta ===
                  0 &&
                  calculos.meta > 0
                    ? "Meta alcançada!"
                    : calculos.meses > 0
                    ? `${calculos.meses} ${
                        calculos.meses ===
                        1
                          ? "mês"
                          : "meses"
                      }`
                    : "Preencha os valores"}
                </strong>
              </div>
            </div>


            <div className="planner-result-card planner-result-highlight">
              <div className="planner-result-icon">
                <TrendingUp
                  size={23}
                />
              </div>

              <div>
                <span>
                  Previsão da meta
                </span>

                <strong>
                  {calculos.falta ===
                  0 &&
                  calculos.meta > 0
                    ? "Você já chegou lá 🎉"
                    : calculos.previsao ||
                      "Ainda sem previsão"}
                </strong>
              </div>
            </div>


            <div className="planner-tip">
              <PiggyBank
                size={24}
              />

              <div>
                <strong>
                  Dica InterWay
                </strong>

                <p>
                  Quanto maior o valor
                  mensal reservado,
                  menor será o tempo
                  necessário para atingir
                  sua meta.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}