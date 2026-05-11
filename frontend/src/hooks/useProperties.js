import { useEffect, useState, useCallback } from "react";
import { getProperties } from "../services/propertyService";

export default function useProperties(initialParams = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetch = useCallback(async (p = params) => {
    setLoading(true);
    setError(null);
    try {
      const items = await getProperties(p);
      setData(items);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(params); }, [fetch, params]);

  return { data, loading, error, params, setParams, refetch: fetch };
}
