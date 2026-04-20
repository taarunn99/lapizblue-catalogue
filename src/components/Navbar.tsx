'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CATEGORIES, CATEGORY_ORDER } from '@/lib/brands';
import SearchButton from './SearchButton';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b hairline">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/lapizblue-logo.png"
            alt="LapizBlue"
            width={120}
            height={30}
            priority
            className="h-7 w-auto"
          />
          <span className="hidden md:inline-block text-[11px] uppercase tracking-[0.18em] text-lapiz-ink/55 font-medium pt-[2px]">
            Catalogue
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5 text-sm">
          {CATEGORY_ORDER.slice(0, 6).map((key) => {
            const c = CATEGORIES[key];
            return (
              <Link
                key={key}
                href={`/category/${key}`}
                className="px-3 py-2 rounded-md text-lapiz-ink/75 hover:text-lapiz-ink hover:bg-[var(--soft-wash)] transition-colors"
              >
                {c.shortName}
              </Link>
            );
          })}
          <div className="relative group">
            <button className="px-3 py-2 rounded-md text-lapiz-ink/75 hover:text-lapiz-ink hover:bg-[var(--soft-wash)] transition-colors flex items-center gap-1">
              More
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div className="absolute right-0 top-full pt-2 hidden group-hover:block min-w-[200px]">
              <div className="bg-white border hairline rounded-lg shadow-card py-1">
                {CATEGORY_ORDER.slice(6).map((key) => (
                  <Link
                    key={key}
                    href={`/category/${key}`}
                    className="block px-4 py-2 text-sm text-lapiz-ink/80 hover:bg-[var(--soft-wash)] hover:text-lapiz-ink"
                  >
                    {CATEGORIES[key].shortName}
                  </Link>
                ))}
                <div className="border-t hairline-soft my-1" />
                <Link href="/brands" className="block px-4 py-2 text-sm text-lapiz-ink/80 hover:bg-[var(--soft-wash)] hover:text-lapiz-ink">
                  All brands
                </Link>
                <Link href="/compare" className="block px-4 py-2 text-sm text-lapiz-ink/80 hover:bg-[var(--soft-wash)] hover:text-lapiz-ink">
                  Compare products
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <SearchButton />
          <button
            className="lg:hidden btn-ghost w-9 h-9 p-0 rounded-md hover:bg-[var(--soft-wash)]"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 6l12 12M18 6L6 18"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t hairline bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 gap-x-4 gap-y-1">
            {CATEGORY_ORDER.map((key) => (
              <Link
                key={key}
                href={`/category/${key}`}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-lapiz-ink/85 hover:text-lapiz-ink"
              >
                {CATEGORIES[key].shortName}
              </Link>
            ))}
            <div className="col-span-2 border-t hairline-soft my-2" />
            <Link href="/brands" onClick={() => setOpen(false)} className="py-2.5 text-sm text-lapiz-ink/85">
              All brands
            </Link>
            <Link href="/compare" onClick={() => setOpen(false)} className="py-2.5 text-sm text-lapiz-ink/85">
              Compare products
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
