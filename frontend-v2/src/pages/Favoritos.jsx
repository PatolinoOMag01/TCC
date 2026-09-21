import { Link } from "react-router-dom";
import { ArrowRight, Heart, Trash2 } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

export default function Favoritos() {
  const { favoritos, removerFavorito, total } =
    useFavorites();

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
            Seus destinos
          </span>

          <h1
            style={{
              fontSize: "clamp(40px, 7vw, 64px)",
              margin: "12px 0",
              color: "#0b1f33",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <Heart size={40} color="#ef4444" fill="#ef4444" />
            Favoritos
          </h1>

          <p
            style={{
              color: "#607084",
              fontSize: 18,
              maxWidth: 600,
              lineHeight: 1.7,
            }}
          >
            {total === 0
              ? "Você ainda não salvou nenhum destino."
              : `Você tem ${total} destino${total > 1 ? "s" : ""} salvo${total > 1 ? "s" : ""}.`}
          </p>
        </section>

        {total === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "#fff",
              borderRadius: 24,
              boxShadow: "0 18px 50px rgba(24, 55, 90, 0.08)",
            }}
          >
            <Heart
              size={48}
              color="#cbd5e1"
              style={{ marginBottom: 16 }}
            />
            <h2
              style={{
                color: "#0b1f33",
                marginBottom: 8,
              }}
            >
              Nenhum favorito ainda
            </h2>
            <p
              style={{
                color: "#607084",
                marginBottom: 28,
              }}
            >
              Explore os destinos e clique no coração para
              salvar os que você mais gostar.
            </p>
            <Link
              to="/destinos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#173b67",
                color: "#fff",
                textDecoration: "none",
                padding: "14px 22px",
                borderRadius: 14,
                fontWeight: 700,
              }}
            >
              Explorar destinos
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {favoritos.map((destino) => (
              <article
                key={destino.slug}
                style={{
                  overflow: "hidden",
                  borderRadius: 24,
                  background: "#fff",
                  boxShadow:
                    "0 18px 50px rgba(24, 55, 90, 0.08)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: 200,
                    position: "relative",
                  }}
                >
                  <img
                    src={destino.imagem}
                    alt={destino.pais}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removerFavorito(destino.slug)
                    }
                    title="Remover dos favoritos"
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "none",
                      background: "rgba(255,255,255,0.95)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow:
                        "0 4px 12px rgba(0,0,0,0.12)",
                    }}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </button>

                  {destino.destaque && (
                    <span
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        background: "rgba(255,255,255,.9)",
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#173b67",
                      }}
                    >
                      {destino.destaque}
                    </span>
                  )}
                </div>

                <div style={{ padding: 22 }}>
                  <h2
                    style={{
                      margin: "0 0 4px",
                      color: "#0b1f33",
                      fontSize: 24,
                    }}
                  >
                    {destino.bandeira} {destino.pais}
                  </h2>

                  <p
                    style={{
                      color: "#3b82f6",
                      fontWeight: 600,
                      margin: "0 0 12px",
                      fontSize: 14,
                    }}
                  >
                    {destino.cidade}
                  </p>

                  <p
                    style={{
                      color: "#607084",
                      lineHeight: 1.55,
                      margin: "0 0 18px",
                      fontSize: 14,
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
                      color: "#173b67",
                      fontWeight: 700,
                    }}
                  >
                    Ver destino
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}