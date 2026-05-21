import type { PropertyBase } from '../../property-base';

export const createMockProperty = (): PropertyBase => ({
  id: 'test-123' as any,
  category: 'residential',
  type: 'house',
  parcel: {
    id: 'parcel-1' as any,
    area: { value: 100, unit: 'decimal', normalizedSqm: 4046.86 },
    district: 'Wakiso',
    subcounty: 'Kira',
    parish: 'Kira',
    village: 'Bulindo',
    latitude: 0.397,
    longitude: 32.64,
  },
  status: 'listed',
  verification: 'field_verified',
  tenure: 'mailo',
  priceUGX: 150000000,
  area: { value: 100, unit: 'decimal', normalizedSqm: 4046.86 },
  brokerId: 'broker-1' as any,
  occupancy: { occupants: [], hasDispute: false, controlStatus: 'owner_controlled' },
  endagaanoHistory: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});
