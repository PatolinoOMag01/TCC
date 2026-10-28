import PageNavigation from "./components/PageNavigation";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense, useLayoutEffect, useState } from "react";
import { LoaderCircle, Moon, Sun } from "lucide-react";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  FavoritesProvider,
} from "./context/FavoritesContext";

import ProtectedRoute
  from "./components/ProtectedRoute";
import PlusRoute from "./components/PlusRoute";
import Footer from "./components/Footer";

const Home = lazy(() => import("./pages/Home"));
const Destinos = lazy(() => import("./pages/Destinos"));
const DestinoDetalhes = lazy(() => import("./pages/DestinoDetalhes"));
const Match = lazy(() => import("./pages/Match"));
const Login = lazy(() => import("./pages/Login"));
const Cadastro = lazy(() => import("./pages/Cadastro"));
const Perfil = lazy(() => import("./pages/Perfil"));
const Bolsas = lazy(() => import("./pages/Bolsas"));
const Vagas = lazy(() => import("./pages/Vagas"));
const EscolasIdiomas = lazy(() => import("./pages/EscolasIdiomas"));
const Favoritos = lazy(() => import("./pages/Favoritos"));
const Chat = lazy(() => import("./pages/Chat"));
const Passport = lazy(() => import("./pages/Passport"));
const Planejador = lazy(() => import("./pages/Planejador"));
const AssistenteIA = lazy(() => import("./pages/AssistenteIA"));
const PerfilIntercambio = lazy(() => import("./pages/PerfilIntercambio"));
const PlanoPlus = lazy(() => import("./pages/PlanoPlus"));
const CheckoutPlus = lazy(() => import("./pages/CheckoutPlus"));


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
      <Suspense
        fallback={
          <main className="route-loading" role="status" aria-live="polite">
            <LoaderCircle className="route-loading-spinner" size={28} />
            <span>Carregando página...</span>
          </main>
        }
      >
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
              path="/destinos/:slug/:cidadeSlug"
              element={<DestinoDetalhes />}
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
              path="/plus"
              element={<PlanoPlus />}
            />

            <Route
              path="/plus/checkout"
              element={<ProtectedRoute><CheckoutPlus /></ProtectedRoute>}
            />

            <Route
              path="/plus/retorno"
              element={<ProtectedRoute><CheckoutPlus /></ProtectedRoute>}
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
              path="/escolas-idiomas"
              element={<EscolasIdiomas />}
            />

            <Route
              path="/escolas-de-idiomas"
              element={<EscolasIdiomas />}
            />

            <Route
              path="/idiomas"
              element={<EscolasIdiomas />}
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
                  <PlusRoute recurso="InterWay Passport"><Passport /></PlusRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/planejador"
              element={
                <ProtectedRoute>
                  <PlusRoute recurso="Planejador Financeiro"><Planejador /></PlusRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/perfil-intercambio"
              element={
                <ProtectedRoute>
                  <PerfilIntercambio />
                </ProtectedRoute>
              }
            />

            <Route
              path="/assistente"
              element={
                <ProtectedRoute>
                  <PlusRoute recurso="InterWay IA"><AssistenteIA /></PlusRoute>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<main className="not-found"><div><PageNavigation /><h1>Página não encontrada</h1><Link to="/escolas-idiomas">Abrir escolas de idiomas</Link></div></main>} />
      </Routes>
      </Suspense>
      <Footer />
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
