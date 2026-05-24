/**
 * UGANDA PROPERTY LEGAL TYPES
 */

export type UgandaTenureType =
  | 'MAILO'
  | 'FREEHOLD'
  | 'LEASEHOLD'
  | 'CUSTOMARY';

export type OwnershipDocumentType =
  | 'TITLE'
  | 'KIBANJA'
  | 'ENDAGAANO'
  | 'BUSULU_RECEIPT'
  | 'LEASE_AGREEMENT'
  | 'SALE_AGREEMENT';

export interface LegalDocument {
  id: string;

  type: OwnershipDocumentType;

  referenceNumber?: string;

  verified: boolean;

  issuedAt?: Date;
}