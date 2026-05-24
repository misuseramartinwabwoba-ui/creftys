import type { PropertyBase } from '../../property-base/property-base.types';

export function createMockProperty(): PropertyBase {
  return {
    id: 'PROP-UG-001',

    title: 'Kira Residential Plot',

    district: 'Wakiso',

    brokerId: 'BROKER-001',

    status: 'LISTED',

    tenure: {
      type: 'MAILO',
      region: 'Buganda'
    },

    parcel: {
      id: 'PARCEL-001',

      area: {
        value: 100,
        unit: 'decimal',
        normalizedSqm: 4046.86
      },

      unit: 'decimal',

      latitude: 0.3476,
      longitude: 32.5825,

      coordinate: {
        lat: 0.3476,
        lng: 32.5825
      }
    },

    createdAt: new Date()
  };
}