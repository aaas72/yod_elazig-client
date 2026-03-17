"use client";

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

  const fetch_ = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err: any) {
      setError(err?.message || 'An error occurred');
      if (fallbackData !== undefined) setData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { data, isLoading, error, refetch: fetch_ };
}
