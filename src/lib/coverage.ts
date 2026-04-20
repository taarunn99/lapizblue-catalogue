import type { Product } from './types';

/**
 * Parse coverage value like "1.6", "3-6", "0.7-1.7", "~4", "1.2" into a numeric range.
 */
export function parseCoverageValue(value?: string): { min: number; max: number } | null {
  if (!value) return null;
  const cleaned = value.replace(/[~≈]/g, '').trim();
  const rangeMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    return { min, max };
  }
  const singleMatch = cleaned.match(/(\d+(?:\.\d+)?)/);
  if (singleMatch) {
    const v = parseFloat(singleMatch[1]);
    return { min: v, max: v };
  }
  return null;
}

export function parsePackSize(pack?: string): number | null {
  if (!pack) return null;
  const m = pack.match(/(\d+(?:\.\d+)?)\s*(kg|l|litre|liter|ml)/i);
  if (!m) return null;
  const val = parseFloat(m[1]);
  const unit = m[2].toLowerCase();
  // Convert ml to L-equivalent (treat as 1:1 for small-volume calcs)
  if (unit === 'ml') return val / 1000;
  return val;
}

/**
 * Calculate bags/pails required given area in m² and thickness in mm.
 * Returns: { coverageRange, materialNeeded, bagsNeeded, packUnit }
 */
export interface CoverageResult {
  coverageMin: number;      // kg/m² per coat (or per mm thickness, depending on product)
  coverageMax: number;
  coverageUnit: string;
  materialMin: number;      // total kg
  materialMax: number;
  bagsMin: number;          // count of packs
  bagsMax: number;
  packSize: number;
  packUnit: string;
  perMm: boolean;           // whether coverage is kg/m²/mm or kg/m² flat
}

export function calculateCoverage(
  product: Product,
  area: number,
  thicknessMm: number = 1,
): CoverageResult | null {
  if (!product.coverage) return null;
  const range = parseCoverageValue(product.coverage.value);
  if (!range) return null;

  const unit = product.coverage.unit.toLowerCase();
  const perMm = unit.includes('mm') || unit.includes('/mm');

  const factor = perMm ? thicknessMm : 1;
  const materialMin = range.min * area * factor;
  const materialMax = range.max * area * factor;

  // Primary pack
  const pack = product.pack_size?.[0];
  const packVal = parsePackSize(pack);
  const packUnit = pack?.match(/(kg|l|litre|liter|ml|bag|pail|drum|kit|cartridge|sausage)/i)?.[1] || 'bag';
  const packSize = packVal || 25;

  const bagsMin = Math.ceil(materialMin / packSize);
  const bagsMax = Math.ceil(materialMax / packSize);

  return {
    coverageMin: range.min,
    coverageMax: range.max,
    coverageUnit: product.coverage.unit,
    materialMin,
    materialMax,
    bagsMin,
    bagsMax,
    packSize,
    packUnit,
    perMm,
  };
}

export function formatKg(kg: number): string {
  if (kg < 10) return kg.toFixed(1);
  return Math.round(kg).toString();
}
