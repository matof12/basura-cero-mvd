import { useEffect, useState } from "react";
import type { Container } from "../types/index";
import { fetchContainers, fetchDataInfo } from "../services/dataServices";

export function useContainers() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState("");
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [data, info] = await Promise.all([
          fetchContainers(),
          fetchDataInfo(),
        ]);

        setContainers(data);
        setIsRealData(data.length > 0);
        setLastUpdate(info.lastUpdate);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setContainers([]);
        setIsRealData(false);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return {
    containers,
    loading,
    error,
    lastUpdate,
    isRealData,
  };
}
