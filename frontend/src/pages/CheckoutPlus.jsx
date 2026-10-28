import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ClipboardCheck,
  LoaderCircle,
  Sparkles,
  Wallet,
} from "lucide-react";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/CheckoutPlus.css";

const recursos = [
  { Icone: Bot, titulo: "InterWay IA", rota: "/assistente" },
  { Icone: ClipboardCheck, titulo: "InterWay Passport", rota: "/passport" },
  { Icone: Wallet, titulo: "Planejamento financeiro", rota: "/planejador" },
];

function CheckoutPlus() {
  const { usuario } = useAuth();
  const [assinatura, setAssinatura] = useState(null);
  const [consultando, setConsultando] = useState(true);
  const [ativando, setAtivando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    let ativo = true;
    api.minhaAssinaturaPlus()
      .then((atual) => {
        if (ativo) setAssinatura(atual);
      })
      .catch((error) => {
        if (ativo) setErro(error.message || "Não foi possível consultar o acesso Plus.");
      })
      .finally(() => {
        if (ativo) setConsultando(false);
      });
    return () => { ativo = false; };
  }, []);

  async function ativarDemonstracao() {
    setAtivando(true);
    setErro("");
    setMensagem("");
    try {
      const atual = await api.ativarPlusDemo();
      setAssinatura(atual);
      setMensagem("Demonstração ativada. InterWay IA, Passport e planejamento financeiro estão liberados para sua conta.");
    } catch (error) {
      setErro(error.message || "Não foi possível ativar a demonstração. Verifique se o modo de apresentação está habilitado no servidor.");
    } finally {
      setAtivando(false);
    }
  }

  const ativa = assinatura?.ativa === true;

  return (
    <main className="plus-checkout-page plus-demo-page">
      <header className="plus-checkout-header">
        <Link to="/plus" className="plus-checkout-back">
          <ArrowLeft size={18} />
          Voltar ao plano
        </Link>
        <span><Sparkles size={14} /> MODO DE APRESENTAÇÃO</span>
      </header>

      <div className="plus-checkout-shell plus-demo-shell">
        <section className="plus-demo-main">
          <span className="checkout-eyebrow">INTERWAY PLUS · PROTÓTIPO</span>
          <h1>Explore as ferramentas do Plus</h1>
          <p className="plus-demo-description">
            Ative a demonstração para liberar os recursos nesta conta e conhecer a experiência completa do InterWay Plus.
          </p>

          <div className="plus-demo-account">
            <span>Conta InterWay</span>
            <strong>{usuario?.email}</strong>
          </div>

          <div className="plus-demo-features">
            {recursos.map(({ Icone, titulo }) => (
              <div className="plus-demo-feature" key={titulo}>
                <span className="plus-demo-feature-icon"><Icone size={19} /></span>
                <strong>{titulo}</strong>
                {ativa && <Check size={18} className="plus-demo-feature-check" />}
              </div>
            ))}
          </div>

          {consultando && (
            <p className="plus-demo-status" role="status">
              <LoaderCircle size={16} className="checkout-spinner" /> Verificando acesso...
            </p>
          )}
          {erro && <p className="checkout-error" role="alert">{erro}</p>}
          {mensagem && <p className="checkout-success" role="status">{mensagem}</p>}

          {ativa && (
            <div className="plus-demo-links">
              {recursos.map(({ titulo, rota }) => (
                <Link to={rota} key={rota}>{titulo}<ArrowRight size={16} /></Link>
              ))}
            </div>
          )}
        </section>

        <aside className="plus-demo-summary">
          <span className="checkout-eyebrow">DEMONSTRAÇÃO</span>
          <h2>{ativa ? "Plus ativado para esta conta" : "Tudo pronto para apresentar"}</h2>
          <p>
            {ativa
              ? "Os três recursos já estão disponíveis. Abra uma ferramenta para continuar."
              : "Clique no botão para ativar os recursos. Nenhum pagamento ou método de cobrança será solicitado."}
          </p>
          <ul>
            {recursos.map(({ titulo }) => (
              <li key={titulo}><Check size={16} /> {titulo}</li>
            ))}
          </ul>
        </aside>
      </div>

      {!ativa && (
        <button
          type="button"
          className="floating-plus-button"
          onClick={ativarDemonstracao}
          disabled={consultando || ativando}
          aria-label="Ativar demonstração do InterWay Plus"
          title="Libera InterWay IA, Passport e planejamento financeiro nesta conta"
        >
          {ativando ? <LoaderCircle size={17} className="checkout-spinner" /> : <Sparkles size={17} />}
          <span>{ativando ? "Ativando..." : "Ativar demonstração"}</span>
        </button>
      )}
    </main>
  );
}

export default CheckoutPlus;