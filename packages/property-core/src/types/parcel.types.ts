import type { UUID } from '@creftys/shared-types';
import type { Coordinate } from '@creftys/spatial-core';

export interface Parcel {
  id: UUID;
  coordinate: Coordinate;
  areaSqm: number;
  district: string;
  county?: string;
  subcounty?: string;
  village?: string;
}