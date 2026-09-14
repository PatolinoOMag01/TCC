import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";

import { useAuth }
  from "../context/AuthContext";

import "../styles/Auth.css";

export default function Login() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    entrar,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [
    mostrarSenha,
    setMostrarSenha,
  ] = useState(false);

  const [erro, setErro] =
    useState("");

  const [
    enviando,
    setEnviando,
  ] = useState(false);

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setErro("");
    setEnviando(true);

    try {
      await entrar({
        email,
        senha,
      });

      const destino =
        location.state?.from ||
        "/perfil";

      navigate(destino, {
        replace: true,
      });
    } catch (error) {
      setErro(
        error.message ||
          "Não foi possível entrar."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link
          to="/"
          className="auth-back"
        >
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <div className="auth-brand">
          InterWay
        </div>

        <div className="auth-heading">
          <span>
            Bem-vindo de volta
          </span>

          <h1>
            Continue sua jornada.
          </h1>

          <p>
            Entre na sua conta para
            acessar seus destinos,
            planos e recomendações.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label>
            E-mail

            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
            />
          </label>

          <label>
            Senha

            <div className="auth-password">
              <input
                type={
                  mostrarSenha
                    ? "text"
                    : "password"
                }
                placeholder="Sua senha"
                value={senha}
                onChange={(event) =>
                  setSenha(
                    event.target.value
                  )
                }
                required
              />

              <button
                type="button"
                onClick={() =>
                  setMostrarSenha(
                    !mostrarSenha
                  )
                }
                aria-label="Mostrar senha"
              >
                {mostrarSenha ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </label>

          {erro && (
            <div className="auth-error">
              {erro}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={enviando}
          >
            <LogIn size={19} />

            {enviando
              ? "Entrando..."
              : "Entrar"}
          </button>
        </form>

        <p className="auth-switch">
          Ainda não tem conta?{" "}
          <Link to="/cadastro">
            Criar conta
          </Link>
        </p>
      </section>

      <section className="auth-visual">
        <div className="auth-visual-content">
          <span>
            INTERWAY
          </span>

          <h2>
            O mundo começa quando
            você decide ir.
          </h2>

          <p>
            Descubra destinos que
            combinam com seus
            objetivos.
          </p>
        </div>
      </section>
    </main>
  );
}