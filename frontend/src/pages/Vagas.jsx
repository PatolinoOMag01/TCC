import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Briefcase,
  MapPin,
  Clock,
  Banknote,
} from "lucide-react";
import { vagas } from "../data/vagas";

export default function Vagas() {
  const [busca, setBusca] = useState("");

  const vagasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return vagas;

    return vagas.filter(
      (vaga) =>
        vaga.titulo.toLowerCase().includes(termo) ||
        vaga.empresa.toLowerCase().includes(termo) ||
        vaga.pais.toLowerCase().includes(termo) ||
        vaga.cidade.toLowerCase().includes(termo) ||
        vaga.area.toLowerCase().includes(termo)
    );
  }, [busca]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px 80px",
      }}
    >
      <div
        style={{
          width: "min(1180px, 100%)",
          margin: "0 auto",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#173b67",
            fontWeight: 600,
          }}
        >
          ← Voltar para início
        </Link>

        <section
          style={{
            marginTop: 50,
            marginBottom: 40,
          }}
        >
          <span
            style={{
              color: "#3b82f6",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              fontSize: 13,
            }}
          >
            Trabalho no exterior
          </span>

          <h1
            style={{
              fontSize: "clamp(40px, 7vw, 72px)",
              margin: "12px 0",
              color: "#0b1f33",
            }}
          >
            Vagas de trabalho.
          </h1>

          <p
            style={{
              color: "#607084",
              fontSize: 18,
              maxWidth: 650,
              lineHeight: 1.7,
            }}
          >
            Oportunidades de emprego e estágio para
            quem quer trabalhar durante o intercâmbio.
          </p>
        </section>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "#fff",
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
            placeholder="Buscar por cargo, cidade ou país..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
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
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {vagasFiltradas.map((vaga) => (
            <article
              key={vaga.id}
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 28,
                boxShadow: "0 18px 50px rgba(24, 55, 90, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div>
                  <span style={{ fontSize: 26 }}>
                    {vaga.bandeira}
                  </span>
                  <h2
                    style={{
                      margin: "8px 0 4px",
                      color: "#0b1f33",
                      fontSize: 22,
                    }}
                  >
                    {vaga.titulo}
                  </h2>
                  <p
                    style={{
                      color: "#607084",
                      margin: 0,
                      fontSize: 14,
                    }}
                  >
                    {vaga.empresa}
                  </p>
                </div>

                <span
                  style={{
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "#059669",
                    fontWeight: 700,
                    fontSize: 12,
                    padding: "6px 12px",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}
                >
                  {vaga.tipo}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 14,
                  color: "#607084",
                  fontSize: 14,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <MapPin size={15} />
                  {vaga.cidade}, {vaga.pais}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Briefcase size={15} />
                  {vaga.area}
                </span>
              </div>

              <p
                style={{
                  color: "#607084",
                  lineHeight: 1.6,
                  margin: 0,
                  flex: 1,
                }}
              >
                {vaga.descricao}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  fontSize: 14,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#173b67",
                    fontWeight: 700,
                  }}
                >
                  <Banknote size={16} />
                  {vaga.salario}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#607084",
                  }}
                >
                  <Clock size={16} />
                  Até {vaga.dataLimite}
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#607084",
                }}
              >
                <strong>Requisitos:</strong> {vaga.requisitos}
                <br />
                <strong>Idioma:</strong> {vaga.idioma}
              </p>

              <button
                type="button"
                style={{
                  marginTop: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "#173b67",
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  padding: "14px 18px",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                Candidatar-se
                <ArrowRight size={16} />
              </button>
            </article>
          ))}
        </section>

        {vagasFiltradas.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              color: "#607084",
            }}
          >
            Nenhuma vaga encontrada.
          </div>
        )}
      </div>
    </main>
  );
}