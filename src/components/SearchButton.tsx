'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { ALL_PRODUCTS } from '@/lib/products';
import { BRANDS, CATEGORIES } from '@/lib/brands';

export default function SearchButton() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const fuse = useMemo(
    () =>
      new Fuse(ALL_PRODUCTS, {
        keys: [
          { name: 'name', weight: 3 },
          { name: 'brand', weight: 1 },
          { name: 'classification', weight: 2 },
          { name: 'description', weight: 0.5 },
          { name: 'application_areas', weight: 0.75 },
        ],
        threshold: 0.35,
        includeScore: true,
        minMatchCharLength: 2,
      }),
    [],
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 12).map((r) => r.item);
  }, [query, fuse]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-9 px-3 pr-2 rounded-md border hairline text-sm text-lapiz-ink/60 hover:border-[var(--soft)] hover:text-lapiz-ink transition-colors bg-white"
        aria-label="Search"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7"/>
          <path d="M21 21l-4.3-4.3"/>
        </svg>
        <span className="hidden md:inline">Search products</span>
        <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 ml-1 rounded bg-[var(--line-soft)] text-lapiz-ink/50 font-mono">⌘K</kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm flex items-start justify-center pt-[8vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full max-w-xl rounded-2xl shadow-card-hover border hairline overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 h-14 border-b hairline-soft">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lapiz-ink/40">
                <circle cx="11" cy="11" r="7"/>
                <path d="M21 21l-4.3-4.3"/>
              </svg>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by product, classification (e.g. C2TE S1), brand…"
                className="flex-1 outline-none text-[15px] placeholder:text-lapiz-ink/35"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--line-soft)] text-lapiz-ink/50 font-mono">ESC</kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {!query.trim() && (
                <div className="px-5 py-8 text-sm text-lapiz-ink/50 text-center">
                  Start typing — product name, brand, classification, or application.
                </div>
              )}
              {query.trim() && results.length === 0 && (
                <div className="px-5 py-8 text-sm text-lapiz-ink/50 text-center">
                  No products match "{query}".
                </div>
              )}
              {results.length > 0 && (
                <ul>
                  {results.map((p) => (
                    <li key={p.id} className="border-b hairline-soft last:border-b-0">
                      <Link
                        href={`/product/${p.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[var(--soft-wash)] transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] uppercase tracking-widest text-lapiz-ink/50 font-medium">
                              {BRANDS[p.brand].label}
                            </span>
                            {p.classification && (
                              <>
                                <span className="text-lapiz-ink/25">·</span>
                                <span className="text-[10px] font-mono text-lapiz-ink/55">
                                  {p.classification.split('(')[0].trim()}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-sm font-medium truncate">{p.name}</div>
                          <div className="text-xs text-lapiz-ink/50 truncate mt-0.5">
                            {CATEGORIES[p.category].name}
                          </div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lapiz-ink/30 shrink-0">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
