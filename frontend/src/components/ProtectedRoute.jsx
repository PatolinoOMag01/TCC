import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth }
  from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
}) {
  const {
    usuario,
    carregando,
  } = useAuth();

  const location =
    useLocation();

  if (carregando) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        Carregando...
      </div>
    );
  }

  if (!usuario) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}
