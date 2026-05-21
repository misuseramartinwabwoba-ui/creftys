import type { PropertyBase } from "../../property-base/property-base.types";

/**
 * PROPERTY CORE PRINCIPLE:
 * A property MUST always represent a legally + spatially valid unit of land or structure
 */
export function createMockProperty(): PropertyBase {
  return {
    id: "PROP-001",
    
    title: "Test Property",

    brokerId: "BROKER-001",

    parcel: {
      id: "PARCEL-001",
      area: 1200,
      unit: "sqm",
      coordinate: {
        lat: 0.3476,
        lng: 32.5825
      }
    },

    tenure: {
      type: "MAILO",
      region: "BUGANDA"
    },

    status: "DRAFT",

    spatial: {
      accuracy: "HIGH",
      source: "SURVEY"
    }
  };
}