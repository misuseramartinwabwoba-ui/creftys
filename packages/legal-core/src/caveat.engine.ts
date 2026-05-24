/**
 * CAVEAT ENGINE
 */

export interface CaveatRecord {
  lodgedBy: string;

  reason: string;

  active: boolean;
}

export function hasBlockingCaveat(
  caveats: CaveatRecord[]
): boolean {

  return caveats.some(
    c => c.active
  );
}
