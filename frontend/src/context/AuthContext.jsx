import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({
  children,
}) {
  const [usuario, setUsuario] =
    useState(null);

  const [carregando, setCarregando] =
    useState(true);

  async function carregarUsuario() {
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

      setUsuario(dados);
    } catch {
      localStorage.removeItem(
        "interway-token"
      );

      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuario();
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