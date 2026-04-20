'use client';

import { useEffect, useRef, useState } from 'react';
import type { Product, BrandMeta } from '@/lib/types';

export default function ShareMenu({ product, brand }: { product: Product; brand: BrandMeta }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const specBits: string[] = [];
  if (product.classification) specBits.push(product.classification.split('(')[0].trim());
  if (product.coverage) specBits.push(`Coverage ${product.coverage.value} ${product.coverage.unit}`);
  if (product.pack_size?.[0]) specBits.push(`Pack ${product.pack_size[0]}`);
  const spec = specBits.length ? `\n${specBits.join(' · ')}` : '';

  const waText = encodeURIComponent(
    `*${product.name}* (${brand.label})${spec}\n\nView details & TDS:\n${pageUrl}\n\n— via LapizBlue Catalogue`,
  );
  const waUrl = `https://wa.me/?text=${waText}`;

  const emailBody = encodeURIComponent(
    `${product.name} (${brand.label})\n${product.classification || ''}\n\n${product.description}\n\nView details & TDS:\n${pageUrl}`,
  );
  const emailUrl = `mailto:?subject=${encodeURIComponent(`${product.name} — ${brand.label}`)}&body=${emailBody}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn btn-secondary w-full text-[13px]"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
        </svg>
        Share
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[220px] bg-white border hairline rounded-lg shadow-card z-20 overflow-hidden">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--soft-wash)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.304-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <div className="flex-1">
              <div className="font-medium">WhatsApp</div>
              <div className="text-xs text-lapiz-ink/50">With specs &amp; link</div>
            </div>
          </a>
          <a
            href={emailUrl}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--soft-wash)] transition-colors border-t hairline-soft"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-lapiz-ink/70">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <div className="flex-1">
              <div className="font-medium">Email</div>
              <div className="text-xs text-lapiz-ink/50">Draft with details</div>
            </div>
          </a>
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--soft-wash)] transition-colors border-t hairline-soft text-left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-lapiz-ink/70">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
            <div className="flex-1">
              <div className="font-medium">{copied ? 'Copied!' : 'Copy link'}</div>
              <div className="text-xs text-lapiz-ink/50">{copied ? 'Ready to paste' : pageUrl.length > 32 ? `${pageUrl.slice(0, 32)}…` : pageUrl}</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
