import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BRANDS, BRAND_ORDER, CATEGORIES, CATEGORY_ORDER } from '@/lib/brands';
import { productsByBrand } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import type { BrandKey, CategoryKey } from '@/lib/types';

export async function generateStaticParams() {
  return BRAND_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = BRANDS[slug as BrandKey];
  if (!b) return { title: 'Not found' };
  return {
    title: `${b.label} — LapizBlue Catalogue`,
    description: b.description,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = BRANDS[slug as BrandKey];
  if (!brand) notFound();

  const products = productsByBrand(slug as BrandKey);
  const byCategory: Partial<Record<CategoryKey, typeof products>> = {};
  products.forEach((p) => {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category]!.push(p);
  });
  const categoryKeys = CATEGORY_ORDER.filter(
    (c) => byCategory[c] && byCategory[c]!.length > 0,
  );

  return (
    <div>
      {/* Header */}
      <section className="border-b hairline">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10">
          <nav className="text-xs text-lapiz-ink/55 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-lapiz-ink">Home</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <Link href="/brands" className="hover:text-lapiz-ink">Brands</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span className="text-lapiz-ink/80">{brand.label}</span>
          </nav>
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold font-display"
                  style={{ background: brand.color }}
                >
                  {brand.name[0]}
                </div>
                <div className="deco-num">— Brand</div>
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-light tracking-tight leading-[1.05]">
                {brand.label}
              </h1>
              <p className="mt-5 text-lapiz-ink/65 leading-relaxed max-w-2xl">{brand.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <span className="chip chip-outline">{brand.origin}</span>
                <a
                  href={brand.gcc_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-lapiz-ink/65 hover:text-lapiz-ink transition-colors"
                >
                  {brand.gcc_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
              </div>
            </div>
            <div className="lg:col-span-4 lg:text-right flex flex-col items-start lg:items-end gap-2">
              <div className="deco-num">— products we carry</div>
              <div className="font-display text-5xl font-light nums">{products.length}</div>
              <div className="text-xs text-lapiz-ink/55">across {categoryKeys.length} categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories jump */}
      <section className="border-b hairline bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="text-xs uppercase tracking-widest text-lapiz-ink/50 font-medium mr-2 shrink-0">Jump to</span>
          {categoryKeys.map((c) => (
            <a
              key={c}
              href={`#${c}`}
              className="px-3 py-1 rounded-full text-xs text-lapiz-ink/70 hover:text-lapiz-ink hover:bg-white transition-colors border hairline bg-white"
            >
              {CATEGORIES[c].shortName}
              <span className="nums text-lapiz-ink/50 ml-1">({byCategory[c]!.length})</span>
            </a>
          ))}
        </div>
      </section>

      {/* Products by category */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {categoryKeys.map((c) => {
          const category = CATEGORIES[c];
          const list = byCategory[c]!;
          return (
            <section key={c} id={c} className="scroll-mt-20">
              <div className="flex items-center justify-between mb-6 pb-3 border-b hairline-soft">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl font-light tracking-tight">{category.name}</h2>
                  <span className="deco-num">— {list.length}</span>
                </div>
                <Link href={`/category/${c}`} className="text-xs text-lapiz-ink/60 hover:text-lapiz-ink flex items-center gap-1">
                  All brands in {category.shortName}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
