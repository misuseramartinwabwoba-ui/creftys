/**
 * TENURE ENGINE
 */

import type {
  UgandaTenureType
} from './legal.types';

export interface TenureProfile {
  type: UgandaTenureType;

  supportsForeignOwnership: boolean;

  requiresBusuluTracking: boolean;

  riskLevel:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH';
}

export function resolveTenureProfile(
  tenure: UgandaTenureType
): TenureProfile {

  switch (tenure) {

    case 'MAILO':
      return {
        type: tenure,
        supportsForeignOwnership: false,
        requiresBusuluTracking: true,
        riskLevel: 'HIGH'
      };

    case 'LEASEHOLD':
      return {
        type: tenure,
        supportsForeignOwnership: true,
        requiresBusuluTracking: false,
        riskLevel: 'MEDIUM'
      };

    case 'FREEHOLD':
      return {
        type: tenure,
        supportsForeignOwnership: false,
        requiresBusuluTracking: false,
        riskLevel: 'LOW'
      };

    default:
      return {
        type: tenure,
        supportsForeignOwnership: false,
        requiresBusuluTracking: false,
        riskLevel: 'HIGH'
      };
  }
}
