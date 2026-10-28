import { motion } from "framer-motion";
import { useState } from "react";

import logo from "../assets/logo.png";

import {
  ArrowRight,
  Bot,
  Check,
  ClipboardCheck,
  Globe2,
  Heart,
  LogOut,
  MapPin,
  Menu,
  Search,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";

import { Link } from "react-router-dom";

import { destinos } from "../data/destinos";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

const destinosDoCard = ["reino-unido", "malta", "estados-unidos"]
  .map((slug) => destinos.find((destino) => destino.slug === slug))
  .filter(Boolean);

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [preferencias, setPreferencias] = useState({ destino: "", objetivo: "", orcamento: "" });
  const alterarPreferencia = (event) => setPreferencias((atual) => ({ ...atual, [event.target.name]: event.target.value }));
  const {
    usuario,
    sair,
  } = useAuth();
  const { toggleFavorito, isFavorito } = useFavorites();

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
            <Link to="/escolas-idiomas">Escolas de idiomas</Link>
            <Link to="/chat">Comunidade</Link>
<Link to="/assistente">InterWay IA</Link>
<Link to="/match">Match</Link>
            <Link to={usuario ? "/perfil" : "/login"} className="mobile-account-link">
              {usuario ? "Meu perfil" : "Entrar"}
            </Link>
            {usuario && (
              <button
                type="button"
                className="mobile-logout-button"
                onClick={() => {
                  sair();
                  setMenuOpen(false);
                }}
              >
                <LogOut size={16} />
                Sair da conta
              </button>
            )}
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
                  {usuario.nome?.trim().split(/\s+/)[0] || "Meu perfil"}
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
                  +12 destinos
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
                  name="destino" value={preferencias.destino} onChange={alterarPreferencia}
                />
              </div>
            </div>

            <div className="planner-grid">
              <div className="planner-field">
                <label>Objetivo</label>

                <select name="objetivo" value={preferencias.objetivo} onChange={alterarPreferencia}>
                  <option
                    value=""
                    disabled
                  >
                    Selecione
                  </option>

                  <option value="idioma">
                    Aprender idioma
                  </option>

                  <option value="faculdade">
                    Faculdade
                  </option>

                  <option value="trabalho">
                    Trabalhar
                  </option>

                  <option value="experiencia">
                    Experiência cultural
                  </option>
                </select>
              </div>

              <div className="planner-field">
                <label>Orçamento</label>

                <select name="orcamento" value={preferencias.orcamento} onChange={alterarPreferencia}>
                  <option
                    value=""
                    disabled
                  >
                    Selecione
                  </option>

                  <option value="1">
                    Até R$ 10 mil
                  </option>

                  <option value="2">
                    R$ 10 mil - R$ 20 mil
                  </option>

                  <option value="3">
                    R$ 20 mil - R$ 40 mil
                  </option>

                  <option value="4">
                    Acima de R$ 40 mil
                  </option>
                </select>
              </div>
            </div>

            <Link
              to="/match"
              state={{ preferencias }}
              className="planner-button"
            >
              <Search size={18} />
              Encontrar oportunidades
            </Link>

            <p className="planner-caption">
               Leva menos de 2 minutos
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

                  <button
                    type="button"
                    className="favorite-button"
                    aria-label={isFavorito(destino.slug) ? `Remover ${destino.pais} dos favoritos` : `Adicionar ${destino.pais} aos favoritos`}
                    aria-pressed={isFavorito(destino.slug)}
                    onClick={() => toggleFavorito(destino)}
                  >
                    <Heart size={19} fill={isFavorito(destino.slug) ? "currentColor" : "none"} />
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
                        {destino.cidades?.length > 1 && (
                          <small style={{ display: "block", marginTop: 5, color: "rgba(255,255,255,.7)", fontSize: 11 }}>
                            + {destino.cidades.slice(1).join(" · ")}
                          </small>
                        )}
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

      <section className="plus-section" id="interway-plus">
        <div className="plus-card">
          <div className="plus-copy">
            <span className="eyebrow light">INTERWAY PLUS</span>
            <h2>Seu intercâmbio, melhor planejado.</h2>
            <p>
              Reúna as ferramentas que ajudam a transformar a vontade de viajar
              em um plano possível, do primeiro passo até a organização financeira.
            </p>
            <Link to="/plus" className="plus-button">
              Conhecer o plano Plus
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="plus-benefits">
            <article className="plus-benefit">
              <div className="plus-benefit-icon"><Bot size={20} /></div>
              <div>
                <h3>InterWay IA</h3>
                <p>Orientação para dúvidas e próximos passos do intercâmbio.</p>
              </div>
              <Check size={18} className="plus-benefit-check" />
            </article>
            <article className="plus-benefit">
              <div className="plus-benefit-icon"><ClipboardCheck size={20} /></div>
              <div>
                <h3>InterWay Passport</h3>
                <p>Acompanhe etapas, documentos e o progresso da sua jornada.</p>
              </div>
              <Check size={18} className="plus-benefit-check" />
            </article>
            <article className="plus-benefit">
              <div className="plus-benefit-icon"><Wallet size={20} /></div>
              <div>
                <h3>Planejamento financeiro</h3>
                <p>Organize sua meta e acompanhe quanto falta para realizá-la.</p>
              </div>
              <Check size={18} className="plus-benefit-check" />
            </article>
          </div>
        </div>
      </section>

      <section className="journey-section">
        <div className="journey-card">
          <div className="journey-card-content">
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

          <div className="journey-card-visual" role="group" aria-label="Fotos de destinos para intercâmbio">
            {destinosDoCard.map((destino, index) => (
              <figure className={`journey-photo journey-photo-${index + 1}`} key={destino.slug}>
                <img
                  src={destino.imagem}
                  alt={`${destino.cidade}, ${destino.pais}`}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{destino.cidade}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
