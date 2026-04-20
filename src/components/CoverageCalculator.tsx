'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { calculateCoverage, formatKg } from '@/lib/coverage';

export default function CoverageCalculator({ product }: { product: Product }) {
  const [area, setArea] = useState<number>(100);
  const [thickness, setThickness] = useState<number>(3);

  const result = useMemo(() => calculateCoverage(product, area, thickness), [product, area, thickness]);

  if (!product.coverage) {
    return (
      <div className="max-w-2xl">
        <div className="deco-num mb-3">— Coverage calculator</div>
        <p className="text-sm text-lapiz-ink/60">
          Coverage data not published for this product. Please check the TDS for application rates.
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      <div>
        <div className="deco-num mb-3">— Coverage calculator</div>
        <p className="text-sm text-lapiz-ink/65 leading-relaxed mb-8 max-w-md">
          Enter site area and thickness to estimate total material and bags required.
          Use as a guide — always verify against substrate condition on-site.
        </p>

        <div className="space-y-6 max-w-md">
          <div>
            <label className="block text-xs uppercase tracking-widest text-lapiz-ink/55 font-medium mb-2">
              Area (m²)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={area}
                onChange={(e) => setArea(parseInt(e.target.value))}
                className="flex-1 accent-[var(--accent)]"
              />
              <input
                type="number"
                min="0.1"
                value={area}
                onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
                className="w-20 px-3 py-2 text-sm text-right border hairline rounded-md nums focus:outline-none focus:border-lapiz-ink"
              />
              <span className="text-sm text-lapiz-ink/55">m²</span>
            </div>
          </div>

          {result?.perMm && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-lapiz-ink/55 font-medium mb-2">
                Thickness (mm)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.5"
                  max="30"
                  step="0.5"
                  value={thickness}
                  onChange={(e) => setThickness(parseFloat(e.target.value))}
                  className="flex-1 accent-[var(--accent)]"
                />
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={thickness}
                  onChange={(e) => setThickness(parseFloat(e.target.value) || 0)}
                  className="w-20 px-3 py-2 text-sm text-right border hairline rounded-md nums focus:outline-none focus:border-lapiz-ink"
                />
                <span className="text-sm text-lapiz-ink/55">mm</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div>
          <div className="card p-6 bg-[var(--surface)]">
            <div className="deco-num mb-3">— Estimate</div>

            <div className="space-y-5">
              <div>
                <div className="text-xs uppercase tracking-widest text-lapiz-ink/55 font-medium mb-1">
                  Total material
                </div>
                <div className="font-display text-4xl font-light nums">
                  {result.materialMin === result.materialMax
                    ? `${formatKg(result.materialMin)}`
                    : `${formatKg(result.materialMin)}–${formatKg(result.materialMax)}`}
                  <span className="text-lg ml-1 text-lapiz-ink/60">kg</span>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-lapiz-ink/55 font-medium mb-1">
                  Bags / units needed
                </div>
                <div className="font-display text-4xl font-light nums">
                  {result.bagsMin === result.bagsMax
                    ? `${result.bagsMin}`
                    : `${result.bagsMin}–${result.bagsMax}`}
                  <span className="text-lg ml-2 text-lapiz-ink/60">× {product.pack_size?.[0] || `${result.packSize} ${result.packUnit}`}</span>
                </div>
              </div>

              <div className="pt-4 border-t hairline-soft grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-lapiz-ink/50 mb-1">Coverage rate</div>
                  <div className="nums">
                    {result.coverageMin === result.coverageMax
                      ? result.coverageMin
                      : `${result.coverageMin}–${result.coverageMax}`}{' '}
                    {result.coverageUnit}
                  </div>
                </div>
                <div>
                  <div className="text-lapiz-ink/50 mb-1">Per-bag coverage</div>
                  <div className="nums">
                    ≈ {Math.round(result.packSize / (result.coverageMax * (result.perMm ? thickness : 1)))} m²
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-lapiz-ink/50 mt-4 leading-relaxed">
            Estimate assumes uniform application. Add 5–10% for waste on irregular substrates,
            cutting, and mix losses. For critical projects, confirm with the project specification.
          </p>
        </div>
      )}
    </div>
  );
}
