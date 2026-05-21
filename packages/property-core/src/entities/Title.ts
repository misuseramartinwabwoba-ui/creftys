import type { TenureType } from '../types/tenure.types';

export interface Title {
  id: string;

  titleNumber: string;

  tenure: TenureType;

  ownerName: string;
  ownerNIN?: string;

  isVerified: boolean;

  issuedBy: 'MLHUD' | 'BUGANDA_LAND_BOARD' | 'LOCAL_COUNCIL';

  encumbrances?: string[];
}