import PageNavigation from "../components/PageNavigation";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ArrowRight, Heart } from "lucide-react";
import { useMemo, useState } from "react";

import { destinos, gerarSlugCidade } from "../data/destinos";
import { cidadesExtras } from "../data/cidadesExtras";
import { useFavorites } from "../context/FavoritesContext";

const nomesIdiomas = {
  alemao: "Alemão",
  arabe: "Árabe",
  coreano: "Coreano",
  dinamarques: "Dinamarquês",
  espanhol: "Espanhol",
  finlandes: "Finlandês",
  frances: "Francês",
  grego: "Grego",
  hindi: "Hindi",
  holandes: "Neerlandês",
  hungaro: "Húngaro",
  ingles: "Inglês",
  italiano: "Italiano",
  japones: "Japonês",
  malaio: "Malaio",
  mandarim: "Mandarim",
  noruegues: "Norueguês",
  polones: "Polonês",
  portugues: "Português",
  suaili: "Suaíli",
  sueco: "Sueco",
  tailandes: "Tailandês",
  tcheco: "Tcheco",
  vietnamita: "Vietnamita",
};

const faixasOrcamento = [
  { valor: "1", rotulo: "Até R$ 10 mil" },
  { valor: "2", rotulo: "R$ 10 mil a R$ 20 mil" },
  { valor: "3", rotulo: "R$ 20 mil a R$ 40 mil" },
  { valor: "4", rotulo: "Acima de R$ 40 mil" },
];

function normalizarTexto(valor = "") {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export default function Destinos() {
  const [searchParams] = useSearchParams();
  const [busca, setBusca] = useState(() => searchParams.get("busca") || "");
  const [maisDestinosVisiveis, setMaisDestinosVisiveis] = useState(false);
  const [continenteSelecionado, setContinenteSelecionado] = useState("");
  const [idiomaSelecionado, setIdiomaSelecionado] = useState("");
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState("");
  const { toggleFavorito, isFavorito } = useFavorites();
  const termoBusca = normalizarTexto(busca.trim());
  const continentesDisponiveis = [...new Set(destinos.map((destino) => destino.continente))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  const idiomasDisponiveis = [...new Set(destinos.flatMap((destino) => destino.match?.idiomas || []))]
    .sort((a, b) => (nomesIdiomas[a] || a).localeCompare(nomesIdiomas[b] || b, "pt-BR"));

  const destinosFiltrados = useMemo(() => {
    return destinos.filter((destino) => {
      const textoDestino = normalizarTexto([
        destino.pais,
        destino.cidade,
        destino.continente,
        destino.idioma,
        ...(destino.cidades || []),
      ].join(" "));

      return (!termoBusca || textoDestino.includes(termoBusca))
        && (!continenteSelecionado || destino.continente === continenteSelecionado)
        && (!idiomaSelecionado || destino.match?.idiomas?.includes(idiomaSelecionado))
        && (!orcamentoSelecionado || String(destino.match?.orcamento || "") === orcamentoSelecionado);
    });
  }, [termoBusca, continenteSelecionado, idiomaSelecionado, orcamentoSelecionado]);

  const cidadesVisiveis = cidadesExtras.filter((cidade) => {
    const destino = destinos.find((item) => item.slug === cidade.paisSlug);
    if (!destino) return false;

    const textoCidade = normalizarTexto(`${cidade.nome} ${destino.pais} ${destino.continente} ${destino.idioma}`);
    return (!termoBusca || textoCidade.includes(termoBusca))
      && (!continenteSelecionado || destino.continente === continenteSelecionado)
      && (!idiomaSelecionado || destino.match?.idiomas?.includes(idiomaSelecionado))
      && (!orcamentoSelecionado || String(destino.match?.orcamento || "") === orcamentoSelecionado);
  });

  const filtrosAtivos = Boolean(busca || continenteSelecionado || idiomaSelecionado || orcamentoSelecionado);

  function limparFiltros() {
    setBusca("");
    setContinenteSelecionado("");
    setIdiomaSelecionado("");
    setOrcamentoSelecionado("");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        padding: "40px 20px 80px",
      }}
    >
      <div
        style={{
          width: "min(1180px, 100%)",
          margin: "0 auto",
        }}
      >
        <PageNavigation />

        <section
          style={{
            marginTop: 50,
            marginBottom: 40,
          }}
        >
          <span
            style={{
              color: "var(--accent)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              fontSize: 13,
            }}
          >
            Explore o mundo
          </span>

          <h1
            style={{
              fontSize: "clamp(40px, 7vw, 72px)",
              margin: "12px 0",
              color: "var(--text)",
            }}
          >
            Encontre seu destino.
          </h1>

          <p
            style={{
              color: "var(--muted)",
              fontSize: 18,
              maxWidth: 650,
              lineHeight: 1.7,
            }}
          >
            Conheça destinos para intercâmbio e descubra
            qual combina melhor com seus objetivos.
          </p>
        </section>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "var(--surface)",
            borderRadius: 18,
            padding: "0 18px",
            maxWidth: 520,
            boxShadow: "0 12px 30px rgba(20, 50, 80, 0.08)",
            marginBottom: 40,
          }}
        >
          <Search size={20} color="#607084" />
          <input
            type="text"
            aria-label="Buscar destino por país, cidade ou continente"
            placeholder="Buscar país, cidade ou continente..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              padding: "18px 0",
              fontSize: 16,
              background: "transparent",
            }}
          />
        </div>

        <section
          aria-label="Filtros de destinos"
          style={{ marginTop: -20, marginBottom: 36 }}
        >
          <p style={{ margin: "0 0 14px", color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>
            Faixas indicativas para viagens curtas; passagem, duração, curso e hospedagem podem alterar o custo total.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 14,
            }}
          >
            <label style={{ display: "grid", gap: 7, color: "var(--text)", fontWeight: 700, fontSize: 14 }}>
              Continente
              <select
                aria-label="Filtrar por continente"
                value={continenteSelecionado}
                onChange={(event) => setContinenteSelecionado(event.target.value)}
                style={estiloFiltro}
              >
                <option value="">Todos os continentes</option>
                {continentesDisponiveis.map((continente) => (
                  <option key={continente} value={continente}>{continente}</option>
                ))}
              </select>
            </label>

            <label style={{ display: "grid", gap: 7, color: "var(--text)", fontWeight: 700, fontSize: 14 }}>
              Idioma
              <select
                aria-label="Filtrar por idioma"
                value={idiomaSelecionado}
                onChange={(event) => setIdiomaSelecionado(event.target.value)}
                style={estiloFiltro}
              >
                <option value="">Todos os idiomas</option>
                {idiomasDisponiveis.map((idioma) => (
                  <option key={idioma} value={idioma}>{nomesIdiomas[idioma] || idioma}</option>
                ))}
              </select>
            </label>

            <label style={{ display: "grid", gap: 7, color: "var(--text)", fontWeight: 700, fontSize: 14 }}>
              Faixa de orçamento
              <select
                aria-label="Filtrar por faixa de orçamento"
                value={orcamentoSelecionado}
                onChange={(event) => setOrcamentoSelecionado(event.target.value)}
                style={estiloFiltro}
              >
                <option value="">Qualquer faixa</option>
                {faixasOrcamento.map((faixa) => (
                  <option key={faixa.valor} value={faixa.valor}>{faixa.rotulo}</option>
                ))}
              </select>
            </label>
          </div>

          {filtrosAtivos && (
            <button
              type="button"
              onClick={limparFiltros}
              style={{ marginTop: 12, border: 0, padding: 0, background: "transparent", color: "var(--link)", fontWeight: 700, cursor: "pointer" }}
            >
              Limpar busca e filtros
            </button>
          )}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {destinosFiltrados.map((destino) => {
            const favoritado = isFavorito(destino.slug);

            return (
              <article
                key={destino.slug}
                style={{
                  overflow: "hidden",
                  borderRadius: 24,
                  background: "var(--surface)",
                  boxShadow:
                    "0 18px 50px rgba(24, 55, 90, 0.08)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: 240,
                    position: "relative",
                  }}
                >
                  <img
                    src={destino.imagem}
                    alt={`${destino.pais} - ${destino.cidade}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      top: 18,
                      left: 18,
                      background: "var(--surface)",
                      backdropFilter: "blur(10px)",
                      padding: "8px 12px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--link)",
                    }}
                  >
                    {destino.destaque}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleFavorito(destino)}
                    title={
                      favoritado
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                    }
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      border: "none",
                      background: "var(--surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow:
                        "0 4px 12px rgba(0,0,0,0.12)",
                      transition: "transform 0.15s ease",
                    }}
                  >
                    <Heart
                      size={20}
                      color={favoritado ? "#ef4444" : "#64748b"}
                      fill={favoritado ? "#ef4444" : "none"}
                    />
                  </button>
                </div>

                <div style={{ padding: 24 }}>
                  <span
                    style={{
                      color: "var(--muted)",
                      fontSize: 14,
                    }}
                  >
                    {destino.continente}
                  </span>

                  <h2
                    style={{
                      margin: "7px 0 4px",
                      color: "var(--text)",
                      fontSize: 28,
                    }}
                  >
                    {destino.bandeira} {destino.pais}
                  </h2>

                  <strong
                    style={{
                      color: "var(--accent)",
                      fontSize: 15,
                    }}
                  >
                    {destino.cidade}
                  </strong>
                  <p
                    style={{
                      color: "var(--muted)",
                      lineHeight: 1.6,
                      margin: "16px 0 22px",
                    }}
                  >
                    {destino.descricao}
                  </p>

                  <Link
                    to={`/destinos/${destino.slug}/${gerarSlugCidade(destino.cidade)}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      textDecoration: "none",
                      color: "var(--link)",
                      fontWeight: 700,
                    }}
                  >
                    Ver destino
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        {cidadesVisiveis.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
            <button
              type="button"
              aria-expanded={maisDestinosVisiveis}
              aria-controls="cidades-adicionais"
              onClick={() => setMaisDestinosVisiveis((visivel) => !visivel)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "13px 18px",
                border: "1px solid var(--border)",
                borderRadius: 12,
                color: "var(--link)",
                background: "var(--surface)",
                fontWeight: 700,
                boxShadow: "0 10px 24px rgba(20, 50, 80, .08)",
              }}
            >
              {maisDestinosVisiveis ? "Exibir menos destinos" : `Exibir mais destinos (${cidadesVisiveis.length})`}
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        )}

        {maisDestinosVisiveis && cidadesVisiveis.length > 0 && (
          <section
            id="cidades-adicionais"
            aria-label="Cidades adicionais para intercâmbio"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
              marginTop: 28,
            }}
          >
            {cidadesVisiveis.map((cidade) => {
              const pais = destinos.find((destino) => destino.slug === cidade.paisSlug);
              return (
                <article
                  key={`${cidade.paisSlug}-${cidade.nome}`}
                  style={{ overflow: "hidden", borderRadius: 22, background: "var(--surface)", boxShadow: "0 18px 50px rgba(24,55,90,.1)" }}
                >
                  <img
                    src={cidade.imagem}
                    alt={`${cidade.nome}, ${pais?.pais || ""}`}
                    loading="lazy"
                    style={{ display: "block", width: "100%", height: 210, objectFit: "cover" }}
                  />
                  <div style={{ padding: 22 }}>
                    <span style={{ color: "var(--muted)", fontSize: 13 }}>{pais?.pais} · {pais?.continente}</span>
                    <h2 style={{ margin: "7px 0 10px", color: "var(--text)", fontSize: 25 }}>{cidade.nome}</h2>
                    <p style={{ minHeight: 68, color: "var(--muted)", lineHeight: 1.6, fontSize: 14 }}>{cidade.descricao}</p>
                    <Link
                      to={`/destinos/${cidade.paisSlug}/${gerarSlugCidade(cidade.nome)}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, color: "var(--link)", fontWeight: 700 }}
                    >
                      Conhecer {cidade.nome}<ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {destinosFiltrados.length === 0 && cidadesVisiveis.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              color: "var(--muted)",
            }}
          >
            Nenhum destino encontrado.
          </div>
        )}
      </div>
    </main>
  );
}

const estiloFiltro = {
  width: "100%",
  minHeight: 48,
  padding: "0 14px",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--text)",
  background: "var(--surface)",
  font: "inherit",
  fontWeight: 500,
};
