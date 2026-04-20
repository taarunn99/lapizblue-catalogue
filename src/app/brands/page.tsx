import Link from 'next/link';
import { BRANDS, BRAND_ORDER, CATEGORIES, CATEGORY_ORDER } from '@/lib/brands';
import { brandStats, productsByBrand } from '@/lib/products';
import type { CategoryKey } from '@/lib/types';

export const metadata = {
  title: 'Brands — LapizBlue Catalogue',
  description: 'Browse all 9 construction chemical brands distributed by LapizBlue in the UAE.',
};

export default function BrandsIndexPage() {
  const stats = brandStats();

  return (
    <div>
      <section className="border-b hairline">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
          <div className="deco-num mb-3">— Brands</div>
          <h1 className="font-display text-5xl lg:text-6xl font-light tracking-tight">
            Nine brands, one catalogue.
          </h1>
          <p className="mt-6 text-lapiz-ink/65 max-w-2xl leading-relaxed">
            Every brand we distribute, with a quick overview of their strengths
            and the categories they cover. Click through to see the full range.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        {BRAND_ORDER.map((key) => {
          const brand = BRANDS[key];
          const count = stats[key] || 0;
          const products = productsByBrand(key);
          const cats = new Set<CategoryKey>(products.map((p) => p.category));
          const categoryList = CATEGORY_ORDER.filter((c) => cats.has(c));

          return (
            <Link
              key={key}
              href={`/brand/${key}`}
              className="card card-hover p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:items-center group"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold font-display text-xl shrink-0"
                style={{ background: brand.color }}
              >
                {brand.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display text-2xl font-light tracking-tight">{brand.label}</h2>
                  <span className="chip chip-outline text-[10px]">{brand.origin}</span>
                </div>
                <p className="text-sm text-lapiz-ink/65 leading-relaxed max-w-2xl mb-3">
                  {brand.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {categoryList.map((c) => (
                    <span key={c} className="text-[11px] text-lapiz-ink/60 px-2 py-0.5 bg-[var(--line-soft)] rounded">
                      {CATEGORIES[c].shortName}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 lg:text-right shrink-0 lg:min-w-[120px]">
                <div>
                  <div className="font-display text-4xl font-light nums">{count}</div>
                  <div className="text-[10px] uppercase tracking-widest text-lapiz-ink/50">products</div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="text-lapiz-ink/30 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
