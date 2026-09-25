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
import { destinos } from "../data/destinos";

function DestinoDetalhes() {
  const { slug } = useParams();

  const destino = destinos.find((item) => item.slug === slug);

  if (!destino) {
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
            url(${destino.imagem})
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
          <span className="destination-detail-tag">{destino.destaque}</span>

          <div className="detail-title">
            <span>{destino.bandeira}</span>
            <h1>{destino.pais}</h1>
          </div>

          <p className="detail-location">
            <MapPin size={18} />
            {destino.cidade}, {destino.continente}
          </p>

          <p className="detail-description">{destino.descricao}</p>

          <button>
            Ver programas disponíveis
            <ArrowRight size={18} />
          </button>
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

          <p>{destino.texto}</p>

          <div className="benefits-grid">
            {destino.beneficios.map((beneficio) => (
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

            <strong>{destino.compatibilidade}%</strong>

            <p>Compatível com seu perfil</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DestinoDetalhes;