import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

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


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
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
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;