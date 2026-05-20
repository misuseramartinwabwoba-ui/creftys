import type { Property } from '../types/discriminated-unions.types';
export const isResidential = (p: Property): p is import('../types/discriminated-unions.types').ResidentialProperty => p.category === 'residential';
