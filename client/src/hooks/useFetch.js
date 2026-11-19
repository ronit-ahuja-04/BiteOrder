import { useCallback, useEffect, useState } from 'react';
import { API_BASE } from '../config';
import { getToken } from '../context/AuthContext';

// Custom hook: GET {API_BASE}{path} with loading / error state and a refetch() function.
// Sends the JWT when `auth` is true. Re-runs when `path` or any value in `deps` changes.
// Used by: MyOrdersPage, AdminDashboard.
export default function useFetch(path, { auth = false, deps = [] } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        signal,
        headers: auth ? { Authorization: `Bearer ${getToken()}` } : {},
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `Request failed (${res.status})`);
      setData(json);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, auth, ...deps]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort(); // cleanup: cancel the request if the component unmounts
  }, [load]);

  return { data, loading, error, refetch: () => load() };
}
