import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal async loader: runs `fn` on mount (and when deps change),
 * ignores results from stale runs, never throws into render.
 */
export function useAsync<T>(fn: () => Promise<T>, initial: T, deps: unknown[] = []) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const runId = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  const reload = useCallback(async () => {
    const id = ++runId.current;
    setLoading(true);
    setError(null);
    try {
      const result = await run();
      if (id === runId.current) setData(result);
    } catch (e) {
      if (id === runId.current) {
        setError(e as Error);
        setData(initial);
      }
    } finally {
      if (id === runId.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  useEffect(() => {
    reload();
    return () => {
      runId.current++;
    };
  }, [reload]);

  return { data, loading, error, reload };
}
