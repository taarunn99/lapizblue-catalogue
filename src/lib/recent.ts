'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'lapizblue:recent';
const MAX = 8;

export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) setIds(JSON.parse(s));
    } catch {}
  }, []);

  const record = useCallback((id: string) => {
    setIds((prev) => {
      const filtered = prev.filter((x) => x !== id);
      const next = [id, ...filtered].slice(0, MAX);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { ids, record };
}
