'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Product, BrandMeta, CategoryMeta } from '@/lib/types';
import type { Alternative } from '@/lib/products';
import { BRANDS } from '@/lib/brands';
import { useCompare } from '@/lib/compare-context';
import { useRecentlyViewed } from '@/lib/recent';
import { zohoBooksSearchUrl } from '@/lib/zoho';
import CoverageCalculator from './CoverageCalculator';
import ShareMenu from './ShareMenu';

type Tab = 'specs' | 'alternatives' | 'calculator';

export default function ProductDetailClient({
  product,
  brand,
  category,
  alternatives,
}: {
  product: Product;
  brand: BrandMeta;
  category: CategoryMeta;
  alternatives: Alternative[];
}) {
  const [tab, setTab] = useState<Tab>('specs');
  const { toggle, isCompared, canAdd } = useCompare();
  const { record } = useRecentlyViewed();
  const compared = isCompared(product.id);

  useEffect(() => { record(product.id); }, [product.id, record]);

  const specs: { label: string; value: React.ReactNode }[] = [];
  if (product.classification) specs.push({ label: 'Classification', value: <span className="font-mono">{product.classification}</span> });
  if (product.coverage) specs.push({ label: 'Coverage', value: `${product.coverage.value} ${product.coverage.unit}${product.coverage.notes ? ` · ${product.coverage.notes}` : ''}` });
  if (product.pack_size?.length) specs.push({ label: 'Pack size', value: product.pack_size.join(' · ') });
  if (product.pot_life) specs.push({ label: 'Pot life', value: product.pot_life });
  if (product.open_time) specs.push({ label: 'Open time', value: product.open_time });
  if (product.cure_time) specs.push({ label: 'Cure time', value: product.cure_time });
  if (product.setting_time) specs.push({ label: 'Setting time', value: product.setting_time });
  if (product.recoat_wait) specs.push({ label: 'Recoat wait', value: product.recoat_wait });
  if (product.tile_wait) specs.push({ label: 'Tile wait', value: product.tile_wait });
  if (product.final_set) specs.push({ label: 'Final set', value: product.final_set });
  if (product.thickness_range) specs.push({ label: 'Thickness range', value: product.thickness_range });
  if (product.thickness_max) specs.push({ label: 'Max thickness', value: product.thickness_max });
  if (product.mix_ratio) specs.push({ label: 'Mix ratio', value: product.mix_ratio });
  if (product.yield) specs.push({ label: 'Yield', value: product.yield });
  if (product.application_temp) specs.push({ label: 'Application temp.', value: product.application_temp });
  if (product.shelf_life) specs.push({ label: 'Shelf life', value: product.shelf_life });
  if (product.colors?.length) specs.push({ label: 'Colours', value: product.colors.join(', ') });
  if (product.movement_capability) specs.push({ label: 'Movement', value: product.movement_capability });
  if (product.elongation_at_break) specs.push({ label: 'Elongation', value: product.elongation_at_break });
  if (product.certified_bars) specs.push({ label: 'Certified bars', value: product.certified_bars });

  // Strength as grouped row
  const strengthEntries: [string, string][] = [];
  if (product.strength) {
    for (const [k, v] of Object.entries(product.strength)) {
      if (v) strengthEntries.push([k.replace(/_/g, ' '), v as string]);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb + header */}
      <section className="border-b hairline">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
          <nav className="text-xs text-lapiz-ink/55 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-lapiz-ink">Home</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <Link href={`/category/${product.category}`} className="hover:text-lapiz-ink">{category.shortName}</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <Link href={`/brand/${product.brand}`} className="hover:text-lapiz-ink">{brand.label}</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span className="text-lapiz-ink/80 truncate">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full" style={{ background: brand.color }} />
                <Link href={`/brand/${product.brand}`} className="text-[11px] uppercase tracking-[0.18em] text-lapiz-ink/60 font-medium hover:text-lapiz-ink">
                  {brand.label}
                </Link>
                <span className="text-lapiz-ink/25">·</span>
                <Link href={`/category/${product.category}`} className="text-[11px] uppercase tracking-[0.18em] text-lapiz-ink/60 font-medium hover:text-lapiz-ink">
                  {category.shortName}
                </Link>
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-light leading-[1.05] tracking-tight">
                {product.name}
              </h1>
              {product.classification && (
                <div className="mt-5">
                  <span className="inline-block px-3 py-1 bg-[var(--soft-wash)] text-[var(--accent-dark)] rounded font-mono text-sm">
                    {product.classification}
                  </span>
                </div>
              )}
              <p className="mt-6 text-[15px] text-lapiz-ink/70 leading-relaxed max-w-2xl">
                {product.description}
              </p>

              {/* Certifications chips */}
              {product.certifications && product.certifications.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {product.certifications.map((c) => (
                    <span key={c} className="chip chip-outline">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[var(--accent)]">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action rail */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <a
                href={product.tds_direct || product.tds_url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  View TDS
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
              </a>

              {product.sds_url && (
                <a
                  href={product.sds_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>
                    </svg>
                    SDS
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
              )}

              <a
                href={zohoBooksSearchUrl(product.name)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                  </svg>
                  View in Zoho Books
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggle(product.id)}
                  disabled={!compared && !canAdd}
                  className={`btn w-full text-[13px] ${
                    compared ? 'btn-primary' : 'btn-secondary'
                  } ${!compared && !canAdd ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {compared ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      In compare
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                      Compare
                    </>
                  )}
                </button>
                <ShareMenu product={product} brand={brand} />
              </div>

              {/* Quick-facts rail */}
              <dl className="mt-4 pt-4 border-t hairline-soft space-y-3 text-sm">
                {product.coverage && (
                  <div className="flex justify-between items-start gap-4">
                    <dt className="text-xs uppercase tracking-widest text-lapiz-ink/50 font-medium pt-0.5">Coverage</dt>
                    <dd className="text-right nums font-medium">{product.coverage.value} {product.coverage.unit}</dd>
                  </div>
                )}
                {product.pack_size?.[0] && (
                  <div className="flex justify-between items-start gap-4">
                    <dt className="text-xs uppercase tracking-widest text-lapiz-ink/50 font-medium pt-0.5">Pack</dt>
                    <dd className="text-right font-medium">{product.pack_size[0]}</dd>
                  </div>
                )}
                {product.pot_life && (
                  <div className="flex justify-between items-start gap-4">
                    <dt className="text-xs uppercase tracking-widest text-lapiz-ink/50 font-medium pt-0.5">Pot life</dt>
                    <dd className="text-right font-medium">{product.pot_life}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-20 bg-white/90 backdrop-blur-md border-b hairline">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-0 -mb-px">
            {(['specs', 'alternatives', 'calculator'] as Tab[]).map((t) => {
              const label = t === 'specs' ? 'Specifications' : t === 'alternatives' ? `Alternatives (${alternatives.length})` : 'Coverage calculator';
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-3.5 text-sm border-b-2 transition-colors ${
                    tab === t
                      ? 'border-lapiz-ink text-lapiz-ink font-medium'
                      : 'border-transparent text-lapiz-ink/55 hover:text-lapiz-ink'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {tab === 'specs' && (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="deco-num mb-3">— Technical data</div>
              {specs.length > 0 ? (
                <table className="spec-table">
                  <tbody>
                    {specs.map((s) => (
                      <tr key={s.label}>
                        <th>{s.label}</th>
                        <td>{s.value}</td>
                      </tr>
                    ))}
                    {strengthEntries.length > 0 && (
                      <tr>
                        <th>Strength</th>
                        <td>
                          <div className="space-y-1">
                            {strengthEntries.map(([k, v]) => (
                              <div key={k} className="flex items-baseline gap-3">
                                <span className="text-lapiz-ink/50 capitalize text-xs min-w-[110px]">{k}</span>
                                <span>{v}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-lapiz-ink/60">No structured specifications available. See TDS for full details.</p>
              )}
            </div>

            <div>
              {product.application_areas && product.application_areas.length > 0 && (
                <div className="mb-8">
                  <div className="deco-num mb-3">— Applications</div>
                  <ul className="space-y-2.5">
                    {product.application_areas.map((a) => (
                      <li key={a} className="flex gap-3 text-sm leading-relaxed">
                        <span className="deco-num pt-1 shrink-0">—</span>
                        <span className="text-lapiz-ink/80">{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {product.pack_size && product.pack_size.length > 1 && (
                <div className="mb-8">
                  <div className="deco-num mb-3">— Pack sizes</div>
                  <ul className="space-y-1.5">
                    {product.pack_size.map((p) => (
                      <li key={p} className="text-sm text-lapiz-ink/80">{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.key_features && product.key_features.length > 0 && (
                <div>
                  <div className="deco-num mb-3">— Key features</div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.key_features.map((f) => (
                      <span key={f} className="chip chip-outline">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'alternatives' && (
          <div>
            <div className="deco-num mb-3">— Cross-brand alternatives</div>
            <div className="mb-6 flex flex-wrap gap-4 text-xs text-lapiz-ink/60">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Direct equivalent</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Good substitute — minor spec difference</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400" /> Same category — verify specs</span>
            </div>

            {alternatives.length === 0 ? (
              <p className="text-sm text-lapiz-ink/60">No cross-brand alternatives in this category.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {alternatives.map((alt) => (
                  <AlternativeCard key={alt.product.id} alt={alt} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'calculator' && <CoverageCalculator product={product} />}
      </div>
    </div>
  );
}

function AlternativeCard({ alt }: { alt: Alternative }) {
  const brand = BRANDS[alt.product.brand];
  const gradeColor =
    alt.grade === 'green' ? 'bg-emerald-500' : alt.grade === 'yellow' ? 'bg-amber-400' : 'bg-orange-400';
  const gradeBorder =
    alt.grade === 'green' ? 'border-l-emerald-500' : alt.grade === 'yellow' ? 'border-l-amber-400' : 'border-l-orange-400';

  return (
    <Link
      href={`/product/${alt.product.id}`}
      className={`card card-hover p-5 block border-l-[3px] ${gradeBorder}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`w-2 h-2 rounded-full ${gradeColor}`} />
            <span className="text-[10px] uppercase tracking-[0.15em] text-lapiz-ink/55 font-medium">
              {brand.label}
            </span>
          </div>
          <h3 className="font-medium text-[15px] leading-tight">{alt.product.name}</h3>
        </div>
        {alt.product.classification && (
          <span className="shrink-0 px-2 py-0.5 bg-[var(--soft-wash)] text-[var(--accent-dark)] rounded text-[10px] font-mono">
            {alt.product.classification.split('(')[0].trim()}
          </span>
        )}
      </div>
      <p className="text-xs text-lapiz-ink/65 mt-2 italic">{alt.reason}</p>
      {alt.product.coverage && (
        <div className="mt-3 pt-3 border-t hairline-soft flex items-center justify-between text-xs">
          <span className="text-lapiz-ink/55">Coverage</span>
          <span className="nums font-medium">{alt.product.coverage.value} {alt.product.coverage.unit}</span>
        </div>
      )}
    </Link>
  );
}
