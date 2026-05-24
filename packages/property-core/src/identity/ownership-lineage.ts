/**
 * OWNERSHIP LINEAGE ENGINE
 *
 * Tracks:
 * - ownership history
 * - transfers
 * - inheritance
 * - disputed transitions
 */

export interface OwnershipRecord {
  ownerId: string;
  ownerName: string;

  acquiredAt: Date;

  releasedAt?: Date;

  acquisitionMethod:
    | 'PURCHASE'
    | 'INHERITANCE'
    | 'GIFT'
    | 'COURT_TRANSFER'
    | 'CUSTOMARY_TRANSFER';

  verified: boolean;
}

export interface OwnershipLineage {
  propertyId: string;
  records: OwnershipRecord[];
}

export function getCurrentOwner(
  lineage: OwnershipLineage
): OwnershipRecord | undefined {

  return lineage.records.find(
    r => !r.releasedAt
  );
}