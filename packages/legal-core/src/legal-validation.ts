/**
 * LEGAL VALIDATION ENGINE
 */

import {
  hasBlockingCaveat
} from './caveat.engine';

import {
  hasActiveDisputes
} from './dispute.engine';

export function validateLegalSafety(
  disputes: any[],
  caveats: any[]
): boolean {

  return (
    !hasActiveDisputes(disputes) &&
    !hasBlockingCaveat(caveats)
  );
}