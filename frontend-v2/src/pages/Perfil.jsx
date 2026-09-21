import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Compass,
  GraduationCap,
  Heart,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
  User,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

import "../styles/Auth.css";

export default function Perfil() {
  const navigate = useNavigate();
  const { usuario, sair } = useAuth();
  const { favoritos, total } =
    useFavorites();

  function handleSair() {
    sair();
    navigate("/", { replace: true });
  }

  function pegarIniciais(nome = "") {
    return nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte.charAt(0).toUpperCase())
      .join("");
  }

  return (
    <main className="profile-page">
      <div className="profile-glow profile-glow-one" />
      <div className="profile-glow profile-glow-two" />

      <div className="profile-wrapper">
        <header className="profile-topbar">
          <Link to="/" className="profile-back">
            <ArrowLeft size={18} />
            Voltar
          </Link>

          <Link to="/" className="profile-logo">
            InterWay
          </Link>
        </header>

        <section className="profile-hero">
          <div>
            <span className="profile-eyebrow">
              SUA JORNADA
            </span>

            <h1>
              Olá,{" "}
              <span>{usuario?.nome?.split(" ")[0]}</span>.
            </h1>

            <p>
              Seu próximo destino pode estar mais perto
              do que você imagina.
            </p>
          </div>

          <div className="profile-avatar-large">
            {pegarIniciais(usuario?.nome)}
          </div>
        </section>

        {/* Resumo rápido */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              borderRadius: 18,
              padding: "18px 16px",
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(24,55,90,0.06)",
            }}
          >
            <Heart
              size={22}
              color="#ef4444"
              fill="#ef4444"
              style={{ marginBottom: 6 }}
            />
            <strong
              style={{
                display: "block",
                fontSize: 22,
                color: "#0b1f33",
              }}
            >
              {total}
            </strong>
            <span style={{ fontSize: 13, color: "#607084" }}>
              Favoritos
            </span>
          </div>

          <Link
            to="/match"
            style={{
              background: "rgba(255,255,255,0.85)",
              borderRadius: 18,
              padding: "18px 16px",
              textAlign: "center",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(24,55,90,0.06)",
            }}
          >
            <Compass
              size={22}
              color="#3b82f6"
              style={{ marginBottom: 6 }}
            />
            <strong
              style={{
                display: "block",
                fontSize: 15,
                color: "#0b1f33",
              }}
            >
              Match
            </strong>
            <span style={{ fontSize: 13, color: "#607084" }}>
              Descobrir destino
            </span>
          </Link>

          <Link
            to="/chat"
            style={{
              background: "rgba(255,255,255,0.85)",
              borderRadius: 18,
              padding: "18px 16px",
              textAlign: "center",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(24,55,90,0.06)",
            }}
          >
            <MessageCircle
              size={22}
              color="#10b981"
              style={{ marginBottom: 6 }}
            />
            <strong
              style={{
                display: "block",
                fontSize: 15,
                color: "#0b1f33",
              }}
            >
              Comunidade
            </strong>
            <span style={{ fontSize: 13, color: "#607084" }}>
              Conversar
            </span>
          </Link>
        </div>

        <div className="profile-grid">
          <section className="profile-main-card">
            <div className="profile-card-title">
              <div>
                <span>Minha conta</span>
                <h2>Informações pessoais</h2>
              </div>
              <User size={22} />
            </div>

            <div className="profile-details">
              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <User size={19} />
                </div>
                <div>
                  <span>Nome</span>
                  <strong>{usuario?.nome}</strong>
                </div>
              </div>

              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <Mail size={19} />
                </div>
                <div>
                  <span>E-mail</span>
                  <strong>{usuario?.email}</strong>
                </div>
              </div>

              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <Sparkles size={19} />
                </div>
                <div>
                  <span>Conta InterWay</span>
                  <strong>#{usuario?.id}</strong>
                </div>
              </div>
            </div>

            {/* Favoritos dentro do perfil */}
            <div style={{ marginTop: 28 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 17,
                    color: "#0b1f33",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Heart size={18} color="#ef4444" />
                  Meus favoritos
                </h3>

                {total > 0 && (
                  <Link
                    to="/favoritos"
                    style={{
                      fontSize: 13,
                      color: "#3b82f6",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Ver todos →
                  </Link>
                )}
              </div>

              {total === 0 ? (
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: 16,
                    padding: "24px 18px",
                    textAlign: "center",
                    color: "#607084",
                    fontSize: 14,
                  }}
                >
                  <p style={{ margin: "0 0 12px" }}>
                    Você ainda não salvou nenhum destino.
                  </p>
                  <Link
                    to="/destinos"
                    style={{
                      color: "#173b67",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Explorar destinos →
                  </Link>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {favoritos.slice(0, 3).map((destino) => (
                    <div
                      key={destino.slug}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: "#f8fafc",
                        borderRadius: 14,
                        padding: "10px 12px",
                      }}
                    >
                      <img
                        src={destino.imagem}
                        alt={destino.pais}
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 12,
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong
                          style={{
                            display: "block",
                            color: "#0b1f33",
                            fontSize: 14,
                          }}
                        >
                          {destino.bandeira} {destino.pais}
                        </strong>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#607084",
                          }}
                        >
                          {destino.cidade}
                        </span>
                      </div>
                      <Link
                        to={`/destinos/${destino.slug}`}
                        style={{
                          color: "#173b67",
                          display: "flex",
                        }}
                      >
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="profile-logout"
              onClick={handleSair}
              style={{ marginTop: 24 }}
            >
              <LogOut size={18} />
              Sair da conta
            </button>
          </section>

          <aside className="profile-side">
            <div className="profile-progress-card">
              <span className="profile-mini-label">
                INTERWAY MATCH
              </span>
              <h3>
                Descubra o destino ideal para você.
              </h3>
              <p>
                Responda algumas perguntas e compare
                destinos de acordo com o seu perfil.
              </p>
              <Link
                to="/match"
                className="profile-primary-button"
              >
                Fazer meu Match
                <Compass size={18} />
              </Link>
            </div>

            <Link to="/destinos" className="profile-shortcut">
              <div className="profile-shortcut-icon">
                <MapPin size={20} />
              </div>
              <div>
                <span>Explorar</span>
                <strong>Ver todos os destinos</strong>
              </div>
            </Link>

            <Link to="/favoritos" className="profile-shortcut">
              <div className="profile-shortcut-icon">
                <Heart size={20} />
              </div>
              <div>
                <span>Favoritos</span>
                <strong>
                  {total === 0
                    ? "Nenhum salvo"
                    : `${total} destino${total > 1 ? "s" : ""}`}
                </strong>
              </div>
            </Link>

            <Link to="/bolsas" className="profile-shortcut">
              <div className="profile-shortcut-icon">
                <GraduationCap size={20} />
              </div>
              <div>
                <span>Oportunidades</span>
                <strong>Bolsas de estudo</strong>
              </div>
            </Link>

            <Link to="/vagas" className="profile-shortcut">
              <div className="profile-shortcut-icon">
                <Briefcase size={20} />
              </div>
              <div>
                <span>Trabalho</span>
                <strong>Vagas no exterior</strong>
              </div>
            </Link>

            <Link to="/chat" className="profile-shortcut">
              <div className="profile-shortcut-icon">
                <MessageCircle size={20} />
              </div>
              <div>
                <span>Comunidade</span>
                <strong>Chat de intercambistas</strong>
              </div>
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}