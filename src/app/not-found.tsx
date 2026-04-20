import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <div className="deco-num mb-4">— 404</div>
      <h1 className="font-display text-5xl lg:text-6xl font-light tracking-tight mb-6">
        Not in the catalogue.
      </h1>
      <p className="text-lapiz-ink/60 mb-10 leading-relaxed max-w-lg mx-auto">
        The product, brand, or category you're looking for isn't here. It may have been renamed
        or never existed. Try searching, or browse categories.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Back to home
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </Link>
        <Link href="/brands" className="btn btn-secondary">
          Browse brands
        </Link>
      </div>
    </div>
  );
}
