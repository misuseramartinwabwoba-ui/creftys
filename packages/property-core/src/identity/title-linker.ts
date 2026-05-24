/**
 * TITLE LINKER
 *
 * Links:
 * - Mailo titles
 * - Kibanja occupancy
 * - Endagaano agreements
 * - Busulu records
 * - lease documents
 */

export interface LinkedDocument {
  id: string;

  type:
    | 'MAILO_TITLE'
    | 'FREEHOLD_TITLE'
    | 'LEASE'
    | 'KIBANJA'
    | 'ENDAGAANO'
    | 'BUSULU_RECORD';

  referenceNumber?: string;

  issuedBy?: string;

  verified: boolean;
}

export interface PropertyTitleChain {
  propertyId: string;
  documents: LinkedDocument[];
}

export function hasVerifiedOwnershipDocument(
  chain: PropertyTitleChain
): boolean {

  return chain.documents.some(
    d => d.verified
  );
}