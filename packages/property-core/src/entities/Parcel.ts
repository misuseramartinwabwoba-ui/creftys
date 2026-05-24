import type { Measurement } from '../types/measurement.types';
import type { Coordinate as Location } from '@creftys/spatial-core';

export interface Parcel {
  id: string;

  location: Location;

  size: Measurement;

  roadAccess: boolean;

  boundaries?: {
    north?: string;
    south?: string;
    east?: string;
    west?: string;
  };
}