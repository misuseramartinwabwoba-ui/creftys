import type { UUID, Timestamped } from '@creftys/shared-types';
import type { TenureType } from './tenure.types';

export interface Title extends Timestamped {
  id: UUID;
  titleNumber: string;
  tenure: TenureType;
  ownerName: string;
  district: string;
}