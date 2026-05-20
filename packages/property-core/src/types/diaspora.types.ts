import type { Property } from './discriminated-unions.types';

export interface DiasporaEligibility {
  eligible: boolean;
  reasons: string[];
  requiresPowerOfAttorney: boolean;
}

export const checkDiasporaEligibility = (property: Property): DiasporaEligibility => {
  const reasons: string[] = [];
  if (property.verification !== 'title_verified') reasons.push('Title not verified');
  if (!property.title) reasons.push('No title record');
  return {
    eligible: reasons.length === 0 && property.diasporaEligible,
    reasons,
    requiresPowerOfAttorney: true
  };
};
