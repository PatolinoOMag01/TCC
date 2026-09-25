/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const FavoritesContext = createContext(null);

const STORAGE_KEY = "interway-favoritos";

export function FavoritesProvider({ children }) {
    const [favoritos, setFavoritos] = useState(() => {
        try {
            const salvos = localStorage.getItem(STORAGE_KEY);
            return salvos ? JSON.parse(salvos) : [];
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
        setFavoritos((atual) => {
            const existe = atual.some(
                (item) => item.slug === destino.slug
            );

            if (existe) {
                return atual.filter(
                    (item) => item.slug !== destino.slug
                );
            }

            return [
                ...atual,
                {
                    slug: destino.slug,
                    pais: destino.pais,
                    cidade: destino.cidade,
                    bandeira: destino.bandeira,
                    imagem: destino.imagem,
                    destaque: destino.destaque,
                    descricao: destino.descricao,
                },
            ];
        });
    }

    function isFavorito(slug) {
        return favoritos.some((item) => item.slug === slug);
    }

    function removerFavorito(slug) {
        setFavoritos((atual) =>
            atual.filter((item) => item.slug !== slug)
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