import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ClipboardCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import "../styles/PlanoPlus.css";

const beneficios = [
  {
    Icone: Bot,
    titulo: "InterWay IA",
    descricao: "Tire dúvidas e receba orientação para cada etapa do intercâmbio.",
  },
  {
    Icone: ClipboardCheck,
    titulo: "InterWay Passport",
    descricao: "Organize documentos e acompanhe o progresso da sua jornada.",
  },
  {
    Icone: Wallet,
    titulo: "Planejamento financeiro",
    descricao: "Defina sua meta, registre o que já juntou e acompanhe o caminho até ela.",
  },
];

function PlanoPlus() {
  return (
    <main className="plus-page">
      <header className="plus-page-header">
        <Link to="/" className="plus-back-link">
          <ArrowLeft size={18} />
          Voltar para o início
        </Link>
        <span>INTERWAY PLUS</span>
      </header>

      <section className="plus-page-content">
        <div className="plus-page-intro">
          <span className="plus-page-eyebrow">
            <Sparkles size={15} />
            MAIS APOIO PARA SUA JORNADA
          </span>
          <h1>
            Seu intercâmbio não começa no embarque.
            <span> Começa no plano certo.</span>
          </h1>
          <p>
            O InterWay Plus reúne as ferramentas para você sair da ideia e
            avançar com mais organização, segurança e clareza em cada etapa.
          </p>

          <div className="plus-plan-benefits">
            {beneficios.map(({ Icone, titulo, descricao }) => (
              <article className="plus-plan-benefit" key={titulo}>
                <div className="plus-plan-benefit-icon"><Icone size={21} /></div>
                <div>
                  <h2>{titulo}</h2>
                  <p>{descricao}</p>
                </div>
                <Check className="plus-plan-check" size={19} />
              </article>
            ))}
          </div>
        </div>

        <aside className="plus-price-card plus-demo-offer-card">
          <div className="plus-price-badge">MODO DE APRESENTAÇÃO</div>
          <h2>Experimente o InterWay Plus</h2>
          <p className="plus-price-description">
            Ative os recursos para esta conta e explore a experiência completa do protótipo.
          </p>
          <ul>
            <li><Check size={16} /> InterWay IA</li>
            <li><Check size={16} /> Passport e checklist</li>
            <li><Check size={16} /> Planejamento financeiro</li>
          </ul>
          <Link to="/plus/checkout" className="plus-signup-button">
            Abrir demonstração
            <ArrowRight size={18} />
          </Link>
          <p className="plus-checkout-note">
            Sem pagamento ou método de cobrança. Os recursos são liberados somente após ativar a demonstração.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default PlanoPlus;
