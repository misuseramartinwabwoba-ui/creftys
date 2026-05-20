import type { UUID, Timestamped } from '@creftys/shared-types';
import type { PropertyCategory, PropertyType } from './category.types';
import type { PropertyStatus, VerificationStatus } from './status.types';
import type { Parcel } from './parcel.types';
import type { Title } from './title.types';

export interface PropertyBase extends Timestamped {
  id: UUID;
  category: PropertyCategory;
  type: PropertyType;
  parcel: Parcel;
  title?: Title;
  status: PropertyStatus;
  verification: VerificationStatus;
  priceUGX: number;
  diasporaEligible: boolean;
  brokerId?: UUID;
}
