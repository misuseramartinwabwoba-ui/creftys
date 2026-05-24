import type { PropertyStatus } from "./property-base.types";

/**
 * PROPERTY CORE PRINCIPLE:
 * The PropertyBase is the SINGLE source of truth for all real estate data.
 * Nothing outside this entity can define property truth.
 */

export interface PropertyBase {
  id: string;

  title: string;

  status: PropertyStatus;

  brokerId?: string;

  parcel: Parcel;

  tenure: Tenure;

  spatial: Spatial;

  legal?: Legal;

  lifecycle: LifecycleState;
}

/**
 * These are inline domain contracts for now (we will split later cleanly)
 */
export interface Parcel {
  id: string;
  areaSqm: number;
  boundary?: string; // geojson or encoded boundary
}

export interface Spatial {
  lat: number;
  lng: number;
  accuracy: "LOW" | "MEDIUM" | "HIGH";
}

export interface Tenure {
  type: "MAILO" | "FREEHOLD" | "LEASEHOLD" | "CUSTOMARY";
  region?: string;

  /**
   * Uganda-specific: Kibanja / occupancy overlay support
   */
  kibanjaHolder?: string;
}

export interface Legal {
  titleNumber?: string;
  endagaanoRef?: string; // local agreement reference
  encumbrances?: string[];
}

export type LifecycleState =
  | "DRAFT"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "LISTED"
  | "UNDER_OFFER"
  | "SOLD"
  | "ARCHIVED";