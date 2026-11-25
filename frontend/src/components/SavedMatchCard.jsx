import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { api } from "../services/api";
import "../styles/SavedMatch.css";

export default function SavedMatchCard() {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    api.meuMatch().then(data => { if (active) { setMatch(data); setError(""); } })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);
  const principal = match?.ranking?.[0];
  return <section className="saved-match-card" aria-label="Meu Match salvo">
    <div className="saved-match-heading"><Sparkles size={22} /><h2>Meu Match</h2></div>
    {loading ? <p role="status">Carregando seu Match...</p> : error ? <><p role="alert">{error}</p><button onClick={() => { setLoading(true); setRetry(v => v + 1); }}>Tentar novamente</button></> : principal ? <>
      <div className="saved-match-summary"><div><span>Seu destino recomendado</span><h3>{principal.bandeira} {principal.pais}</h3><p>{principal.cidade} · {principal.compatibilidade}% de compatibilidade</p></div><span className="saved-match-date">Salvo em {new Date(`${match.salvo_em}Z`).toLocaleDateString("pt-BR")}</span></div>
      <div className="saved-match-actions"><Link to="/match" state={{ resultadoMatch: { respostas: match.respostas, destinoPreferido: match.destinoPreferido, finalizado: true }, matchSalvo: match }}>Ver meu resultado <ArrowRight size={17} /></Link><Link to="/match">Fazer novo Match</Link></div>
    </> : <><p>Descubra os destinos que combinam com você e salve o resultado na sua conta.</p><Link to="/match">Fazer meu Match <ArrowRight size={17} /></Link></>}
  </section>;
}
