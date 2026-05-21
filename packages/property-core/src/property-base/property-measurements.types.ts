export type AreaUnit = 'sqft' | 'acre' | 'decimal' | 'hectare' | 'sqm';

export interface Area {
  value: number;
  unit: AreaUnit;
  normalizedSqm: number;
}

export function normalizeArea(value: number, unit: AreaUnit): number {
  const map = { sqft: 0.092903, acre: 4046.86, decimal: 40.4686, hectare: 10000, sqm: 1 };
  return value * map[unit];
}
