import {
  ArrowLeft,
  Compass,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/Auth.css";

export default function Perfil() {
  const navigate = useNavigate();

  const {
    usuario,
    sair,
  } = useAuth();

  function handleSair() {
    sair();

    navigate("/", {
      replace: true,
    });
  }

  function pegarIniciais(nome = "") {
    return nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) =>
        parte.charAt(0).toUpperCase()
      )
      .join("");
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
              SUA JORNADA
            </span>

            <h1>
              Olá,{" "}
              <span>
                {usuario?.nome?.split(" ")[0]}
              </span>
              .
            </h1>

            <p>
              Seu próximo destino pode estar
              mais perto do que você imagina.
            </p>
          </div>

          <div className="profile-avatar-large">
            {pegarIniciais(usuario?.nome)}
          </div>
        </section>

        <div className="profile-grid">
          <section className="profile-main-card">
            <div className="profile-card-title">
              <div>
                <span>Minha conta</span>

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
                  <span>Nome</span>

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
                  <span>E-mail</span>

                  <strong>
                    {usuario?.email}
                  </strong>
                </div>
              </div>

              <div className="profile-detail">
                <div className="profile-detail-icon">
                  <Sparkles size={19} />
                </div>

                <div>
                  <span>Conta InterWay</span>

                  <strong>
                    #{usuario?.id}
                  </strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="profile-logout"
              onClick={handleSair}
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
                Descubra o destino ideal
                para você.
              </h3>

              <p>
                Responda algumas perguntas
                e compare destinos de acordo
                com o seu perfil.
              </p>

              <Link
                to="/match"
                className="profile-primary-button"
              >
                Fazer meu Match
                <Compass size={18} />
              </Link>
            </div>

            <Link
              to="/destinos"
              className="profile-shortcut"
            >
              <div className="profile-shortcut-icon">
                <MapPin size={20} />
              </div>

              <div>
                <span>Explorar</span>
                <strong>
                  Ver todos os destinos
                </strong>
              </div>
            </Link>

            <div className="profile-shortcut">
              <div className="profile-shortcut-icon">
                <Heart size={20} />
              </div>

              <div>
                <span>Favoritos</span>
                <strong>
                  Em breve
                </strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}