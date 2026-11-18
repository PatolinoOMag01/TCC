import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpenCheck, Clock3, GraduationCap, Languages, MapPin, Plane, Search } from "lucide-react";

import PageNavigation from "../components/PageNavigation";
import { escolasIdiomas } from "../data/escolasIdiomas";
import { escolasIntercambio } from "../data/escolasIntercambio";
import "../styles/EscolasIdiomas.css";

export default function EscolasIdiomas() {
  const [secaoAtiva, setSecaoAtiva] = useState("idiomas");
  const [busca, setBusca] = useState("");
  const [idiomaSelecionado, setIdiomaSelecionado] = useState("Todos");

  const idiomas = useMemo(
    () => ["Todos", ...new Set(escolasIdiomas.map((escola) => escola.idioma))],
    [],
  );

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    return escolasIdiomas.filter((escola) => {
      const correspondeIdioma = idiomaSelecionado === "Todos" || escola.idioma === idiomaSelecionado;
      const texto = `${escola.escola} ${escola.cidade} ${escola.pais} ${escola.idioma} ${escola.destaque}`
        .toLocaleLowerCase("pt-BR");
      return correspondeIdioma && (!termo || texto.includes(termo));
    });
  }, [busca, idiomaSelecionado]);

  return (
    <main className="language-schools-page">
      <div className="language-schools-container">
        <PageNavigation />

        <header className="language-schools-heading">
          <span className="language-schools-eyebrow">OPÇÕES NA SUA CIDADE</span>
          <h1>Escolas de idiomas</h1>
          <p>Encontre cursos de idiomas e oportunidades de intercâmbio ligadas a instituições de ensino.</p>
        </header>

        <div className="language-schools-tabs" role="group" aria-label="Tipo de instituição">
          <button type="button" aria-pressed={secaoAtiva === "idiomas"} onClick={() => setSecaoAtiva("idiomas")}>
            Escolas de idiomas
          </button>
          <button type="button" aria-pressed={secaoAtiva === "intercambio"} onClick={() => setSecaoAtiva("intercambio")}>
            Escolas com intercâmbio
          </button>
        </div>

        {secaoAtiva === "idiomas" ? (
          <>
            <p className="language-schools-notice" role="note">
              <strong>Antes de se matricular:</strong> confirme endereço, cursos, horários e valores diretamente com cada instituição. O teste do Duolingo é uma certificação online, e a disponibilidade de unidade CCAA em Ribeirão Pires precisa ser confirmada no localizador oficial.
            </p>

            <section className="language-schools-controls" aria-label="Filtros de escolas">
              <label className="language-schools-search">
                <Search size={19} aria-hidden="true" />
                <span className="visually-hidden">Buscar por escola, cidade ou país</span>
                <input
                  type="search"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Buscar escola ou idioma..."
                />
              </label>

              <label className="language-schools-filter">
                <Languages size={18} aria-hidden="true" />
                <span className="visually-hidden">Filtrar por idioma</span>
                <select value={idiomaSelecionado} onChange={(event) => setIdiomaSelecionado(event.target.value)}>
                  {idiomas.map((idioma) => <option key={idioma} value={idioma}>{idioma}</option>)}
                </select>
              </label>
            </section>

            <p className="language-schools-count" aria-live="polite">
              {filtradas.length} {filtradas.length === 1 ? "opção encontrada" : "opções encontradas"}
            </p>

            {filtradas.length > 0 ? (
              <section className="language-schools-grid" aria-label="Escolas e recursos de idiomas em Ribeirão Pires">
                {filtradas.map((escola) => (
                  <article className="language-school-card" key={escola.id}>
                    <div className="language-school-card-top">
                      <img className="language-school-image" src={escola.imagem} alt={`Imagem de ${escola.escola}`} loading="lazy" />
                    </div>
                    <h2>{escola.escola}</h2>
                    <p className="language-school-destination">
                      <MapPin size={16} aria-hidden="true" /> {escola.cidade}
                    </p>
                    <p className="language-school-focus">{escola.destaque}</p>
                    <div className="language-school-meta">
                      <span><BookOpenCheck size={16} aria-hidden="true" /> {escola.modalidade}</span>
                      <span><Clock3 size={16} aria-hidden="true" /> {escola.duracao}</span>
                    </div>
                    <a className="language-school-link" href={escola.url} target="_blank" rel="noreferrer">
                      {escola.acao} <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </section>
            ) : (
              <div className="language-schools-empty" role="status">
                Nenhuma opção encontrada. Tente outro nome de escola ou idioma.
              </div>
            )}
          </>
        ) : (
          <section className="language-exchange-area" aria-labelledby="language-exchange-title">
            <p className="language-schools-notice" role="note">
              <strong>Confira os critérios:</strong> participação, cursos elegíveis, prazos e bolsas dependem do edital vigente e das regras da instituição.
            </p>
            <article className="language-exchange-card">
              <div className="language-exchange-card-content">
                <div className="language-exchange-icon" aria-hidden="true"><GraduationCap size={30} /></div>
                <span className="language-exchange-label">ENSINO TÉCNICO PÚBLICO</span>
                <h2 id="language-exchange-title">ETECs e Fatecs — Centro Paula Souza</h2>
                <p>
                  O Centro Paula Souza oferece o Programa Intercâmbio Cultural para estudantes de ETECs e Fatecs. O programa pode incluir curso intensivo de inglês ou espanhol no exterior, com seleção conforme o edital publicado pela instituição.
                </p>
              </div>
              <div className="language-exchange-actions">
                <div className="language-exchange-details">
                  <span><Plane size={17} aria-hidden="true" /> Curso de idioma no exterior</span>
                  <span><BookOpenCheck size={17} aria-hidden="true" /> Consulte elegibilidade e bolsas no edital</span>
                </div>
                <a className="language-school-link" href="https://www.cps.sp.gov.br/intercambio-cultural/" target="_blank" rel="noreferrer">
                  Conhecer o Intercâmbio Cultural do CPS <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <a className="language-exchange-secondary-link" href="https://arinter.cps.sp.gov.br/editais-abertos/" target="_blank" rel="noreferrer">
                  Consultar editais abertos <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </article>

            <section className="language-exchange-list" aria-labelledby="language-exchange-list-title">
              <div>
                <h2 id="language-exchange-list-title">Mais escolas, faculdades e programas</h2>
                <p>As opções de mobilidade acadêmica das universidades costumam ser exclusivas a alunos matriculados. Confira os requisitos nos canais oficiais.</p>
              </div>
              <div className="language-exchange-grid">
                {escolasIntercambio.map((escola) => (
                  <article className="language-exchange-card language-exchange-list-card" key={escola.id}>
                    <span className="language-exchange-label">{escola.categoria}</span>
                    <h3>{escola.nome}</h3>
                    <p className="language-exchange-location"><MapPin size={15} aria-hidden="true" /> {escola.cidade}</p>
                    <p>{escola.descricao}</p>
                    <a className="language-school-link" href={escola.url} target="_blank" rel="noreferrer">
                      {escola.acao} <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}



