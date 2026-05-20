import type { UUID } from '@creftys/shared-types';
import type { Property } from './discriminated-unions.types';

export interface Listing {
  id: UUID;
  propertyId: UUID;
  property: Property;
  listedAt: Date;
  isActive: boolean;
}
