/**
 * DISPUTE ENGINE
 */

export interface PropertyDispute {
  id: string;

  reason: string;

  active: boolean;

  reportedAt: Date;
}

export function hasActiveDisputes(
  disputes: PropertyDispute[]
): boolean {

  return disputes.some(
    d => d.active
  );
}
