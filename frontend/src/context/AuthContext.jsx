/* eslint-disable react-refresh/only-export-components -- Context exports its public hook. */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({
  children,
}) {
  const [usuario, setUsuario] =
    useState(null);

  const [carregando, setCarregando] =
    useState(() => Boolean(localStorage.getItem("interway-token")));

  const sessao = useRef(0);

  async function carregarUsuario() {
    const versao = sessao.current;
    const token =
      localStorage.getItem(
        "interway-token"
      );

    if (!token) {
      setUsuario(null);
      setCarregando(false);
      return;
    }

    try {
      const dados =
        await api.meuPerfil();

      if (versao === sessao.current) setUsuario(dados);
    } catch (erro) {
      if (versao !== sessao.current) return;
      if (erro.status === 401) localStorage.removeItem("interway-token");
      setUsuario(null);
    } finally {
      if (versao === sessao.current) setCarregando(false);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("interway-token")) return;
    let ativo = true;
    const versao = sessao.current;
    api.meuPerfil().then(dados => { if (ativo && versao === sessao.current) setUsuario(dados); })
      .catch((erro) => { if (ativo && versao === sessao.current) { if (erro.status === 401) localStorage.removeItem("interway-token"); setUsuario(null); } })
      .finally(() => { if (ativo && versao === sessao.current) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  async function cadastrar({
    nome,
    email,
    senha,
  }) {
    await api.cadastrar({
      nome,
      email,
      senha,
    });

    return entrar({
      email,
      senha,
    });
  }

  async function entrar({
    email,
    senha,
  }) {
    const resposta =
      await api.login({
        email,
        senha,
      });

    sessao.current += 1;
    setCarregando(false);
    localStorage.setItem(
      "interway-token",
      resposta.access_token
    );

    setUsuario(
      resposta.usuario
    );

    return resposta.usuario;
  }

  function sair() {
    sessao.current += 1;
    setCarregando(false);
    localStorage.removeItem(
      "interway-token"
    );

    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        autenticado: Boolean(usuario),
        cadastrar,
        entrar,
        sair,
        carregarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth precisa estar dentro de AuthProvider."
    );
  }

  return context;
}