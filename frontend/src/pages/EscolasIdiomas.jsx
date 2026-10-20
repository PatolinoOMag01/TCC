import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpenCheck, Clock3, Languages, MapPin, Search } from "lucide-react";

import PageNavigation from "../components/PageNavigation";
import { escolasIdiomas } from "../data/escolasIdiomas";
import "../styles/EscolasIdiomas.css";

export default function EscolasIdiomas() {
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
          <p>Conheça escolas e recursos para estudar idiomas em Ribeirão Pires.</p>
        </header>

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
      </div>
    </main>
  );
}



