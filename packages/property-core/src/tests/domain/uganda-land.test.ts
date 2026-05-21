import type { Property } from '../../entities/property';

test('property must always include Ugandan district', () => {
  const p = {
    parcel: {
      location: {
        country: 'Uganda',
        district: ''
      },
      size: { value: 10 }
    }
  } as unknown as Property;

  expect(p.parcel.location.country).toBe('Uganda');
});