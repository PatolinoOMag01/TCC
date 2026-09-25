import { Link } from "react-router-dom";
import { Search, ArrowRight, Heart } from "lucide-react";
import { useMemo, useState } from "react";

import { destinos } from "../data/destinos";
import { useFavorites } from "../context/FavoritesContext";

export default function Destinos() {
  const [busca, setBusca] = useState("");
  const { toggleFavorito, isFavorito } = useFavorites();

  const destinosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return destinos;

    return destinos.filter((destino) => {
      return (
        destino.pais.toLowerCase().includes(termo) ||
        destino.cidade.toLowerCase().includes(termo) ||
        destino.continente.toLowerCase().includes(termo)
      );
    });
  }, [busca]);

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
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "var(--link)",
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
                    to={`/destinos/${destino.slug}`}
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

        {destinosFiltrados.length === 0 && (
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