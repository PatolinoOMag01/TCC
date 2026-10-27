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

        <aside className="plus-price-card">
          <div className="plus-price-badge">PLANO INTERWAY PLUS</div>
          <h2>Mais perto da sua viagem</h2>
          <p className="plus-price-description">
            Um espaço só seu para planejar o próximo passo.
          </p>

          <div className="plus-price">
            <span>R$</span>
            <strong>29,90</strong>
          </div>
          <p className="plus-price-caption">por mês, com renovação automática</p>

          <ul>
            <li><Check size={16} /> InterWay IA</li>
            <li><Check size={16} /> Passport e checklist</li>
            <li><Check size={16} /> Planejamento financeiro</li>
          </ul>

          <Link to="/plus/checkout" className="plus-signup-button">
            Continuar para a compra
            <ArrowRight size={18} />
          </Link>
          <p className="plus-checkout-note">
            Pagamento processado com segurança pelo Mercado Pago. Você pode cancelar a renovação pela sua assinatura.
          </p>
          <Link to="/plus/checkout" className="plus-manage-link">
            Já assinei? Gerenciar assinatura
          </Link>
        </aside>
      </section>
    </main>
  );
}

export default PlanoPlus;
