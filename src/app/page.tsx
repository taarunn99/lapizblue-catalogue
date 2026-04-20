import Link from 'next/link';
import { CATEGORIES, CATEGORY_ORDER, BRANDS, BRAND_ORDER } from '@/lib/brands';
import { ALL_PRODUCTS, categoryStats, brandStats } from '@/lib/products';

export default function HomePage() {
  const catStats = categoryStats();
  const brStats = brandStats();
  const totalProducts = ALL_PRODUCTS.length;

  return (
    <div>
      {/* Hero */}
      <section className="border-b hairline">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="text-[11px] uppercase tracking-[0.22em] text-lapiz-ink/60 font-medium mb-6 flex items-center gap-3">
                <span className="deco-num">001</span>
                Cross-reference catalogue
              </div>
              <h1 className="font-display text-5xl lg:text-7xl font-light leading-[1.02] tracking-tight text-lapiz-ink">
                Find the <em className="not-italic text-[var(--accent)]">equivalent</em>,<br/>
                in seconds.
              </h1>
              <p className="mt-8 text-lg text-lapiz-ink/65 leading-relaxed max-w-2xl">
                A precise cross-reference of <span className="nums font-medium text-lapiz-ink">{totalProducts}</span> construction chemical
                products across <span className="nums font-medium text-lapiz-ink">9</span> leading brands — built for UAE showrooms and sales teams
                that need to answer "what else have we got?" without leaving the customer waiting.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href="#categories" className="btn btn-primary">
                  Browse by category
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </Link>
                <Link href="/brands" className="btn btn-secondary">
                  Browse by brand
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 lg:border-l hairline lg:pl-8">
              <dl className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-0 lg:divide-y lg:hairline-soft">
                <div className="lg:py-5">
                  <dt className="deco-num mb-1">— products</dt>
                  <dd className="text-3xl font-display font-light nums">{totalProducts}</dd>
                </div>
                <div className="lg:py-5">
                  <dt className="deco-num mb-1">— brands</dt>
                  <dd className="text-3xl font-display font-light nums">9</dd>
                </div>
                <div className="lg:py-5">
                  <dt className="deco-num mb-1">— categories</dt>
                  <dd className="text-3xl font-display font-light nums">8</dd>
                </div>
                <div className="lg:py-5">
                  <dt className="deco-num mb-1">— TDS links</dt>
                  <dd className="text-3xl font-display font-light nums">{totalProducts}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4 reveal">
            <div>
              <div className="deco-num mb-3">— 002 · Categories</div>
              <h2 className="font-display text-3xl lg:text-4xl font-light tracking-tight">
                Eight categories covering the full build
              </h2>
            </div>
            <p className="text-sm text-lapiz-ink/60 max-w-sm">
              Aligned to EN / ISO standards. Each category shows every brand's offering side-by-side.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 reveal">
            {CATEGORY_ORDER.map((key, idx) => {
              const c = CATEGORIES[key];
              const count = catStats[key];
              return (
                <Link
                  key={key}
                  href={`/category/${key}`}
                  className="card card-hover p-5 flex flex-col justify-between min-h-[168px] group"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="text-[var(--accent)]">
                        <path d={c.icon} />
                      </svg>
                      <span className="deco-num">{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="font-medium leading-tight text-[15px]">{c.name}</h3>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t hairline-soft">
                    <span className="text-xs text-lapiz-ink/50 nums">{count} products</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lapiz-ink/30 group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-20 lg:py-24 border-t hairline bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="deco-num mb-3">— 003 · Brands</div>
              <h2 className="font-display text-3xl lg:text-4xl font-light tracking-tight">
                The nine brands we distribute
              </h2>
            </div>
            <Link href="/brands" className="btn btn-ghost text-sm">
              All brands
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {BRAND_ORDER.map((key) => {
              const b = BRANDS[key];
              const count = brStats[key] || 0;
              return (
                <Link
                  key={key}
                  href={`/brand/${key}`}
                  className="card card-hover p-5 bg-white flex items-center gap-4 group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold font-display shrink-0"
                    style={{ background: b.color }}
                  >
                    {b.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[15px]">{b.label}</div>
                    <div className="text-xs text-lapiz-ink/55 nums mt-0.5">
                      {count} products · {b.origin}
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lapiz-ink/30 group-hover:text-lapiz-ink group-hover:translate-x-0.5 transition-all">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use case strip */}
      <section className="py-20 lg:py-24 border-t hairline">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10">
          <div>
            <div className="deco-num mb-3">— 004 · Built for</div>
            <h2 className="font-display text-3xl lg:text-4xl font-light tracking-tight leading-tight">
              Real conversations,<br/> in real showrooms.
            </h2>
          </div>
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="font-display text-3xl font-light text-[var(--accent)] leading-none">—</div>
              <div>
                <h3 className="font-medium mb-1">Instant cross-reference</h3>
                <p className="text-sm text-lapiz-ink/65 leading-relaxed">
                  "MAPEI Keraflex Maxi S1 is out of stock — what's the Weber equivalent?" One search, one answer.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-display text-3xl font-light text-[var(--accent)] leading-none">—</div>
              <div>
                <h3 className="font-medium mb-1">Coverage on every tile</h3>
                <p className="text-sm text-lapiz-ink/65 leading-relaxed">
                  Every product shows coverage in kg/m². Built-in calculator converts site area to bags needed.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-display text-3xl font-light text-[var(--accent)] leading-none">—</div>
              <div>
                <h3 className="font-medium mb-1">Always-fresh TDS</h3>
                <p className="text-sm text-lapiz-ink/65 leading-relaxed">
                  TDS buttons link to each brand's official datasheet. Always current — never stale PDFs.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-display text-3xl font-light text-[var(--accent)] leading-none">—</div>
              <div>
                <h3 className="font-medium mb-1">Works offline</h3>
                <p className="text-sm text-lapiz-ink/65 leading-relaxed">
                  Installable as an app. Data cached locally, so showroom Wi-Fi blackouts don't stop you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
