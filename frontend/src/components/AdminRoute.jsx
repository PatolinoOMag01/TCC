import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { usuario } = useAuth();
  if (!usuario?.is_admin) return <main className="not-found"><div><h1>Acesso restrito</h1><p>Esta área é exclusiva para administradores do InterWay.</p><Link to="/">Voltar ao início</Link></div></main>;
  return children;
}
