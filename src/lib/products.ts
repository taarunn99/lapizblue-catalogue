import productsData from '@/data/products.json';
import type { Product, BrandKey, CategoryKey } from './types';

// Raw data — cast once. Safe because we structured it.
export const PRODUCTS: Record<string, Product> = productsData as unknown as Record<string, Product>;

export const ALL_PRODUCTS: Product[] = Object.values(PRODUCTS);

export function productsByBrand(brand: BrandKey): Product[] {
  return ALL_PRODUCTS.filter((p) => p.brand === brand);
}

export function productsByCategory(category: CategoryKey): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === category);
}

export function productsByBrandAndCategory(brand: BrandKey, category: CategoryKey): Product[] {
  return ALL_PRODUCTS.filter((p) => p.brand === brand && p.category === category);
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS[id];
}

/**
 * Alternative substitute grade:
 *   green  = same classification (e.g. C2TE S1 matches C2TE S1)
 *   yellow = same category + same broad class family (e.g. both C2 even if one S1 vs no-S)
 *   orange = same category only
 */
export type AlternativeGrade = 'green' | 'yellow' | 'orange';

export interface Alternative {
  product: Product;
  grade: AlternativeGrade;
  reason: string;
}

/**
 * Extract broad classification family from a classification string.
 * e.g. "C2 TE S1 (EN 12004)"   -> ["C2TE", "S1"]
 *      "C1 (EN 12004)"         -> ["C1"]
 *      "R2 (EN 12004)"         -> ["R2"]
 *      "CG2 W A (EN 13888)"    -> ["CG2WA"]
 *      "EN 14891 CM O1 P"      -> ["CM", "O1P"]
 */
function extractClassTokens(cls?: string): string[] {
  if (!cls) return [];
  // Pull out codes before parentheses/dashes and normalize
  const up = cls.toUpperCase().replace(/\(.*?\)/g, ' ');
  const tokens: string[] = [];
  // Main class: C1/C2/CG1/CG2/R1/R2/CM/RG/CT/D1/D2
  const mainMatch = up.match(/\b(C[12]|CG[12]|R[12]|CM|RG|CT|D[12]|GP)\b/);
  if (mainMatch) tokens.push(mainMatch[1]);
  // Modifiers: TE, T, E, FT, F, WA, S1, S2, O1P, O2P
  const mods = up.match(/\b(F?TE|FT|TE|WA|O[12]P|S[12]|R[23456])\b/g);
  if (mods) mods.forEach((m) => !tokens.includes(m) && tokens.push(m));
  return tokens;
}

function classificationMatchLevel(a?: string, b?: string): 'exact' | 'family' | 'none' {
  const ta = extractClassTokens(a);
  const tb = extractClassTokens(b);
  if (ta.length === 0 || tb.length === 0) return 'none';
  const setA = new Set(ta);
  const setB = new Set(tb);
  // Exact: same main class + same S-modifier
  const mainA = ta[0];
  const mainB = tb[0];
  if (mainA === mainB) {
    const sA = ta.find((t) => /^S[12]$/.test(t));
    const sB = tb.find((t) => /^S[12]$/.test(t));
    if (sA && sB && sA === sB) return 'exact';
    if (!sA && !sB) return 'exact';
    // one has S, other doesn't → still family
    return 'family';
  }
  // Family: same prefix (C1 vs C2 = same C family but different grade)
  if (mainA && mainB && mainA[0] === mainB[0]) return 'family';
  return 'none';
}

export function findAlternatives(product: Product, maxPerBrand = 1): Alternative[] {
  const alternatives: Alternative[] = [];
  const seenBrands = new Set<BrandKey>();

  // Candidate pool: same category, different brand
  const pool = ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.brand !== product.brand,
  );

  // First pass — exact classification matches (green)
  for (const p of pool) {
    if (seenBrands.has(p.brand) && maxPerBrand === 1) continue;
    const level = classificationMatchLevel(product.classification, p.classification);
    if (level === 'exact') {
      alternatives.push({
        product: p,
        grade: 'green',
        reason: product.classification
          ? `Same classification (${product.classification.split('(')[0].trim()})`
          : 'Direct substitute',
      });
      seenBrands.add(p.brand);
    }
  }

  // Second pass — family matches (yellow)
  for (const p of pool) {
    if (seenBrands.has(p.brand)) continue;
    const level = classificationMatchLevel(product.classification, p.classification);
    if (level === 'family') {
      alternatives.push({
        product: p,
        grade: 'yellow',
        reason: 'Same class family, minor spec differences',
      });
      seenBrands.add(p.brand);
    }
  }

  // Third pass — same category only (orange)
  for (const p of pool) {
    if (seenBrands.has(p.brand)) continue;
    alternatives.push({
      product: p,
      grade: 'orange',
      reason: 'Same category — verify specs for your application',
    });
    seenBrands.add(p.brand);
  }

  // Sort: green → yellow → orange, then by brand
  const gradeOrder: Record<AlternativeGrade, number> = { green: 0, yellow: 1, orange: 2 };
  alternatives.sort((a, b) => {
    const g = gradeOrder[a.grade] - gradeOrder[b.grade];
    if (g !== 0) return g;
    return a.product.brand.localeCompare(b.product.brand);
  });

  return alternatives;
}

// Compute alternatives counts by category for landing page stats
export function categoryStats() {
  const out: Record<CategoryKey, number> = {
    'tile-adhesives': 0,
    'tile-grouts': 0,
    'concrete-repair': 0,
    'waterproofing': 0,
    'flooring-systems': 0,
    'primers-bonding': 0,
    'sealants-joints': 0,
    'specialty-adhesives': 0,
  };
  ALL_PRODUCTS.forEach((p) => { out[p.category] += 1; });
  return out;
}

export function brandStats() {
  const out: Partial<Record<BrandKey, number>> = {};
  ALL_PRODUCTS.forEach((p) => {
    out[p.brand] = (out[p.brand] || 0) + 1;
  });
  return out;
}
