import { HeartHandshake, Users } from "lucide-react";

import PageNavigation from "../components/PageNavigation";
import "../styles/Sobre.css";

const integrantes = [
  { nome: "Matheus Lima", iniciais: "ML", github: "https://github.com/PatolinoOMag01", foto: "/images/about/matheus-lima.png" },
  { nome: "João Pedro de Andrade", iniciais: "JP", github: "https://github.com/joaoPedro095810", foto: "/images/about/joao-pedro.png" },
  { nome: "Lorenzo Muller", iniciais: "LM", github: "https://github.com/LorenzoMuller", foto: "/images/about/lorenzo-muller.png" },
  { nome: "Tamires Anastacio", iniciais: "TA", github: "https://github.com/Tamires-Anastacio", foto: "/images/about/tamires-anastacio.png" },
  { nome: "Sophia", iniciais: "S", github: "https://github.com/soph-astronauta", foto: "/images/about/sophia.png" },
];

const mensagemAgradecimento = "À professora orientadora Cíntia Pinho, deixamos nossa sincera gratidão pela escuta, dedicação e incentivo ao longo deste projeto. Suas orientações nos ajudaram a transformar ideias em realidade e foram muito importantes para o aprendizado de toda a equipe. Obrigado por caminhar conosco e acreditar no nosso trabalho.";

function Sobre() {
  return (
    <main className="about-page">
      <div className="about-container">
        <PageNavigation />

        <header className="about-heading">
          <span className="about-eyebrow">PROJETO DE CONCLUSÃO DE CURSO</span>
          <h1>Sobre Nós</h1>
          <p>
            Conheça a equipe por trás do InterWay e a ideia que nos uniu neste projeto.
          </p>
        </header>

        <section className="about-project-card" aria-labelledby="about-project-title">
          <h2 id="about-project-title">O InterWay</h2>
          <p>
            O InterWay é uma plataforma criada por estudantes de Informática para Internet
            da ETEC MCM para apoiar quem está planejando um intercâmbio. Reunimos recursos
            para explorar destinos, conhecer oportunidades, organizar a preparação e
            acompanhar o planejamento financeiro em um só lugar.
          </p>
          <p>
            Nosso objetivo é tornar esse caminho mais claro e acessível, ajudando cada pessoa
            a transformar a vontade de estudar fora em um plano possível.
          </p>
        </section>

        <section className="about-team-section" aria-labelledby="about-team-title">
          <div className="about-section-heading">
            <span className="about-section-icon"><Users size={20} /></span>
            <div>
              <span className="about-eyebrow">QUEM FEZ ACONTECER</span>
              <h2 id="about-team-title">Integrantes</h2>
            </div>
          </div>

          <div className="about-team-grid">
            {integrantes.map((integrante) => (
              <article className="about-member-card" key={integrante.nome}>
                <div className="about-member-photo-slot" aria-label={`Espaço reservado para a foto de ${integrante.nome}`}>
                  {integrante.foto ? (
                    <img className="about-member-photo" src={integrante.foto} alt={`Foto de ${integrante.nome}`} loading="lazy" />
                  ) : (
                    <span className="about-member-avatar" aria-hidden="true">{integrante.iniciais}</span>
                  )}
                </div>
                <h3>{integrante.nome}</h3>
                <a className="about-member-github" href={integrante.github} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="currentColor">
                    <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1 1.52-.75 1.52-.75.97-1.66 2.54-1.18 3.16-.9.1-.7.39-1.18.7-1.46-2.48-.28-5.09-1.24-5.09-5.51 0-1.22.43-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.56 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.12 2.95.71.78 1.14 1.77 1.14 2.99 0 4.28-2.61 5.23-5.1 5.5.4.35.75 1.03.75 2.08v3.6c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                  </svg>
                  GitHub
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="about-thanks-section" aria-labelledby="about-thanks-title">
          <div className="about-section-heading">
            <span className="about-section-icon"><HeartHandshake size={20} /></span>
            <div>
              <span className="about-eyebrow">COM CARINHO E GRATIDÃO</span>
              <h2 id="about-thanks-title">Agradecimentos</h2>
            </div>
          </div>

          <div className="about-teacher-card">
            <div className="about-teacher-profile">
              <img
                src="/images/about/cintia-pinho.png"
                alt="Professora orientadora Cíntia Pinho"
                className="about-teacher-photo"
              />
              <h3>Cíntia Pinho</h3>
              <span>Professora orientadora</span>
            </div>
            <blockquote>
              {mensagemAgradecimento}
            </blockquote>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Sobre;
