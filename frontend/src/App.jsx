import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  FavoritesProvider,
} from "./context/FavoritesContext";

import ProtectedRoute
  from "./components/ProtectedRoute";

import Home
  from "./pages/Home";

import Destinos
  from "./pages/Destinos";

import DestinoDetalhes
  from "./pages/DestinoDetalhes";

import Match
  from "./pages/Match";

import Login
  from "./pages/Login";

import Cadastro
  from "./pages/Cadastro";

import Perfil
  from "./pages/Perfil";

import Bolsas
  from "./pages/Bolsas";

import Vagas
  from "./pages/Vagas";

import Favoritos
  from "./pages/Favoritos";

import Chat
  from "./pages/Chat";

import Passport
  from "./pages/Passport";

import Planejador
  from "./pages/Planejador";


function NavigationAndTheme() {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("interway-theme");
    return saved === "dark" || saved === "light"
      ? saved
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  });

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("interway-theme", theme);
  }, [theme]);

  return (
    <>
      <button
        type="button"
        className="theme-toggle"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
        title={theme === "dark" ? "Modo claro" : "Modo escuro"}
      >
        {theme === "dark" ? <Sun size={21} /> : <Moon size={21} />}
      </button>
      <Routes>
            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/destinos"
              element={<Destinos />}
            />

            <Route
              path="/destinos/:slug"
              element={
                <DestinoDetalhes />
              }
            />

            <Route
              path="/match"
              element={<Match />}
            />

            <Route
              path="/bolsas"
              element={<Bolsas />}
            />

            <Route
              path="/vagas"
              element={<Vagas />}
            />

            <Route
              path="/favoritos"
              element={<Favoritos />}
            />

            <Route
              path="/chat"
              element={<Chat />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/cadastro"
              element={<Cadastro />}
            />

            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              }
            />

            <Route
              path="/passport"
              element={
                <ProtectedRoute>
                  <Passport />
                </ProtectedRoute>
              }
            />

            <Route
              path="/planejador"
              element={
                <ProtectedRoute>
                  <Planejador />
                </ProtectedRoute>
              }
            />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <NavigationAndTheme />
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;
