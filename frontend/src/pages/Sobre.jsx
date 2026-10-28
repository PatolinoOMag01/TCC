import { Link } from "react-router-dom";
import { ArrowRight, Compass, Globe2, HeartHandshake, Plane } from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import "../styles/Sobre.css";

const integrantes = [
  { nome: "Tamires Anastácio", foto: "/images/integrantes/tamires.png" },
  { nome: "Sophia Gonçalves", foto: "/images/integrantes/sophia.png" },
  { nome: "Lorenzo Muller", foto: "/images/integrantes/lorenzo.png" },
  { nome: "Matheus Lima", foto: "/images/integrantes/matheus.png" },
  { nome: "João Pedro de Andrade", foto: "/images/integrantes/joao.png" },
];

export default function Sobre() {
  return (
    <main className="sobre-page">
      <div className="sobre-wrap">
        <PageNavigation />
        <section className="sobre-hero">
          <span className="sobre-eyebrow"><Globe2 size={16} /> CONHEÇA O INTERWAY</span>
          <h1>Seu próximo capítulo<br /><span>começa com um destino.</span></h1>
          <p>Somos um projeto criado para transformar a vontade de viver um intercâmbio em um plano possível, com informação e orientação em cada etapa.</p>
          <a className="sobre-cta" href="#nossa-historia">Conheça nossa história <ArrowRight size={17} /></a>
          <div className="sobre-orbit orbit-one"><Plane /></div>
          <div className="sobre-orbit orbit-two"><Compass /></div>
        </section>

        <section className="sobre-story" id="nossa-historia">
          <div className="sobre-story-mark"><Compass size={30} /></div>
          <div>
            <span className="sobre-eyebrow">NOSSA IDEIA</span>
            <h2>Sobre o InterWay</h2>
            <p>O InterWay nasceu como Trabalho de Conclusão de Curso de Informática para Internet da ETEC MCM. Criamos uma plataforma para reunir, em um só lugar, recursos que ajudam quem sonha em estudar ou trabalhar fora: destinos, bolsas, vagas, escolas de idiomas e ferramentas de planejamento.</p>
            <p>Acreditamos que informação clara torna cada escolha mais segura. Por isso, nosso objetivo é acompanhar o começo dessa jornada e ajudar cada pessoa a encontrar seu próprio caminho pelo mundo.</p>
          </div>
        </section>

        <section className="sobre-team" id="integrantes">
          <div className="sobre-section-heading"><span className="sobre-eyebrow">QUEM FEZ ACONTECER</span><h2>Integrantes</h2><p>Uma equipe unida pela tecnologia e pela vontade de abrir caminhos.</p></div>
          <div className="sobre-team-grid">
            {integrantes.map((pessoa, index) => (
              <article className="sobre-person" key={pessoa.nome}>
                <img className={`sobre-avatar avatar-${index + 1}`} src={pessoa.foto} alt={`Foto de ${pessoa.nome}`} />
                <h3>{pessoa.nome}</h3><span className="sobre-person-role">Integrante do projeto</span>
              </article>
            ))}
          </div>
        </section>

        <section className="sobre-thanks">
          <div className="sobre-thanks-icon"><HeartHandshake size={27} /></div>
          <div><span className="sobre-eyebrow">NOSSA GRATIDÃO</span><h2>Uma jornada construída em conjunto</h2>
            <p>À professora orientadora <strong>Cíntia Pinho</strong>, nosso agradecimento por acreditar na ideia e nos acompanhar com atenção, conhecimento e incentivo. Sua orientação nos ajudou a transformar desafios em aprendizado e a levar este projeto até aqui.</p>
            <p>Agradecemos também a todos que compartilharam sugestões, conversas e apoio ao longo do caminho. Cada contribuição fez parte desta conquista.</p>
          </div>
        </section>
        <div className="sobre-back"><Link to="/">Voltar para o início <ArrowRight size={16} /></Link></div>
      </div>
    </main>
  );
}
