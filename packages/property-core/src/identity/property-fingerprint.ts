/**
 * PROPERTY FINGERPRINT
 *
 * Master anti-fraud identity object.
 */

import {
  createParcelSignature
} from './parcel-signature';

import {
  generatePropertyHash
} from './property-hash';

export interface PropertyFingerprintInput {
  district: string;
  latitude: number;
  longitude: number;
  sizeInSqm: number;
  titleNumber?: string;
}

export interface PropertyFingerprint {
  hash: string;
  parcelSignature: string;
  createdAt: Date;
}

export function generatePropertyFingerprint(
  input: PropertyFingerprintInput
): PropertyFingerprint {

  const parcel =
    createParcelSignature({
      latitude: input.latitude,
      longitude: input.longitude,
      areaInSqm: input.sizeInSqm
    });

  const hash =
    generatePropertyHash({
      district: input.district,
      latitude: input.latitude,
      longitude: input.longitude,
      sizeInSqm: input.sizeInSqm,
      titleNumber: input.titleNumber
    });

  return {
    hash,
    parcelSignature: parcel.signature,
    createdAt: new Date()
  };
}