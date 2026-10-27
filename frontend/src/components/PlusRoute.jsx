import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, Sparkles } from "lucide-react";

import { api } from "../services/api";
import "../styles/PlanoPlus.css";

export default function PlusRoute({ children, recurso = "Este recurso" }) {
  const [assinatura, setAssinatura] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    api.minhaAssinaturaPlus()
      .then((dados) => {
        if (ativo) setAssinatura(dados);
      })
      .catch((error) => {
        if (ativo) setErro(error.message || "Não foi possível verificar seu plano.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => { ativo = false; };
  }, [tentativa]);

  if (carregando) {
    return (
      <main className="route-loading" role="status" aria-live="polite">
        <LoaderCircle className="route-loading-spinner" size={28} />
        <span>Verificando seu InterWay Plus...</span>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="plus-access-error">
        <Sparkles size={25} />
        <h1>Não conseguimos verificar sua assinatura</h1>
        <p>{erro}</p>
        <button type="button" onClick={() => { setErro(""); setCarregando(true); setTentativa((valor) => valor + 1); }}>
          Tentar novamente
        </button>
        <Link to="/plus">Ver o InterWay Plus</Link>
      </main>
    );
  }

  if (!assinatura?.ativa) {
    return (
      <main className="plus-access-error">
        <Sparkles size={25} />
        <span className="plus-page-eyebrow">INTERWAY PLUS</span>
        <h1>O acesso ao {recurso} é exclusivo do Plano Plus</h1>
        <p>
          Tenha acesso a essa ferramenta e organize sua jornada de intercâmbio
          com o InterWay Plus por R$ 29,90 ao mês.
        </p>
        <Link to="/plus">Conhecer o Plano Plus</Link>
        <Link to="/">Voltar ao início</Link>
      </main>
    );
  }

  return children;
}
