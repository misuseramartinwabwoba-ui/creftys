import type { PropertyBase } from '../../property-base/property-base.types';

export function createMockProperty(): PropertyBase {
  return {
    id: 'PROP-001',

    title: 'Sample Uganda Property',

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
        value: 1200,
        unit: 'sqm',
        normalizedSqm: 1200
      },

      unit: 'sqm',

      latitude: 0.347596,
      longitude: 32.582520,

      coordinate: {
        lat: 0.347596,
        lng: 32.582520
      }
    },

    createdAt: new Date()
  };
}