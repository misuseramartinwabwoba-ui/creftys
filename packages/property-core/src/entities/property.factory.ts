import { PropertyBase } from "../property-base/property-base.entity";

/**
 * PROPERTY CORE PRINCIPLE:
 * No raw property objects allowed in system.
 * Everything must be created via factory = controlled truth creation.
 */

export function createMockProperty(): PropertyBase {
  return {
    id: "PROP-001",
    title: "Sample Property",

    status: "DRAFT",

    brokerId: "BROKER-001",

    parcel: {
      id: "PARCEL-001",
      areaSqm: 1200,
      boundary: "mock-boundary"
    },

    spatial: {
      lat: 0.3476,
      lng: 32.5825,
      accuracy: "HIGH"
    },

    tenure: {
      type: "MAILO",
      region: "BUGANDA",
      kibanjaHolder: "KIBANJA-001"
    },

    legal: {
      titleNumber: "UG-ML-001",
      endagaanoRef: "END-2026-001",
      encumbrances: []
    },

    lifecycle: "DRAFT"
  };
}