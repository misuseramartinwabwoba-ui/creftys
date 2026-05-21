import type { Property } from '../entities/property';

export function validateProperty(p: Property): string[] {
  const errors: string[] = [];

  if (!p.priceUGX || p.priceUGX <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (!p.parcel.location.district) {
    errors.push('District is required');
  }

  if (!p.type) {
    errors.push('Property type required');
  }

  if (!p.parcel.size.value || p.parcel.size.value <= 0) {
    errors.push('Parcel size must be valid');
  }

  return errors;
}