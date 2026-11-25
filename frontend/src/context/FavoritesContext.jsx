/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const FavoritesContext = createContext(null);

const STORAGE_KEY = "interway-favoritos";

function chaveFavorito(item) {
    return item.id || item.slug;
}

export function FavoritesProvider({ children }) {
    const [favoritos, setFavoritos] = useState(() => {
        try {
            const salvos = localStorage.getItem(STORAGE_KEY);
            const itens = salvos ? JSON.parse(salvos) : [];
            return Array.isArray(itens) ? itens.filter((item) => item && typeof item.slug === "string") : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(favoritos)
        );
    }, [favoritos]);

    function toggleFavorito(destino) {
        const id = chaveFavorito(destino);
        setFavoritos((atual) => {
            const existe = atual.some(
                (item) => chaveFavorito(item) === id
            );

            if (existe) {
                return atual.filter(
                    (item) => chaveFavorito(item) !== id
                );
            }

            return [
                ...atual,
                {
                    id,
                    slug: destino.slug,
                    pais: destino.pais,
                    cidade: destino.cidade,
                    cidadeSlug: destino.cidadeSlug || null,
                    bandeira: destino.bandeira,
                    imagem: destino.imagem,
                    destaque: destino.destaque,
                    descricao: destino.descricao,
                },
            ];
        });
    }

    function isFavorito(id) {
        return favoritos.some((item) => chaveFavorito(item) === id);
    }

    function removerFavorito(id) {
        setFavoritos((atual) =>
            atual.filter((item) => chaveFavorito(item) !== id)
        );
    }

    return (
        <FavoritesContext.Provider
            value={{
                favoritos,
                toggleFavorito,
                isFavorito,
                removerFavorito,
                total: favoritos.length,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error(
            "useFavorites precisa estar dentro de FavoritesProvider."
        );
    }

    return context;
}
