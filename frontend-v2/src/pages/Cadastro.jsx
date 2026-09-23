import { useState } from "react";

import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Plane,
  User,
} from "lucide-react";

import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";

import "../styles/Auth.css";


function Cadastro() {
  const {
    cadastrar,
    usuario,
  } = useAuth();

  const navigate = useNavigate();

  const [nome, setNome] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [
    confirmarSenha,
    setConfirmarSenha,
  ] = useState("");

  const [
    mostrarSenha,
    setMostrarSenha,
  ] = useState(false);

  const [
    carregando,
    setCarregando,
  ] = useState(false);

  const [erro, setErro] =
    useState("");


  if (usuario) {
    return (
      <Navigate
        to="/perfil"
        replace
      />
    );
  }


  async function enviar(event) {
    event.preventDefault();

    setErro("");

    if (
      !nome.trim() ||
      !email.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      setErro(
        "Preencha todos os campos."
      );

      return;
    }

    if (nome.trim().length < 3) {
      setErro(
        "Digite seu nome completo."
      );

      return;
    }

    if (senha.length < 6) {
      setErro(
        "A senha precisa ter pelo menos 6 caracteres."
      );

      return;
    }

    if (
      senha !== confirmarSenha
    ) {
      setErro(
        "As senhas não coincidem."
      );

      return;
    }

    try {
      setCarregando(true);

      await cadastrar({
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });

      navigate(
        "/perfil",
        {
          replace: true,
        }
      );
    } catch (error) {
      setErro(
        error.message ||
          "Não foi possível criar sua conta."
      );
    } finally {
      setCarregando(false);
    }
  }


  return (
    <main className="auth-page auth-cadastro-page">
      <section className="auth-visual cadastro-visual">
        <div className="auth-visual-overlay" />

        <Link
          to="/"
          className="auth-logo"
        >
          <div className="auth-logo-icon">
            <Plane size={20} />
          </div>

          <span>
            Inter
            <strong>Way</strong>
          </span>
        </Link>

        <motion.div
          className="auth-visual-content"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <span>
            COMECE SUA JORNADA
          </span>

          <h2>
            Talvez sua próxima
            casa esteja do outro
            lado do mundo.
          </h2>

          <p>
            Crie sua conta e comece
            a descobrir destinos,
            oportunidades e experiências
            que combinam com você.
          </p>
        </motion.div>

        <div className="auth-place">
          <span className="auth-place-pin">
            📍
          </span>

          <div>
            <strong>
              Toronto
            </strong>

            <p>
              Canadá
            </p>
          </div>
        </div>
      </section>


      <section className="auth-form-area">
        <div className="auth-mobile-top">
          <Link
            to="/"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </Link>

          <span>
            Inter
            <strong>Way</strong>
          </span>
        </div>

        <motion.div
          className="auth-form-container"
          initial={{
            opacity: 0,
            x: 25,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.55,
          }}
        >
          <div className="auth-heading">
            <span>
              CRIAR CONTA
            </span>

            <h2>
              Sua jornada começa aqui.
            </h2>

            <p>
              Leva menos de um minuto.
            </p>
          </div>


          <form
            onSubmit={enviar}
            className="auth-form"
          >
            {erro && (
              <div className="auth-error">
                {erro}
              </div>
            )}


            <div className="auth-field">
              <label htmlFor="cadastro-nome">
                Nome
              </label>

              <div className="auth-input">
                <User size={19} />

                <input
                  id="cadastro-nome"
                  type="text"
                  placeholder="Seu nome"
                  autoComplete="name"
                  value={nome}
                  onChange={(event) =>
                    setNome(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>


            <div className="auth-field">
              <label htmlFor="cadastro-email">
                E-mail
              </label>

              <div className="auth-input">
                <Mail size={19} />

                <input
                  id="cadastro-email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>


            <div className="auth-field">
              <label htmlFor="cadastro-senha">
                Senha
              </label>

              <div className="auth-input">
                <LockKeyhole
                  size={19}
                />

                <input
                  id="cadastro-senha"
                  type={
                    mostrarSenha
                      ? "text"
                      : "password"
                  }
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  value={senha}
                  onChange={(event) =>
                    setSenha(
                      event.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="show-password"
                  aria-label={
                    mostrarSenha
                      ? "Ocultar senha"
                      : "Mostrar senha"
                  }
                  onClick={() =>
                    setMostrarSenha(
                      (valor) => !valor
                    )
                  }
                >
                  {mostrarSenha ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>


            <div className="auth-field">
              <label htmlFor="cadastro-confirmar">
                Confirmar senha
              </label>

              <div className="auth-input">
                <LockKeyhole
                  size={19}
                />

                <input
                  id="cadastro-confirmar"
                  type={
                    mostrarSenha
                      ? "text"
                      : "password"
                  }
                  placeholder="Digite novamente"
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={(event) =>
                    setConfirmarSenha(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={carregando}
            >
              {carregando
                ? "Criando conta..."
                : "Criar minha conta"}

              {!carregando && (
                <ArrowRight
                  size={18}
                />
              )}
            </button>
          </form>


          <div className="auth-register">
            <span>
              Já possui uma conta?
            </span>

            <Link to="/login">
              Entrar
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}


export default Cadastro;