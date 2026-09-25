import { motion } from "framer-motion";
import { useState } from "react";

import logo from "../assets/logo.png";

import {
  ArrowRight,
  Globe2,
  Heart,
  LogOut,
  MapPin,
  Menu,
  Search,
  Sparkles,
  User,
} from "lucide-react";

import { Link } from "react-router-dom";

import { destinos } from "../data/destinos";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    usuario,
    sair,
  } = useAuth();

  return (
    <main>
      <section className="hero">
        <div className="hero-overlay" />

        <nav className="navbar">
          <Link
            to="/"
            className="logo"
          >
            <div className="logo-icon">
              <img
                src={logo}
                alt="Logo InterWay"
              />
            </div>

            <span>
              Inter<span>Way</span>
            </span>
          </Link>

          <div className={`nav-links${menuOpen ? " is-open" : ""}`} id="main-navigation">
            <Link to="/destinos">Destinos</Link>
            <Link to="/favoritos">Favoritos</Link>
            <Link to="/bolsas">Bolsas</Link>
            <Link to="/vagas">Vagas</Link>
            <Link to="/chat">Comunidade</Link>
            <Link to="/match">Match</Link>
            <Link to={usuario ? "/perfil" : "/login"} className="mobile-account-link">
              {usuario ? "Meu perfil" : "Entrar"}
            </Link>
          </div>

          <div className="nav-actions">
            {usuario ? (
              <>
                <Link
                  to="/perfil"
                  className="login-button"
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <User size={17} />
                  {usuario.nome.split(" ")[0]}
                </Link>

                <button
                  type="button"
                  className="profile-button"
                  onClick={sair}
                >
                  Sair
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="login-button"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  Entrar
                </Link>

                <Link
                  to="/cadastro"
                  className="profile-button"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  Criar conta
                  <ArrowRight size={17} />
                </Link>
              </>
            )}

            <button
              type="button"
              className="menu-button"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="main-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Menu />
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <div className="hero-badge">
              <Sparkles size={16} />
              Seu intercâmbio começa aqui
            </div>

            <h1>
              O mundo é grande demais
              <br />
              para ficar no{" "}
              <span>mesmo lugar.</span>
            </h1>

            <p>
              Descubra destinos, programas
              e oportunidades de intercâmbio
              que combinam com seus
              objetivos, orçamento e estilo
              de vida.
            </p>

            <div className="hero-buttons">
              <Link
                to="/match"
                className="primary-button"
              >
                Encontrar meu destino
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/destinos"
                className="secondary-button"
              >
                <Globe2 size={18} />
                Explorar destinos
              </Link>
            </div>

            <div className="hero-info">
              <div className="avatars">
                <div>🇮🇪</div>
                <div>🇨🇦</div>
                <div>🇦🇺</div>
                <div>🇬🇧</div>
              </div>

              <p>
                <strong>
                  +20 destinos
                </strong>

                <span>
                  para você explorar
                </span>
              </p>
            </div>
          </motion.div>

          <motion.div
            className="planner-card"
            initial={{
              opacity: 0,
              x: 50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.2,
            }}
          >
            <div className="planner-header">
              <div>
                <span className="mini-label">
                  Planejador InterWay
                </span>

                <h2>
                  Onde será sua próxima
                  história?
                </h2>
              </div>

              <div className="planner-icon">
                <Globe2 size={22} />
              </div>
            </div>

            <div className="planner-field">
              <label>
                Para onde você quer ir?
              </label>

              <div className="input-container">
                <MapPin size={19} />

                <input
                  placeholder="Escolha um destino"
                />
              </div>
            </div>

            <div className="planner-grid">
              <div className="planner-field">
                <label>Objetivo</label>

                <select defaultValue="">
                  <option
                    value=""
                    disabled
                  >
                    Selecione
                  </option>

                  <option>
                    Aprender idioma
                  </option>

                  <option>
                    Faculdade
                  </option>

                  <option>
                    Trabalhar
                  </option>

                  <option>
                    Experiência cultural
                  </option>
                </select>
              </div>

              <div className="planner-field">
                <label>Orçamento</label>

                <select defaultValue="">
                  <option
                    value=""
                    disabled
                  >
                    Selecione
                  </option>

                  <option>
                    Até R$ 10 mil
                  </option>

                  <option>
                    R$ 10 mil - R$ 20 mil
                  </option>

                  <option>
                    R$ 20 mil - R$ 40 mil
                  </option>

                  <option>
                    Acima de R$ 40 mil
                  </option>
                </select>
              </div>
            </div>

            <Link
              to="/match"
              className="planner-button"
            >
              <Search size={18} />
              Encontrar oportunidades
            </Link>

            <p className="planner-caption">
              ✨ Leva menos de 2 minutos
              para descobrir seu destino
              ideal.
            </p>
          </motion.div>
        </div>

        <div className="hero-scroll">
          <span>Explore</span>
          <div />
        </div>
      </section>

      <section
        className="destinations-section"
        id="destinos"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              DESCUBRA O MUNDO
            </span>

            <h2>
              Destinos que podem
              <br />
              mudar a sua{" "}
              <span>história.</span>
            </h2>
          </div>

          <div className="heading-right">
            <p>
              Conheça alguns dos destinos
              mais procurados por estudantes
              e descubra qual combina mais
              com você.
            </p>

            <Link
              to="/destinos"
              className="text-button"
            >
              Ver todos os destinos
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <div className="destination-grid">
          {destinos
            .slice(0, 3)
            .map(
              (
                destino,
                index
              ) => (
                <motion.article
                  className="destination-card"
                  key={destino.slug}
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.55,
                    delay:
                      index * 0.12,
                  }}
                >
                  <img
                    src={
                      destino.imagem
                    }
                    alt={
                      destino.pais
                    }
                  />

                  <div className="card-gradient" />

                  <button className="favorite-button">
                    <Heart size={19} />
                  </button>

                  <div className="destination-tag">
                    {
                      destino.destaque
                    }
                  </div>

                  <div className="destination-content">
                    <div className="country-title">
                      <span>
                        {
                          destino.bandeira
                        }
                      </span>

                      <div>
                        <h3>
                          {
                            destino.pais
                          }
                        </h3>

                        <p>
                          <MapPin
                            size={14}
                          />

                          {
                            destino.cidade
                          }
                        </p>
                      </div>
                    </div>

                    <p className="destination-description">
                      {
                        destino.descricao
                      }
                    </p>

                    <Link
                      to={`/destinos/${destino.slug}`}
                    >
                      Explorar{" "}
                      {destino.pais}

                      <ArrowRight
                        size={16}
                      />
                    </Link>
                  </div>
                </motion.article>
              )
            )}
        </div>
      </section>

      <section className="journey-section">
        <div className="journey-card">
          <div className="journey-decoration">
            <Globe2 />
          </div>

          <span className="eyebrow light">
            INTERWAY MATCH
          </span>

          <h2>
            Ainda não sabe
            <br />
            para onde ir?
          </h2>

          <p>
            Responda algumas perguntas
            sobre seus objetivos, orçamento
            e preferências. Nós encontramos
            os destinos que mais combinam
            com você.
          </p>

          <Link
            to="/match"
            className="primary-button"
          >
            Descobrir meu destino

            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
