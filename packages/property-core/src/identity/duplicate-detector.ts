/**
 * DUPLICATE DETECTOR
 *
 * Detects:
 * - duplicate uploads
 * - stolen relistings
 * - broker recycling
 * - conflicting parcel claims
 */

import {
  PropertyFingerprint
} from './property-fingerprint';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  confidence: number;
  reasons: string[];
}

export function detectDuplicateProperty(
  incoming: PropertyFingerprint,
  existing: PropertyFingerprint[]
): DuplicateCheckResult {

  for (const property of existing) {

    if (property.hash === incoming.hash) {
      return {
        isDuplicate: true,
        confidence: 1,
        reasons: ['IDENTICAL_HASH']
      };
    }

    if (
      property.parcelSignature ===
      incoming.parcelSignature
    ) {
      return {
        isDuplicate: true,
        confidence: 0.82,
        reasons: ['MATCHING_PARCEL_SIGNATURE']
      };
    }
  }

  return {
    isDuplicate: false,
    confidence: 0,
    reasons: []
  };
}