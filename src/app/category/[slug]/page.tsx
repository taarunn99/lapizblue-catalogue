import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, CATEGORY_ORDER, BRANDS, BRAND_ORDER } from '@/lib/brands';
import { productsByCategory } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import type { CategoryKey, BrandKey } from '@/lib/types';

export async function generateStaticParams() {
  return CATEGORY_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CATEGORIES[slug as CategoryKey];
  if (!c) return { title: 'Not found' };
  return {
    title: `${c.name} — LapizBlue Catalogue`,
    description: c.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = CATEGORIES[slug as CategoryKey];
  if (!category) notFound();

  const products = productsByCategory(slug as CategoryKey);
  const byBrand: Partial<Record<BrandKey, typeof products>> = {};
  products.forEach((p) => {
    if (!byBrand[p.brand]) byBrand[p.brand] = [];
    byBrand[p.brand]!.push(p);
  });
  const brandKeys = BRAND_ORDER.filter((b) => byBrand[b] && byBrand[b]!.length > 0);

  return (
    <div>
      {/* Header */}
      <section className="border-b hairline">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10">
          <nav className="text-xs text-lapiz-ink/55 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-lapiz-ink">Home</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span className="text-lapiz-ink/80">Categories</span>
          </nav>
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="deco-num mb-3">— Category</div>
              <h1 className="font-display text-4xl lg:text-5xl font-light tracking-tight leading-[1.05]">
                {category.name}
              </h1>
              <p className="mt-5 text-lapiz-ink/65 leading-relaxed max-w-2xl">{category.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {category.standards.map((s) => (
                  <span key={s} className="chip chip-outline font-mono text-[11px]">{s}</span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 lg:text-right flex flex-col items-start lg:items-end gap-2">
              <div className="deco-num">— products in this category</div>
              <div className="font-display text-5xl font-light nums">{products.length}</div>
              <div className="text-xs text-lapiz-ink/55">across {brandKeys.length} brands</div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands strip — quick filter */}
      <section className="border-b hairline bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="text-xs uppercase tracking-widest text-lapiz-ink/50 font-medium mr-2 shrink-0">Jump to</span>
          {brandKeys.map((b) => {
            const brand = BRANDS[b];
            return (
              <a
                key={b}
                href={`#${b}`}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-lapiz-ink/70 hover:text-lapiz-ink hover:bg-white transition-colors border hairline bg-white"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: brand.color }} />
                {brand.label}
                <span className="nums text-lapiz-ink/50">({byBrand[b]!.length})</span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Products by brand */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {brandKeys.map((b) => {
          const brand = BRANDS[b];
          const list = byBrand[b]!;
          return (
            <section key={b} id={b} className="scroll-mt-20">
              <div className="flex items-center justify-between mb-6 pb-3 border-b hairline-soft">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: brand.color }} />
                  <h2 className="font-display text-2xl font-light tracking-tight">{brand.label}</h2>
                  <span className="deco-num">— {list.length}</span>
                </div>
                <Link href={`/brand/${b}`} className="text-xs text-lapiz-ink/60 hover:text-lapiz-ink flex items-center gap-1">
                  All {brand.label} products
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

      {/* Other categories */}
      <section className="border-t hairline bg-[var(--surface)] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="deco-num mb-3">— Other categories</div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_ORDER.filter((k) => k !== slug).map((k) => (
              <Link
                key={k}
                href={`/category/${k}`}
                className="px-4 py-2 rounded-full text-sm bg-white border hairline text-lapiz-ink/75 hover:text-lapiz-ink hover:border-[var(--soft)] transition-colors"
              >
                {CATEGORIES[k].name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
