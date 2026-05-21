import type { Parcel } from './parcel';
import type { Title } from './title';
import type {
  PropertyCategory,
  PropertyType
} from '../types/category.types';
import type {
  PropertyStatus,
  VerificationStatus
} from '../types/status.types';

export interface Property {
  id: string;

  category: PropertyCategory;
  type: PropertyType;

  parcel: Parcel;

  title?: Title;

  status: PropertyStatus;
  verification: VerificationStatus;

  priceUGX: number;

  brokerId?: string;

  diasporaEligible: boolean;

  createdAt: Date;
  updatedAt: Date;
}