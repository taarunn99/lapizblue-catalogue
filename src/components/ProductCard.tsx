'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { BRANDS } from '@/lib/brands';
import { useCompare } from '@/lib/compare-context';

export default function ProductCard({ product }: { product: Product }) {
  const { toggle, isCompared, canAdd } = useCompare();
  const compared = isCompared(product.id);
  const brand = BRANDS[product.brand];

  return (
    <div className="card card-hover p-5 flex flex-col h-full group relative">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: brand.color }}
              aria-hidden
            />
            <span className="text-[10px] uppercase tracking-[0.15em] text-lapiz-ink/55 font-medium">
              {brand.label}
            </span>
          </div>
          <h3 className="text-base font-semibold leading-snug text-lapiz-ink group-hover:text-[var(--accent-dark)] transition-colors">
            <Link href={`/product/${product.id}`} className="after:absolute after:inset-0">
              {product.name}
            </Link>
          </h3>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product.id); }}
          disabled={!compared && !canAdd}
          className={`relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all border ${
            compared
              ? 'bg-lapiz-ink text-white border-lapiz-ink'
              : canAdd
              ? 'bg-white text-lapiz-ink/60 border-[var(--line)] hover:border-lapiz-ink hover:text-lapiz-ink'
              : 'bg-white text-lapiz-ink/25 border-[var(--line)] cursor-not-allowed'
          }`}
          aria-label={compared ? 'Remove from compare' : 'Add to compare'}
          title={compared ? 'Remove from compare' : canAdd ? 'Compare' : 'Compare limit is 3'}
        >
          {compared ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          )}
        </button>
      </div>

      {product.classification && (
        <div className="mb-3">
          <span className="inline-block px-2 py-0.5 bg-[var(--soft-wash)] text-[var(--accent-dark)] rounded text-[11px] font-mono">
            {product.classification.split('(')[0].trim()}
          </span>
        </div>
      )}

      <p className="text-sm text-lapiz-ink/65 leading-relaxed line-clamp-3 mb-4 flex-1">
        {product.description}
      </p>

      <div className="flex items-center justify-between gap-3 pt-3 border-t hairline-soft">
        <div className="flex flex-wrap items-center gap-3 text-xs text-lapiz-ink/60 nums">
          {product.coverage && (
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lapiz-ink/40">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
              </svg>
              {product.coverage.value} {product.coverage.unit.replace('kg/m²', 'kg/m²')}
            </span>
          )}
          {product.pack_size?.[0] && (
            <span className="hidden sm:flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lapiz-ink/40">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
              {product.pack_size[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
