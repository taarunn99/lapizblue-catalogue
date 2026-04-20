'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface CompareContextValue {
  items: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  toggle: (id: string) => void;
  isCompared: (id: string) => boolean;
  canAdd: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

const STORAGE_KEY = 'lapizblue:compare';
const MAX_COMPARE = 3;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  // Restore from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (id: string) => {
    setItems((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((x) => x !== id));
  };

  const clear = () => setItems([]);

  const toggle = (id: string) => {
    setItems((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const isCompared = (id: string) => items.includes(id);

  return (
    <CompareContext.Provider
      value={{ items, add, remove, clear, toggle, isCompared, canAdd: items.length < MAX_COMPARE }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
