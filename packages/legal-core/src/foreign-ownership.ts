/**
 * FOREIGN OWNERSHIP RULES
 */

import type {
  UgandaTenureType
} from './legal.types';

export function canForeignEntityOwn(
  tenure: UgandaTenureType
): boolean {

  return tenure === 'LEASEHOLD';
}