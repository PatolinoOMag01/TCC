import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/CheckoutPlus.css";

function CheckoutPlus() {
  const location = useLocation();
  const { usuario } = useAuth();
  const retorno = location.pathname === "/plus/retorno";
  const [aceitouCobranca, setAceitouCobranca] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [consultando, setConsultando] = useState(true);
  const [assinatura, setAssinatura] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    api.minhaAssinaturaPlus()
      .then((atual) => {
        if (!ativo) return;
        setAssinatura(atual);
        setErro("");
      })
      .catch((error) => {
        if (ativo) setErro(error.message || "Não foi possível consultar sua assinatura.");
      })
      .finally(() => {
        if (ativo) setConsultando(false);
      });
    return () => { ativo = false; };
  }, []);

  async function consultarAssinatura() {
    setConsultando(true);
    try {
      const atual = await api.minhaAssinaturaPlus();
      setAssinatura(atual);
      setErro("");
    } catch (error) {
      setErro(error.message || "Não foi possível consultar sua assinatura.");
    } finally {
      setConsultando(false);
    }
  }

  async function iniciarCompra() {
    if (!aceitouCobranca) {
      setErro("Confirme a cobrança mensal para continuar.");
      return;
    }

    setErro("");
    setCarregando(true);
    try {
      const { checkout_url: checkoutUrl } = await api.criarCheckoutPlus();
      const endereco = new URL(checkoutUrl);
      if (!/(^|\.)mercadopago\.com(\.br)?$/.test(endereco.hostname)) {
        throw new Error("O endereço de pagamento retornado não é do Mercado Pago.");
      }
      window.location.assign(endereco.href);
    } catch (error) {
      setErro(error.message || "Não foi possível abrir o pagamento agora.");
      setCarregando(false);
    }
  }

  async function cancelarAssinatura() {
    if (!window.confirm("Deseja cancelar a renovação do InterWay Plus?")) return;

    setCarregando(true);
    setErro("");
    try {
      const atual = await api.cancelarAssinaturaPlus();
      setAssinatura(atual);
    } catch (error) {
      setErro(error.message || "Não foi possível cancelar a assinatura.");
    } finally {
      setCarregando(false);
    }
  }

  const ativa = assinatura?.ativa === true;

  return (
    <main className="plus-checkout-page">
      <header className="plus-checkout-header">
        <Link to="/plus" className="plus-checkout-back">
          <ArrowLeft size={18} />
          Voltar ao plano
        </Link>
        <span><LockKeyhole size={14} /> CHECKOUT SEGURO</span>
      </header>

      <div className="plus-checkout-shell">
        <div className="plus-checkout-main">
          {retorno ? (
            <section className="plus-return-card" aria-live="polite">
              <div className={`plus-return-icon${ativa ? " is-active" : ""}`}>
                {ativa ? <CircleCheck size={28} /> : <LoaderCircle size={26} className={consultando ? "checkout-spinner" : ""} />}
              </div>
              <span className="checkout-eyebrow">INTERWAY PLUS</span>
              <h1>{ativa ? "Sua assinatura está ativa!" : "Estamos confirmando seu pagamento"}</h1>
              <p>
                {ativa
                  ? "Tudo certo. O InterWay Plus já está vinculado à sua conta."
                  : "O Mercado Pago ainda pode estar processando a confirmação. Atualize o status em alguns instantes."}
              </p>
              {erro && <p className="checkout-error" role="alert">{erro}</p>}
              <div className="plus-return-actions">
                {!ativa && (
                  <button type="button" onClick={consultarAssinatura} disabled={consultando}>
                    {consultando ? "Consultando..." : "Atualizar status"}
                  </button>
                )}
                {ativa && (
                  <button type="button" className="checkout-cancel-button" onClick={cancelarAssinatura} disabled={carregando}>
                    {carregando ? "Cancelando..." : "Cancelar renovação"}
                  </button>
                )}
                <Link to="/">Voltar ao InterWay</Link>
              </div>
            </section>
          ) : (
            <>
              <div className="checkout-heading">
                <span className="checkout-eyebrow">ETAPA FINAL</span>
                <h1>Revise seu pedido</h1>
                <p>Confira os detalhes antes de seguir para o ambiente seguro do Mercado Pago.</p>
              </div>

              {ativa ? (
                <section className="plus-return-card existing-plus-card">
                  <div className="plus-return-icon is-active"><CircleCheck size={28} /></div>
                  <h2>Você já tem o InterWay Plus</h2>
                  <p>Sua assinatura está ativa por R$ 29,90 ao mês.</p>
                  <button type="button" className="checkout-cancel-button" onClick={cancelarAssinatura} disabled={carregando}>
                    {carregando ? "Cancelando..." : "Cancelar renovação"}
                  </button>
                </section>
              ) : (
                <section className="checkout-detail-card">
                  <div className="checkout-account-row">
                    <div className="checkout-account-icon"><Check size={17} /></div>
                    <div>
                      <span>Conta InterWay</span>
                      <strong>{usuario?.email}</strong>
                    </div>
                  </div>

                  <div className="checkout-product-row">
                    <div className="checkout-product-icon"><Sparkles size={20} /></div>
                    <div className="checkout-product-copy">
                      <strong>InterWay Plus</strong>
                      <span>IA, Passport e planejamento financeiro</span>
                    </div>
                    <strong className="checkout-product-price">R$ 29,90</strong>
                  </div>

                  <div className="checkout-total-row">
                    <span>Mensalidade</span>
                    <strong>R$ 29,90</strong>
                  </div>
                  <p className="checkout-renewal-note">
                    Cobrança recorrente de R$ 29,90 todos os meses, até o cancelamento.
                  </p>

                  <div className="checkout-payment-method">
                    <div className="checkout-payment-icon"><CreditCard size={19} /></div>
                    <div>
                      <strong>Forma de pagamento</strong>
                      <span>Escolha entre os métodos disponíveis no Mercado Pago.</span>
                    </div>
                    <ShieldCheck size={20} className="checkout-secure-check" />
                  </div>

                  <label className="checkout-consent">
                    <input
                      type="checkbox"
                      checked={aceitouCobranca}
                      onChange={(event) => setAceitouCobranca(event.target.checked)}
                    />
                    <span>Entendi que serão cobrados R$ 29,90 por mês até eu cancelar a renovação.</span>
                  </label>

                  {erro && <p className="checkout-error" role="alert">{erro}</p>}

                  <button
                    type="button"
                    className="checkout-submit"
                    onClick={iniciarCompra}
                    disabled={carregando || consultando || !aceitouCobranca}
                  >
                    {carregando ? "Preparando pagamento..." : "Continuar para pagamento seguro"}
                    {!carregando && <ArrowRight size={18} />}
                  </button>

                  <p className="checkout-security-note">
                    <LockKeyhole size={14} />
                    Os dados de pagamento são informados diretamente ao Mercado Pago e não são armazenados pelo InterWay.
                  </p>
                </section>
              )}
            </>
          )}
        </div>

        <aside className="checkout-summary">
          <span className="checkout-eyebrow">O QUE VEM COM O PLUS</span>
          <h2>Seu próximo passo fica mais claro.</h2>
          <ul>
            <li><Check size={16} /> InterWay IA para orientar sua jornada</li>
            <li><Check size={16} /> Passport e checklist do intercâmbio</li>
            <li><Check size={16} /> Planejador para acompanhar sua meta</li>
          </ul>
          <div className="checkout-summary-price">
            <span>Por mês</span>
            <strong>R$ 29,90</strong>
          </div>
          <p>Depois, R$ 29,90 por mês enquanto a assinatura estiver ativa.</p>
          <Link to="/plus" className="checkout-change-plan">Revisar plano</Link>
        </aside>
      </div>
    </main>
  );
}

export default CheckoutPlus;
