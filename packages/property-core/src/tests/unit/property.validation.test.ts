import { validateProperty } from '../../validation/property.validation';
import type { Property } from '../../entities/property';

test('rejects property with zero price', () => {
  const p = {
    priceUGX: 0,
    parcel: {
      location: { district: 'Kampala' },
      size: { value: 10 }
    }
  } as unknown as Property;

  const errors = validateProperty(p);
  expect(errors).toContain('Price must be greater than 0');
});

test('rejects missing district', () => {
  const p = {
    priceUGX: 1000,
    parcel: {
      location: {},
      size: { value: 10 }
    }
  } as unknown as Property;

  const errors = validateProperty(p);
  expect(errors).toContain('District is required');
});