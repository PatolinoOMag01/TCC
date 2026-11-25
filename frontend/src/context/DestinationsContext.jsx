/* eslint-disable react-refresh/only-export-components -- Context and public hook. */
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { destinos as catalogoLocal } from "../data/destinos";

const DestinationsContext = createContext(null);

export function DestinationsProvider({ children }) {
  const [destinos, setDestinos] = useState(catalogoLocal);
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    let active = true;
    api.listarDestinos().then(data => {
      if (active) { setDestinos(data); setOffline(false); }
    }).catch(() => { if (active) setOffline(true); });
    return () => { active = false; };
  }, []);
  async function atualizarDestinos() {
    const data = await api.listarDestinos();
    setDestinos(data);
    setOffline(false);
  }
  return <DestinationsContext.Provider value={{ destinos, offline, atualizarDestinos }}>{children}</DestinationsContext.Provider>;
}

export function useDestinations() { return useContext(DestinationsContext); }
