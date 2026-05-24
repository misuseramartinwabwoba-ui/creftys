/**
 * PARCEL SIGNATURE ENGINE
 *
 * Represents physical land uniqueness.
 * Used heavily in:
 * - overlapping land detection
 * - subdivision intelligence
 * - duplicate uploads
 */

export interface ParcelSignatureInput {
  latitude: number;
  longitude: number;
  areaInSqm: number;
}

export interface ParcelSignature {
  centroid: string;
  areaBand: string;
  signature: string;
}

export function createParcelSignature(
  input: ParcelSignatureInput
): ParcelSignature {

  const latBand = input.latitude.toFixed(4);
  const lngBand = input.longitude.toFixed(4);

  const roundedArea =
    Math.round(input.areaInSqm / 10) * 10;

  return {
    centroid: `${latBand}:${lngBand}`,
    areaBand: `${roundedArea}sqm`,
    signature:
      `${latBand}:${lngBand}:${roundedArea}`
  };
}