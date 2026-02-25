import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
  fallbackData?: T;
  enabled?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const { fallbackData, enabled = true } = options;
  const [data, setData] = useState<T | null>(fallbackData ?? null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'An error occurred';
      setError(message);
      // Keep fallback data if API fails
      if (fallbackData && !data) {
        setData(fallbackData);
      }
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
