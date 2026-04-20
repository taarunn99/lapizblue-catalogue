'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useCompare } from '@/lib/compare-context';
import { getProduct } from '@/lib/products';
import { BRANDS, CATEGORIES } from '@/lib/brands';
import type { Product } from '@/lib/types';

type Row = { label: string; key: keyof Product | string; values: (string | null)[] };

function getFieldString(p: Product, key: string): string | null {
  const v = (p as any)[key];
  if (v == null) return null;
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.length ? v.join(', ') : null;
  if (typeof v === 'object') {
    // Coverage, Strength
    if ('value' in v && 'unit' in v) {
      return `${v.value} ${v.unit}${v.notes ? ` (${v.notes})` : ''}`;
    }
    const parts: string[] = [];
    for (const [k, vv] of Object.entries(v)) {
      if (vv) parts.push(`${k.replace(/_/g, ' ')}: ${vv}`);
    }
    return parts.length ? parts.join(' · ') : null;
  }
  return String(v);
}

const FIELD_ORDER: { label: string; key: string }[] = [
  { label: 'Classification', key: 'classification' },
  { label: 'Coverage', key: 'coverage' },
  { label: 'Strength', key: 'strength' },
  { label: 'Pack size', key: 'pack_size' },
  { label: 'Pot life', key: 'pot_life' },
  { label: 'Open time', key: 'open_time' },
  { label: 'Cure time', key: 'cure_time' },
  { label: 'Setting time', key: 'setting_time' },
  { label: 'Recoat wait', key: 'recoat_wait' },
  { label: 'Tile wait', key: 'tile_wait' },
  { label: 'Final set', key: 'final_set' },
  { label: 'Thickness range', key: 'thickness_range' },
  { label: 'Max thickness', key: 'thickness_max' },
  { label: 'Mix ratio', key: 'mix_ratio' },
  { label: 'Yield', key: 'yield' },
  { label: 'Application temp.', key: 'application_temp' },
  { label: 'Shelf life', key: 'shelf_life' },
  { label: 'Colours', key: 'colors' },
  { label: 'Movement', key: 'movement_capability' },
  { label: 'Elongation', key: 'elongation_at_break' },
  { label: 'Joint width', key: 'joint_width' },
  { label: 'Application areas', key: 'application_areas' },
  { label: 'Certifications', key: 'certifications' },
];

export default function ComparePageClient() {
  const { items, remove, clear } = useCompare();
  const [diffOnly, setDiffOnly] = useState(true);

  const products = useMemo(
    () => items.map((id) => getProduct(id)).filter(Boolean) as Product[],
    [items],
  );

  const rows: Row[] = useMemo(() => {
    return FIELD_ORDER.map((f) => ({
      label: f.label,
      key: f.key,
      values: products.map((p) => getFieldString(p, f.key)),
    }));
  }, [products]);

  const visibleRows = useMemo(() => {
    if (!diffOnly || products.length < 2) return rows;
    return rows.filter((r) => {
      const unique = new Set(r.values.map((v) => v || ''));
      return unique.size > 1;
    });
  }, [rows, diffOnly, products.length]);

  if (products.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="deco-num mb-4">— Compare</div>
        <h1 className="font-display text-4xl font-light tracking-tight mb-4">No products to compare yet</h1>
        <p className="text-lapiz-ink/60 mb-8 leading-relaxed">
          Browse any category or product page and tap the <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border hairline text-xs mx-0.5"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg></span> button to add it here. Max 3 at a time.
        </p>
        <Link href="/" className="btn btn-primary inline-flex">
          Start browsing
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="border-b hairline">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="deco-num mb-3">— Comparing {products.length} {products.length === 1 ? 'product' : 'products'}</div>
              <h1 className="font-display text-4xl lg:text-5xl font-light tracking-tight">
                Side-by-side
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-lapiz-ink/75 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={diffOnly}
                  onChange={(e) => setDiffOnly(e.target.checked)}
                  className="accent-[var(--accent)]"
                />
                Differences only
              </label>
              <button
                onClick={clear}
                className="btn btn-ghost text-xs"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky header row with product cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="overflow-x-auto -mx-6 px-6 pb-4">
          <table className="w-full min-w-[720px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-[180px] text-left"></th>
                {products.map((p) => {
                  const brand = BRANDS[p.brand];
                  return (
                    <th key={p.id} className="text-left align-top p-0 pr-4" style={{ width: `${(100 - 18) / products.length}%` }}>
                      <div className="card p-4 h-full">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: brand.color }} />
                              <span className="text-[10px] uppercase tracking-[0.15em] text-lapiz-ink/55 font-medium">{brand.label}</span>
                            </div>
                            <Link href={`/product/${p.id}`} className="text-sm font-semibold leading-tight hover:text-[var(--accent-dark)] block">
                              {p.name}
                            </Link>
                          </div>
                          <button
                            onClick={() => remove(p.id)}
                            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-lapiz-ink/40 hover:text-lapiz-ink hover:bg-[var(--line-soft)]"
                            aria-label="Remove"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
                          </button>
                        </div>
                        <div className="text-[11px] text-lapiz-ink/55 mb-3">
                          {CATEGORIES[p.category].shortName}
                        </div>
                        <a
                          href={p.tds_direct || p.tds_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[var(--accent)] hover:text-[var(--accent-dark)] inline-flex items-center gap-1"
                        >
                          View TDS
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
                        </a>
                      </div>
                    </th>
                  );
                })}
                {/* Fill with empty placeholder cells if fewer than 3 */}
                {Array.from({ length: Math.max(0, 3 - products.length) }).map((_, i) => (
                  <th key={`slot-${i}`} className="p-0 pr-4 align-top" style={{ width: `${(100 - 18) / products.length}%` }}>
                    <Link
                      href="/"
                      className="flex items-center justify-center gap-2 text-xs text-lapiz-ink/40 border border-dashed hairline rounded-[14px] py-6 h-full hover:text-lapiz-ink/70 hover:border-[var(--soft)] transition-colors"
                    >
                      + Add product
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 && (
                <tr>
                  <td colSpan={products.length + 1} className="text-center py-12 text-sm text-lapiz-ink/55">
                    No differences between these products on the tracked fields.
                  </td>
                </tr>
              )}
              {visibleRows.map((r) => {
                const uniqueValues = new Set(r.values.map((v) => v || ''));
                const hasDiff = uniqueValues.size > 1;
                return (
                  <tr key={r.label} className="align-top">
                    <th className="text-left text-xs uppercase tracking-widest text-lapiz-ink/55 font-medium py-4 pr-4 border-b hairline-soft">
                      {r.label}
                    </th>
                    {r.values.map((v, idx) => (
                      <td key={idx} className={`py-4 pr-4 text-sm border-b hairline-soft ${hasDiff ? '' : 'text-lapiz-ink/60'}`}>
                        {v ? (
                          <span className="block max-w-prose leading-relaxed">{v}</span>
                        ) : (
                          <span className="text-lapiz-ink/30">—</span>
                        )}
                      </td>
                    ))}
                    {Array.from({ length: Math.max(0, 3 - products.length) }).map((_, i) => (
                      <td key={`pad-${i}`} className="py-4 border-b hairline-soft" />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
