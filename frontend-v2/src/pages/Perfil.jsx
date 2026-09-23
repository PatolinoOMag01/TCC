import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Compass,
  FileCheck2,
  GraduationCap,
  Heart,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  PiggyBank,
  Sparkles,
  User,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useFavorites,
} from "../context/FavoritesContext";

import {
  api,
} from "../services/api";

import "../styles/Auth.css";


export default function Perfil() {
  const navigate =
    useNavigate();

  const {
    usuario,
    sair,
  } = useAuth();

  const {
    favoritos,
    total,
  } = useFavorites();

  const [
    passport,
    setPassport,
  ] = useState(null);

  const [
    financeiro,
    setFinanceiro,
  ] = useState(null);


  useEffect(() => {
    async function carregarDashboard() {
      try {
        const dados =
          await api.meuPassport();

        setPassport(dados);
      } catch {
        setPassport(null);
      }

      if (usuario?.id) {
        const salvo =
          localStorage.getItem(
            `interway-planejador-${usuario.id}`
          );

        if (salvo) {
          try {
            setFinanceiro(
              JSON.parse(salvo)
            );
          } catch {
            setFinanceiro(null);
          }
        }
      }
    }

    carregarDashboard();
  }, [usuario?.id]);


  function handleSair() {
    sair();

    navigate(
      "/",
      {
        replace: true,
      }
    );
  }


  function pegarIniciais(
    nome = ""
  ) {
    return nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (parte) =>
          parte
            .charAt(0)
            .toUpperCase()
      )
      .join("");
  }


  function progressoFinanceiro() {
    const meta =
      Number(
        financeiro?.meta
      ) || 0;

    const guardado =
      Number(
        financeiro?.guardado
      ) || 0;

    if (!meta) {
      return 0;
    }

    return Math.min(
      Math.round(
        (guardado / meta) *
          100
      ),
      100
    );
  }


  return (
    <main className="profile-page">
      <div className="profile-glow profile-glow-one" />
      <div className="profile-glow profile-glow-two" />

      <div className="profile-wrapper">
        <header className="profile-topbar">
          <Link
            to="/"
            className="profile-back"
          >
            <ArrowLeft size={18} />

            Voltar
          </Link>

          <Link
            to="/"
            className="profile-logo"
          >
            InterWay
          </Link>
        </header>


        <section className="profile-hero">
          <div>
            <span className="profile-eyebrow">
              SEU DASHBOARD
            </span>

            <h1>
              Olá,{" "}
              <span>
                {
                  usuario?.nome
                    ?.split(" ")[0]
                }
              </span>
              .
            </h1>

            <p>
              Acompanhe sua jornada
              de intercâmbio em um
              só lugar.
            </p>
          </div>

          <div className="profile-avatar-large">
            {pegarIniciais(
              usuario?.nome
            )}
          </div>
        </section>


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <Link
            to="/passport"
            style={{
              background:
                "rgba(255,255,255,0.88)",
              borderRadius: 18,
              padding: "18px 16px",
              textAlign: "center",
              textDecoration: "none",
              boxShadow:
                "0 8px 24px rgba(24,55,90,0.06)",
            }}
          >
            <FileCheck2
              size={22}
              color="#3b82f6"
            />

            <strong
              style={{
                display: "block",
                fontSize: 22,
                color: "#0b1f33",
                marginTop: 6,
              }}
            >
              {passport?.progresso ||
                0}%
            </strong>

            <span
              style={{
                fontSize: 13,
                color: "#607084",
              }}
            >
              Passport
            </span>
          </Link>


          <Link
            to="/planejador"
            style={{
              background:
                "rgba(255,255,255,0.88)",
              borderRadius: 18,
              padding: "18px 16px",
              textAlign: "center",
              textDecoration: "none",
              boxShadow:
                "0 8px 24px rgba(24,55,90,0.06)",
            }}
          >
            <PiggyBank
              size={22}
              color="#10b981"
            />

            <strong
              style={{
                display: "block",
                fontSize: 22,
                color: "#0b1f33",
                marginTop: 6,
              }}
            >
              {progressoFinanceiro()}%
            </strong>

            <span
              style={{
                fontSize: 13,
                color: "#607084",
              }}
            >
              Meta financeira
            </span>
          </Link>


          <div
            style={{
              background:
                "rgba(255,255,255,0.88)",
              borderRadius: 18,
              padding: "18px 16px",
              textAlign: "center",
              boxShadow:
                "0 8px 24px rgba(24,55,90,0.06)",
            }}
          >
            <Heart
              size={22}
              color="#ef4444"
              fill="#ef4444"
            />

            <strong
              style={{
                display: "block",
                fontSize: 22,
                color: "#0b1f33",
                marginTop: 6,
              }}
            >
              {total}
            </strong>

            <span
              style={{
                fontSize: 13,
                color: "#607084",
              }}
            >
              Favoritos
            </span>
          </div>


          <Link
            to="/match"
            style={{
              background:
                "rgba(255,255,255,0.88)",
              borderRadius: 18,
              padding: "18px 16px",
              textAlign: "center",
              textDecoration: "none",
              boxShadow:
                "0 8px 24px rgba(24,55,90,0.06)",
            }}
          >
            <Compass
              size={22}
              color="#8b5cf6"
            />

            <strong
              style={{
                display: "block",
                fontSize: 15,
                color: "#0b1f33",
                marginTop: 8,
              }}
            >
              Match
            </strong>

            <span
              style={{
                fontSize: 13,
                color: "#607084",
              }}
            >
              Encontrar destino
            </span>
          </Link>
        </div>


        <div className="profile-grid">
          <section className="profile-main-card">
            <div className="profile-card-title">
              <div>
                <span>
                  Minha conta
                </span>

                <h2>
                  Informações pessoais
                </h2>
              </div>

              <User size={22} />
            </div>


            <div className="profile-details">
              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <User size={19} />
                </div>

                <div>
                  <span>
                    Nome
                  </span>

                  <strong>
                    {usuario?.nome}
                  </strong>
                </div>
              </div>


              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <Mail size={19} />
                </div>

                <div>
                  <span>
                    E-mail
                  </span>

                  <strong>
                    {usuario?.email}
                  </strong>
                </div>
              </div>


              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <Sparkles
                    size={19}
                  />
                </div>

                <div>
                  <span>
                    Conta InterWay
                  </span>

                  <strong>
                    #{usuario?.id}
                  </strong>
                </div>
              </div>
            </div>


            <div
              style={{
                marginTop: 28,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  marginBottom: 14,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 17,
                    color: "#0b1f33",
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 8,
                  }}
                >
                  <Heart
                    size={18}
                    color="#ef4444"
                  />

                  Meus favoritos
                </h3>

                {total > 0 && (
                  <Link
                    to="/favoritos"
                    style={{
                      fontSize: 13,
                      color:
                        "#3b82f6",
                      fontWeight: 600,
                      textDecoration:
                        "none",
                    }}
                  >
                    Ver todos →
                  </Link>
                )}
              </div>


              {total === 0 ? (
                <div
                  style={{
                    background:
                      "#f8fafc",
                    borderRadius: 16,
                    padding:
                      "24px 18px",
                    textAlign:
                      "center",
                    color:
                      "#607084",
                    fontSize: 14,
                  }}
                >
                  <p
                    style={{
                      margin:
                        "0 0 12px",
                    }}
                  >
                    Você ainda não
                    salvou nenhum
                    destino.
                  </p>

                  <Link
                    to="/destinos"
                    style={{
                      color:
                        "#173b67",
                      fontWeight: 700,
                      textDecoration:
                        "none",
                    }}
                  >
                    Explorar destinos →
                  </Link>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: 10,
                  }}
                >
                  {favoritos
                    .slice(0, 3)
                    .map(
                      (destino) => (
                        <div
                          key={
                            destino.slug
                          }
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 12,
                            background:
                              "#f8fafc",
                            borderRadius:
                              14,
                            padding:
                              "10px 12px",
                          }}
                        >
                          <img
                            src={
                              destino.imagem
                            }
                            alt={
                              destino.pais
                            }
                            style={{
                              width: 52,
                              height: 52,
                              borderRadius:
                                12,
                              objectFit:
                                "cover",
                            }}
                          />

                          <div
                            style={{
                              flex: 1,
                              minWidth:
                                0,
                            }}
                          >
                            <strong
                              style={{
                                display:
                                  "block",
                                color:
                                  "#0b1f33",
                                fontSize:
                                  14,
                              }}
                            >
                              {
                                destino.bandeira
                              }{" "}
                              {
                                destino.pais
                              }
                            </strong>

                            <span
                              style={{
                                fontSize:
                                  12,
                                color:
                                  "#607084",
                              }}
                            >
                              {
                                destino.cidade
                              }
                            </span>
                          </div>

                          <Link
                            to={`/destinos/${destino.slug}`}
                            style={{
                              color:
                                "#173b67",
                              display:
                                "flex",
                            }}
                          >
                            <ArrowRight
                              size={18}
                            />
                          </Link>
                        </div>
                      )
                    )}
                </div>
              )}
            </div>


            <button
              type="button"
              className="profile-logout"
              onClick={handleSair}
              style={{
                marginTop: 24,
              }}
            >
              <LogOut size={18} />

              Sair da conta
            </button>
          </section>


          <aside className="profile-side">
            <div className="profile-progress-card">
              <span className="profile-mini-label">
                MINHA JORNADA
              </span>

              <h3>
                {passport?.pais
                  ? `${passport.pais} está no seu radar.`
                  : "Comece a planejar seu intercâmbio."}
              </h3>

              <p>
                Seu Passport está{" "}
                <strong>
                  {passport?.progresso ||
                    0}%
                </strong>{" "}
                completo.
              </p>

              <Link
                to="/passport"
                className="profile-primary-button"
              >
                Abrir Passport

                <FileCheck2
                  size={18}
                />
              </Link>
            </div>


            <Link
              to="/planejador"
              className="profile-shortcut"
            >
              <div className="profile-shortcut-icon">
                <PiggyBank
                  size={20}
                />
              </div>

              <div>
                <span>
                  Finanças
                </span>

                <strong>
                  Planejador financeiro
                </strong>
              </div>
            </Link>


            <Link
              to="/destinos"
              className="profile-shortcut"
            >
              <div className="profile-shortcut-icon">
                <MapPin
                  size={20}
                />
              </div>

              <div>
                <span>
                  Explorar
                </span>

                <strong>
                  Ver todos os destinos
                </strong>
              </div>
            </Link>


            <Link
              to="/favoritos"
              className="profile-shortcut"
            >
              <div className="profile-shortcut-icon">
                <Heart
                  size={20}
                />
              </div>

              <div>
                <span>
                  Favoritos
                </span>

                <strong>
                  {total === 0
                    ? "Nenhum salvo"
                    : `${total} destino${
                        total > 1
                          ? "s"
                          : ""
                      }`}
                </strong>
              </div>
            </Link>


            <Link
              to="/bolsas"
              className="profile-shortcut"
            >
              <div className="profile-shortcut-icon">
                <GraduationCap
                  size={20}
                />
              </div>

              <div>
                <span>
                  Oportunidades
                </span>

                <strong>
                  Bolsas de estudo
                </strong>
              </div>
            </Link>


            <Link
              to="/vagas"
              className="profile-shortcut"
            >
              <div className="profile-shortcut-icon">
                <Briefcase
                  size={20}
                />
              </div>

              <div>
                <span>
                  Trabalho
                </span>

                <strong>
                  Vagas no exterior
                </strong>
              </div>
            </Link>


            <Link
              to="/chat"
              className="profile-shortcut"
            >
              <div className="profile-shortcut-icon">
                <MessageCircle
                  size={20}
                />
              </div>

              <div>
                <span>
                  Comunidade
                </span>

                <strong>
                  Chat de intercambistas
                </strong>
              </div>
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}