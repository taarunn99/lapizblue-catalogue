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
 * Handles both spaced ("C2 TE S1") and concatenated ("C2TE", "C2TES1") forms.
 *
 * e.g. "C2 TE S1 (EN 12004)"   -> ["C2", "TE", "S1"]
 *      "C2TE"                  -> ["C2", "TE"]
 *      "C2TES1"                -> ["C2", "TE", "S1"]
 *      "C2F S1"                -> ["C2", "F", "S1"]
 *      "C1 (EN 12004)"         -> ["C1"]
 *      "R2T"                   -> ["R2", "T"]
 *      "CG2 WA"                -> ["CG2", "WA"]
 *      "CG2WAF"                -> ["CG2", "WA", "F"]
 *      "EN 14891 CM O1 P"      -> ["CM", "O1P"]
 */
function extractClassTokens(cls?: string): string[] {
  if (!cls) return [];
  // Strip parentheses content and uppercase
  const up = cls.toUpperCase().replace(/\(.*?\)/g, ' ');
  const tokens: string[] = [];

  // Find main class with prefix-only word boundary (allow letters after, e.g. C2TE)
  // (?<![A-Z0-9]) ensures we don't match middle of another code
  const mainMatch = up.match(/(?<![A-Z0-9])(CG[12]|C[12]|R[12]|CM|RG|CT|D[12]|GP)/);
  if (mainMatch) tokens.push(mainMatch[1]);

  // Strip the main token and parse remaining string for modifiers, code-by-code.
  // Modifiers may appear concatenated (TES1) or spaced (TE S1), in any order.
  let rest = mainMatch
    ? up.slice(0, mainMatch.index!) + ' ' + up.slice(mainMatch.index! + mainMatch[1].length)
    : up;

  // Greedy match of known modifier tokens, longest-first to avoid partials.
  // Codes may concatenate (TES1, FTS1, FES1) or be separated by spaces.
  const modOrder = ['FTE', 'FT', 'TE', 'WA', 'O1P', 'O2P', 'S1', 'S2', 'R3', 'R4', 'R5', 'R6', 'F', 'T', 'E'];
  let progress = true;
  while (progress) {
    progress = false;
    for (const m of modOrder) {
      const idx = rest.indexOf(m);
      if (idx === -1) continue;
      if (!tokens.includes(m)) tokens.push(m);
      rest = rest.slice(0, idx) + ' '.repeat(m.length) + rest.slice(idx + m.length);
      progress = true;
      break;
    }
  }

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
