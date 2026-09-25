import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  Circle,
  Globe2,
  Languages,
  LoaderCircle,
  MapPin,
  Plane,
  Save,
  Target,
  Wallet,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  api,
} from "../services/api";

import "../styles/Passport.css";


export default function Passport() {
  const {
    usuario,
  } = useAuth();

  const [
    passport,
    setPassport,
  ] = useState(null);

  const [
    formulario,
    setFormulario,
  ] = useState({
    pais: "",
    cidade: "",
    objetivo: "",
    nivel_idioma: "",
    orcamento: "",
  });

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    salvando,
    setSalvando,
  ] = useState(false);

  const [
    mensagem,
    setMensagem,
  ] = useState("");

  const [
    erro,
    setErro,
  ] = useState("");


  useEffect(() => {
    carregarPassport();
  }, []);


  async function carregarPassport() {
    setCarregando(true);
    setErro("");

    try {
      const dados =
        await api.meuPassport();

      setPassport(dados);

      setFormulario({
        pais:
          dados.pais || "",
        cidade:
          dados.cidade || "",
        objetivo:
          dados.objetivo || "",
        nivel_idioma:
          dados.nivel_idioma ||
          "",
        orcamento:
          dados.orcamento || "",
      });
    } catch (error) {
      setErro(
        error.message
      );
    } finally {
      setCarregando(false);
    }
  }


  function alterarCampo(
    event
  ) {
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
  }


  async function salvarPassport(
    event
  ) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");
    setErro("");

    try {
      const dados =
        await api.atualizarPassport(
          {
            pais:
              formulario.pais,
            cidade:
              formulario.cidade,
            objetivo:
              formulario.objetivo,
            nivel_idioma:
              formulario.nivel_idioma,
            orcamento:
              formulario.orcamento
                ? Number(
                    formulario.orcamento
                  )
                : null,
          }
        );

      setPassport(dados);

      setMensagem(
        "Passport atualizado!"
      );
    } catch (error) {
      setErro(
        error.message
      );
    } finally {
      setSalvando(false);
    }
  }


  async function alternarItem(
    item
  ) {
    try {
      const dados =
        await api.atualizarChecklist(
          item.id,
          !item.concluido
        );

      setPassport(dados);
    } catch (error) {
      setErro(
        error.message
      );
    }
  }


  if (carregando) {
    return (
      <main className="passport-loading">
        <LoaderCircle
          size={36}
          className="passport-spinner"
        />

        <p>
          Preparando seu
          InterWay Passport...
        </p>
      </main>
    );
  }


  if (!passport) {
    return (
      <main className="passport-loading">
        <p>
          Não foi possível
          carregar seu Passport.
        </p>

        {erro && (
          <span>
            {erro}
          </span>
        )}
      </main>
    );
  }


  return (
    <main className="passport-page">
      <div className="passport-top">
        <Link
          to="/perfil"
          className="passport-back"
        >
          <ArrowLeft
            size={18}
          />

          Voltar ao perfil
        </Link>

        <Link
          to="/"
          className="passport-brand"
        >
          Inter
          <span>
            Way
          </span>
        </Link>
      </div>


      <section className="passport-container">
        <header className="passport-heading">
          <div>
            <span className="passport-eyebrow">
              SUA JORNADA
            </span>

            <h1>
              InterWay
              <span>
                {" "}Passport
              </span>
            </h1>

            <p>
              Organize sua preparação
              para o intercâmbio em
              um só lugar.
            </p>
          </div>

          <div className="passport-progress-summary">
            <strong>
              {passport.progresso}%
            </strong>

            <span>
              da jornada concluída
            </span>
          </div>
        </header>


        <div className="passport-progress">
          <div
            className="passport-progress-bar"
            style={{
              width:
                `${passport.progresso}%`,
            }}
          />
        </div>


        <div className="passport-layout">
          <section className="passport-card passport-main-card">
            <div className="passport-card-top">
              <div className="passport-symbol">
                <Plane
                  size={27}
                />
              </div>

              <div>
                <span>
                  INTERWAY PASSPORT
                </span>

                <h2>
                  {usuario?.nome ||
                    "Viajante"}
                </h2>
              </div>
            </div>


            <div className="passport-destination">
              <Globe2
                size={38}
              />

              <div>
                <span>
                  DESTINO
                </span>

                <strong>
                  {passport.pais
                    ? `${
                        passport.pais
                      }${
                        passport.cidade
                          ? ` • ${passport.cidade}`
                          : ""
                      }`
                    : "Ainda não definido"}
                </strong>
              </div>
            </div>


            <div className="passport-details">
              <div>
                <Target
                  size={19}
                />

                <span>
                  Objetivo
                </span>

                <strong>
                  {passport.objetivo ||
                    "Não definido"}
                </strong>
              </div>

              <div>
                <Languages
                  size={19}
                />

                <span>
                  Idioma
                </span>

                <strong>
                  {passport.nivel_idioma ||
                    "Não definido"}
                </strong>
              </div>

              <div>
                <Wallet
                  size={19}
                />

                <span>
                  Orçamento
                </span>

                <strong>
                  {passport.orcamento
                    ? Number(
                        passport.orcamento
                      ).toLocaleString(
                        "pt-BR",
                        {
                          style:
                            "currency",
                          currency:
                            "BRL",
                        }
                      )
                    : "Não definido"}
                </strong>
              </div>
            </div>
          </section>


          <section className="passport-card">
            <div className="passport-section-title">
              <div>
                <span>
                  PREPARAÇÃO
                </span>

                <h2>
                  Checklist
                </h2>
              </div>

              <strong>
                {passport.progresso}%
              </strong>
            </div>


            <div className="passport-checklist">
              {passport.checklist.map(
                (item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={
                      item.concluido
                        ? "checklist-item concluido"
                        : "checklist-item"
                    }
                    onClick={() =>
                      alternarItem(
                        item
                      )
                    }
                  >
                    <div className="checklist-icon">
                      {item.concluido ? (
                        <Check
                          size={17}
                        />
                      ) : (
                        <Circle
                          size={17}
                        />
                      )}
                    </div>

                    <span>
                      {item.titulo}
                    </span>
                  </button>
                )
              )}
            </div>
          </section>
        </div>


        <section className="passport-card passport-form-card">
          <div className="passport-section-title">
            <div>
              <span>
                PLANEJAMENTO
              </span>

              <h2>
                Dados da viagem
              </h2>
            </div>
          </div>


          <form
            className="passport-form"
            onSubmit={
              salvarPassport
            }
          >
            <label>
              País

              <div className="passport-input">
                <Globe2
                  size={18}
                />

                <input
                  name="pais"
                  value={
                    formulario.pais
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="Ex: Irlanda"
                />
              </div>
            </label>


            <label>
              Cidade

              <div className="passport-input">
                <MapPin
                  size={18}
                />

                <input
                  name="cidade"
                  value={
                    formulario.cidade
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="Ex: Dublin"
                />
              </div>
            </label>


            <label>
              Objetivo

              <div className="passport-input">
                <Target
                  size={18}
                />

                <select
                  name="objetivo"
                  value={
                    formulario.objetivo
                  }
                  onChange={
                    alterarCampo
                  }
                >
                  <option value="">
                    Selecione
                  </option>

                  <option value="Aprender idioma">
                    Aprender idioma
                  </option>

                  <option value="Estudar">
                    Estudar
                  </option>

                  <option value="Estudo + Trabalho">
                    Estudo + Trabalho
                  </option>

                  <option value="Faculdade">
                    Faculdade
                  </option>

                  <option value="Experiência cultural">
                    Experiência cultural
                  </option>
                </select>
              </div>
            </label>


            <label>
              Nível do idioma

              <div className="passport-input">
                <Languages
                  size={18}
                />

                <select
                  name="nivel_idioma"
                  value={
                    formulario.nivel_idioma
                  }
                  onChange={
                    alterarCampo
                  }
                >
                  <option value="">
                    Selecione
                  </option>

                  <option value="Iniciante">
                    Iniciante
                  </option>

                  <option value="Básico">
                    Básico
                  </option>

                  <option value="Intermediário">
                    Intermediário
                  </option>

                  <option value="Avançado">
                    Avançado
                  </option>

                  <option value="Fluente">
                    Fluente
                  </option>
                </select>
              </div>
            </label>


            <label className="passport-budget">
              Orçamento disponível

              <div className="passport-input">
                <Wallet
                  size={18}
                />

                <input
                  type="number"
                  min="0"
                  name="orcamento"
                  value={
                    formulario.orcamento
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="Ex: 20000"
                />
              </div>
            </label>


            <div className="passport-form-footer">
              <div>
                {mensagem && (
                  <span className="passport-success">
                    {mensagem}
                  </span>
                )}

                {erro && (
                  <span className="passport-error">
                    {erro}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  salvando
                }
              >
                <Save
                  size={18}
                />

                {salvando
                  ? "Salvando..."
                  : "Salvar Passport"}
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}