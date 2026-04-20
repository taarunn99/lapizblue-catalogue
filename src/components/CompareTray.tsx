'use client';

import Link from 'next/link';
import { useCompare } from '@/lib/compare-context';
import { getProduct } from '@/lib/products';

export default function CompareTray() {
  const { items, remove, clear } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="compare-tray">
      <span className="text-xs uppercase tracking-widest opacity-60 font-medium">
        Compare
      </span>
      <div className="flex items-center gap-1.5">
        {items.map((id) => {
          const p = getProduct(id);
          if (!p) return null;
          return (
            <div
              key={id}
              className="flex items-center gap-1.5 bg-white/10 rounded-full pl-3 pr-1 py-1"
            >
              <span className="text-xs font-medium max-w-[140px] truncate">{p.name}</span>
              <button
                onClick={() => remove(id)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/15"
                aria-label={`Remove ${p.name}`}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18"/>
                </svg>
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-1">
        <Link
          href="/compare"
          className="bg-white text-lapiz-ink px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-[var(--soft)] transition-colors"
        >
          Compare →
        </Link>
        <button
          onClick={clear}
          className="px-2 py-1.5 rounded-full text-xs opacity-60 hover:opacity-100 transition-opacity"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
