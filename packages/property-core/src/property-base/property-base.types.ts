/**
 * CREFTYS / OwnIT UG
 * Canonical Property Base Model
 *
 * Philosophy:
 * - Uganda-first
 * - Spatially aware
 * - Legally enforceable
 * - Diaspora-trust compliant
 * - GIS compatible
 * - Offline broker compatible
 */

export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'LISTED'
  | 'UNDER_OFFER'
  | 'SOLD'
  | 'DISPUTED'
  | 'ARCHIVED';

export type TenureType =
  | 'MAILO'
  | 'FREEHOLD'
  | 'LEASEHOLD'
  | 'CUSTOMARY';

export interface PropertyParcel {
  id: string;

  /**
   * Canonical measurement object
   */
  area: {
    value: number;
    unit: string;
    normalizedSqm: number;
  };

  /**
   * Legacy compatibility
   */
  unit: string;

  /**
   * Flat coordinates
   * Used by maps, search, mobile apps
   */
  latitude: number;
  longitude: number;

  /**
   * GIS-compatible coordinates
   */
  coordinate: {
    lat: number;
    lng: number;
  };
}

export interface PropertyBase {
  id: string;

  title: string;

  district: string;

  brokerId?: string;

  status: PropertyStatus;

  tenure: {
    type: TenureType;
    region?: string;
  };

  parcel: PropertyParcel;

  createdAt: Date;
}