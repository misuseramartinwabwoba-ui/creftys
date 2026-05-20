import type { Property } from '../types/discriminated-unions.types';
export const validateProperty = (p: Property): string[] => {
  const e: string[] = [];
  if (p.priceUGX <= 0) e.push('Price must be positive');
  if (!p.parcel.district) e.push('District required');
  return e;
};
