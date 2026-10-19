import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/PageNavigation.css";

export default function PageNavigation({ className = "" }) {
  const navigate = useNavigate();
  const location = useLocation();

  function voltar() {
    if (location.key === "default") navigate("/");
    else navigate(-1);
  }

  return (
    <nav className={`page-navigation ${className}`} aria-label="Navegação da página">
      <button type="button" className="page-navigation-back" onClick={voltar}>
        <ArrowLeft size={17} /> Voltar
      </button>
      <Link to="/" className="page-navigation-home">
        Voltar para início <ArrowRight size={17} />
      </Link>
    </nav>
  );
}
