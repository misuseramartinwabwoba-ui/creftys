/**
 * PROPERTY HASH ENGINE
 *
 * Generates stable identity hashes for property records.
 * Used for:
 * - duplicate detection
 * - anti-fraud
 * - ownership lineage
 * - sync reconciliation
 */

import crypto from 'crypto';

export interface PropertyHashInput {
  district: string;
  county?: string;
  subcounty?: string;
  parish?: string;
  village?: string;

  latitude: number;
  longitude: number;

  titleNumber?: string;

  sizeInSqm: number;
}

export function generatePropertyHash(
  input: PropertyHashInput
): string {
  const raw = [
    input.district,
    input.county,
    input.subcounty,
    input.parish,
    input.village,
    input.latitude.toFixed(6),
    input.longitude.toFixed(6),
    input.titleNumber ?? 'NO_TITLE',
    input.sizeInSqm.toFixed(2)
  ].join('|');

  return crypto
    .createHash('sha256')
    .update(raw)
    .digest('hex');
}