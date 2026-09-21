import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  GraduationCap,
  Calendar,
  Percent,
} from "lucide-react";
import { bolsas } from "../data/bolsas";

export default function Bolsas() {
  const [busca, setBusca] = useState("");

  const bolsasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return bolsas;

    return bolsas.filter(
      (bolsa) =>
        bolsa.nome.toLowerCase().includes(termo) ||
        bolsa.pais.toLowerCase().includes(termo) ||
        bolsa.area.toLowerCase().includes(termo) ||
        bolsa.descricao.toLowerCase().includes(termo)
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
            Oportunidades
          </span>

          <h1
            style={{
              fontSize: "clamp(40px, 7vw, 72px)",
              margin: "12px 0",
              color: "#0b1f33",
            }}
          >
            Bolsas de estudo.
          </h1>

          <p
            style={{
              color: "#607084",
              fontSize: 18,
              maxWidth: 650,
              lineHeight: 1.7,
            }}
          >
            Encontre bolsas que podem financiar parte
            ou quase todo o seu intercâmbio.
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
            placeholder="Buscar por nome, país ou área..."
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
          {bolsasFiltradas.map((bolsa) => (
            <article
              key={bolsa.id}
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 28,
                boxShadow: "0 18px 50px rgba(24, 55, 90, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
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
                  <span style={{ fontSize: 28 }}>
                    {bolsa.bandeira}
                  </span>
                  <h2
                    style={{
                      margin: "8px 0 4px",
                      color: "#0b1f33",
                      fontSize: 22,
                    }}
                  >
                    {bolsa.nome}
                  </h2>
                  <p
                    style={{
                      color: "#607084",
                      margin: 0,
                      fontSize: 14,
                    }}
                  >
                    {bolsa.pais} · {bolsa.area}
                  </p>
                </div>

                <span
                  style={{
                    background: "rgba(59, 130, 246, 0.1)",
                    color: "#2563eb",
                    fontWeight: 700,
                    fontSize: 12,
                    padding: "6px 12px",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}
                >
                  {bolsa.destaque}
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
                {bolsa.descricao}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#173b67",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  <Percent size={16} />
                  {bolsa.percentual}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#607084",
                    fontSize: 14,
                  }}
                >
                  <Calendar size={16} />
                  {bolsa.dataInicio.slice(5)} até{" "}
                  {bolsa.dataFim.slice(5)}
                </div>
              </div>

              <div>
                <strong
                  style={{
                    color: "#0b1f33",
                    fontSize: 14,
                  }}
                >
                  Requisitos:
                </strong>
                <ul
                  style={{
                    margin: "8px 0 0",
                    paddingLeft: 18,
                    color: "#607084",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {bolsa.requisitos.map((req) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                style={{
                  marginTop: 8,
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
                <GraduationCap size={18} />
                Quero me candidatar
                <ArrowRight size={16} />
              </button>
            </article>
          ))}
        </section>

        {bolsasFiltradas.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              color: "#607084",
            }}
          >
            Nenhuma bolsa encontrada.
          </div>
        )}
      </div>
    </main>
  );
}