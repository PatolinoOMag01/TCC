import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Footer.css";

const secoes = [
  { label: "Início", to: "/" },
  { label: "Destinos", to: "/destinos" },
  { label: "Bolsas", to: "/bolsas" },
  { label: "Vagas", to: "/vagas" },
  { label: "Escolas de idiomas", to: "/escolas-idiomas" },
  { label: "Comunidade", to: "/chat" },
  { label: "Sobre nós", to: "/sobre" },
];

const desenvolvedores = [
  { nome: "Matheus Lima", github: "https://github.com/PatolinoOMag01" },
  { nome: "João Pedro de Andrade", github: "https://github.com/joaoPedro095810" },
  { nome: "Lorenzo Muller", github: "https://github.com/LorenzoMuller" },
  { nome: "Tamires Anastacio", github: "https://github.com/Tamires-Anastacio" },
  { nome: "Sophia", github: "https://github.com/soph-astronauta" },
];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-about">
          <Link to="/" className="site-footer-brand" aria-label="InterWay, início">
            <img src={logo} alt="" />
            <span>Inter<span>Way</span></span>
          </Link>
          <p>
            Planeje seu intercâmbio com mais clareza: explore destinos,
            oportunidades e caminhos para tirar sua viagem do papel.
          </p>
        </div>

        <nav className="site-footer-section" aria-label="Seções do site">
          <h2>Seções</h2>
          <ul>
            {secoes.map((secao) => (
              <li key={secao.to}>
                <Link to={secao.to}>{secao.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer-section site-footer-team">
          <h2>Desenvolvedores</h2>
          <ul>
            {desenvolvedores.map((pessoa) => (
              <li key={pessoa.github}>
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
                  <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1 1.52-.75 1.52-.75.97-1.66 2.54-1.18 3.16-.9.1-.7.39-1.18.7-1.46-2.48-.28-5.09-1.24-5.09-5.51 0-1.22.43-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.56 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.12 2.95.71.78 1.14 1.77 1.14 2.99 0 4.28-2.61 5.23-5.1 5.5.4.35.75 1.03.75 2.08v3.6c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                </svg>
                <a href={pessoa.github} target="_blank" rel="noreferrer">
                  {pessoa.nome}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} InterWay — Projeto de TCC</span>
        <span>Informática para Internet · ETEC MCM</span>
      </div>
    </footer>
  );
}

export default Footer;
