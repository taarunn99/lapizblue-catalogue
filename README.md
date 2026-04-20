# LapizBlue Catalogue

**Cross-reference catalogue for UAE construction chemicals — 183 products across 9 brands.**

A fast, offline-capable web app for LapizBlue's sales team and showroom staff. When a customer asks *"what's the Weber equivalent of MAPEI Keraflex Maxi S1?"* this app answers in one search.

Built with Next.js 15, React 19, Tailwind CSS, and Fuse.js. Pre-renders all 206 pages at build time — loads instantly, works offline, installable as a PWA.

---

## What's inside

| Brand | Products | Origin |
|---|---|---|
| MAPEI | 61 | Italy |
| Weber (Sodamco Weber) | 38 | France |
| Vetonit / Saveto | 32 | Saudi Arabia |
| Pidilite / Grupo Puma | 26 | India / Spain |
| Laticrete | 10 | USA |
| Kerakoll | 8 | Italy |
| X-Chem | 6 | UAE |
| X-Calibur | 2 | USA |
| **Total** | **183** | |

Across 8 categories: Tile Adhesives, Tile Grouts, Concrete Repair, Waterproofing, Flooring Systems, Primers & Bonding, Sealants & Joints, Specialty Adhesives.

Every product includes classification (C1/C2/TE/S1, CG1/CG2, R/RG, CM), coverage, strength values, pack size, pot life, open time, cure time, colours, certifications, application areas, and a direct link to the brand's official TDS.

---

## Features

- **Instant cross-brand search** — Fuse.js fuzzy search (⌘K / Ctrl+K). Matches by product name, classification, brand, or application.
- **Alternatives engine** — For every product, finds equivalents in other brands using classification tokens (C2TE S1 matches C2TE S1 first, then C2 family, then category-only). Colour-coded: 🟢 direct / 🟡 substitute / 🟠 next-best.
- **Coverage calculator** — Enter site area and thickness, get material required (kg) and bags needed. Handles both flat (kg/m²) and per-mm (kg/m²/mm) coverage formulas.
- **Side-by-side compare** — Up to 3 products. "Differences only" toggle hides matching rows so spec deltas pop.
- **WhatsApp sharing** — One tap. Generates a pre-filled message with product name, classification, coverage, pack size, and URL. Email and copy-link fallbacks included.
- **Offline / PWA** — Installable. Service worker caches pages and static assets. Works without Wi-Fi (TDS PDFs require connection, but the catalogue doesn't).
- **TDS links auto-update** — We link to each brand's official TDS URL rather than re-hosting PDFs. Brands update their datasheets without us needing to sync.
- **Recently viewed** — Persisted via localStorage.

---

## Tech stack

- **Next.js 15** (App Router, React Server Components, static generation)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS 3.4** with custom design tokens
- **Fuse.js 7** for fuzzy search
- **GSAP** installed (currently using native IntersectionObserver for scroll reveals — GSAP available for future animation upgrades)
- **Fonts**: Manrope (body) + Fraunces (display accents), loaded from Google Fonts

Design: refined minimalism — hairline borders, generous whitespace, editorial section marks (001/002/003/004), dotted dividers, tabular numerals for specs. Sister site to lapizblue.com.

---

## Running locally

Prerequisites: Node.js 18.18+ or 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
npm run build
npm start
```

The build generates 206 static pages (183 products + 9 brands + 8 categories + home + brands + compare + 404).

---

## Deploying to Vercel

The repository is ready for Vercel — no config needed.

1. Push this repo to GitHub (or GitLab / Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) → Import the repo.
3. Vercel auto-detects Next.js. Click **Deploy**. Done.

Vercel handles the rest: CDN, HTTPS, preview deploys on every push, edge caching for the static HTML.

Recommended: connect a custom domain like `catalogue.lapizblue.com` in the Vercel project settings.

---

## Project structure

```
lapizblue-catalogue/
├── data/                          # Raw extracted product data (per brand)
│   └── extracted/
│       ├── mapei/products.json
│       ├── weber/products.json
│       ├── laticrete/products.json
│       ├── kerakoll/products.json
│       ├── pidilite/products.json
│       ├── xchem/products.json
│       ├── xcalibur/products.json
│       ├── vetonit/products.json
│       └── all_products.json      # Unified 183-product dataset
├── public/                        # Static assets
│   ├── lapizblue-logo.png
│   ├── manifest.webmanifest       # PWA manifest
│   ├── sw.js                      # Service worker
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── icons/                     # PWA icons (192, 512)
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout, providers, SW registration
│   │   ├── page.tsx               # Home / landing
│   │   ├── globals.css            # Design tokens, component classes
│   │   ├── not-found.tsx
│   │   ├── brand/[slug]/page.tsx  # Per-brand product grids
│   │   ├── brands/page.tsx        # All brands index
│   │   ├── category/[slug]/page.tsx  # Per-category grids (grouped by brand)
│   │   ├── compare/page.tsx       # Side-by-side compare
│   │   └── product/[id]/page.tsx  # Product detail
│   ├── components/
│   │   ├── Navbar.tsx             # Sticky nav, mobile menu
│   │   ├── SearchButton.tsx       # ⌘K modal with Fuse.js
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetailClient.tsx  # Tabs: Specs / Alternatives / Calculator
│   │   ├── CoverageCalculator.tsx
│   │   ├── ShareMenu.tsx          # WhatsApp / email / copy-link
│   │   ├── ComparePageClient.tsx
│   │   ├── CompareTray.tsx        # Bottom compare pill
│   │   ├── OfflineIndicator.tsx
│   │   └── ScrollReveal.tsx
│   ├── lib/
│   │   ├── types.ts               # Product, BrandMeta, CategoryMeta
│   │   ├── brands.ts              # Brand + category metadata
│   │   ├── products.ts            # Loader + alternatives algorithm
│   │   ├── coverage.ts            # Coverage calculator logic
│   │   ├── compare-context.tsx    # Max-3 compare with localStorage
│   │   └── recent.ts              # Recently viewed hook
│   └── data/
│       └── products.json          # Bundled 183-product dataset
├── next.config.mjs
├── package.json
├── tailwind.config.mjs
├── postcss.config.mjs
└── tsconfig.json
```

---

## Alternatives matching algorithm

Each product's `classification` string (e.g. `"C2 TE S1 (EN 12004)"`) is tokenised into:

1. **Main class**: `C1`, `C2`, `CG1`, `CG2`, `R1`, `R2`, `CM`, `RG`, `CT`, etc.
2. **Modifiers**: `TE`, `T`, `E`, `F`, `FT`, `WA`, `S1`, `S2`, `O1P`, `O2P`.

Matching runs in three passes against products in the same category:

- **🟢 Exact** — same main class + same S-modifier (or both without).
- **🟡 Family** — same main class prefix (e.g. both `C2`, but one has `S1` and the other doesn't).
- **🟠 Same category only** — fallback when classifications don't align.

Only one alternative per brand is shown, sorted by match quality. If a customer wants the MAPEI → Weber equivalent, they get the best Weber match, not three different Weber options muddying the answer.

See `src/lib/products.ts` → `findAlternatives()` for the implementation.

---

## Updating product data

1. Edit the relevant `data/extracted/{brand}/products.json` file.
2. Regenerate the unified dataset:

   ```bash
   python3 -c "
   import json
   all_products = {}
   for brand in ['mapei','weber','laticrete','kerakoll','pidilite','xchem','xcalibur','vetonit']:
       with open(f'data/extracted/{brand}/products.json') as f:
           all_products.update(json.load(f))
   json.dump(all_products, open('src/data/products.json', 'w'), indent=2)
   print(f'Wrote {len(all_products)} products')
   "
   ```

3. Redeploy. Vercel picks up the change on the next push.

---

## License

Proprietary. © LapizBlue Trading, Dubai, UAE.

---

## Questions

Email sales@lapizblue.com or visit [lapizblue.com](https://lapizblue.com).
