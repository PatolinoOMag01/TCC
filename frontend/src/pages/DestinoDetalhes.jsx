import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  Globe2,
  Languages,
  MapPin,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { destinos, gerarSlugCidade } from "../data/destinos";
import { buscarCidadeExtra } from "../data/cidadesExtras";

function DestinoDetalhes() {
  const { slug, cidadeSlug } = useParams();

  const destino = destinos.find((item) => item.slug === slug);
  const cidadeAtual = cidadeSlug
    ? destino?.cidades?.find((cidade) => gerarSlugCidade(cidade) === cidadeSlug)
    : destino?.cidade;
  const detalhesCidade = destino && cidadeAtual
    ? buscarCidadeExtra(destino.slug, cidadeAtual)
    : null;

  if (!destino || !cidadeAtual) {
    return (
      <main className="not-found">
        <div>
          <h1>Destino não encontrado 😭</h1>

          <Link to="/destinos">Voltar para destinos</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="destination-detail-page">
      <section
        className="destination-detail-hero"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(4, 12, 26, 0.94),
              rgba(4, 12, 26, 0.4)
            ),
            url(${detalhesCidade?.imagem || destino.imagem})
          `,
        }}
      >
        <div className="destination-detail-nav">
          <Link to="/destinos">
            <ArrowLeft size={18} />
            Todos os destinos
          </Link>

          <span>INTERWAY</span>
        </div>

        <motion.div
          className="destination-detail-content"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="destination-detail-tag">
            {detalhesCidade?.destaque ? "Destino em destaque" : destino.destaque}
          </span>

          <div className="detail-title">
            <span>{destino.bandeira}</span>
            <h1>{cidadeAtual}</h1>
          </div>

          <p className="detail-location">
            <MapPin size={18} />
            {cidadeAtual}, {destino.pais}, {destino.continente}
          </p>

          {destino.cidades?.length > 1 && (
            <div aria-label="Outras cidades deste país" style={{ marginTop: 20 }}>
              <span style={{ display: "block", marginBottom: 9, color: "rgba(255,255,255,.76)", fontSize: 13 }}>
                Outras cidades para explorar
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {destino.cidades.filter((cidade) => cidade !== cidadeAtual).map((cidade) => (
                  <Link
                    key={cidade}
                    to={`/destinos/${destino.slug}/${gerarSlugCidade(cidade)}`}
                    style={{ padding: "7px 11px", borderRadius: 999, color: "#fff", background: "rgba(255,255,255,.14)", fontSize: 13 }}
                  >
                    {cidade}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <p className="detail-description">
            {detalhesCidade?.descricao || destino.descricao}
          </p>

          <Link to={`/bolsas?busca=${encodeURIComponent(destino.pais)}`} className="destination-programs-link">
            Ver programas disponíveis
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      <section className="destination-info-section">
        <div className="destination-info-main">
          <span className="eyebrow">SOBRE O DESTINO</span>

          <h2>
            Talvez essa seja
            <br />
            a sua próxima história.
          </h2>

          <p>{detalhesCidade?.texto || destino.texto}</p>

          <div className="benefits-grid">
            {(detalhesCidade?.beneficios || destino.beneficios).map((beneficio) => (
              <div key={beneficio} className="benefit-item">
                <div>
                  <Check size={17} />
                </div>

                <span>{beneficio}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="destination-stats">
          <div className="stat-card">
            <Languages size={22} />

            <span>Idioma</span>

            <strong>{destino.idioma}</strong>
          </div>

          <div className="stat-card">
            <Banknote size={22} />

            <span>Moeda</span>

            <strong>{destino.moeda}</strong>
          </div>

          <div className="stat-card">
            <Globe2 size={22} />

            <span>Continente</span>

            <strong>{destino.continente}</strong>
          </div>

          <div className="stat-card highlight-stat">
            <span>InterWay Match</span>

            <Link to="/match">Descobrir compatibilidade</Link>

            <p>Responda ao teste para conhecer seu resultado.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DestinoDetalhes;
