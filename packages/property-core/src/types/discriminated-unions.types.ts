import type { PropertyBase } from './property-base.types';
import type { ResidentialType, CommercialType, LandType } from './category.types';

export interface ResidentialProperty extends PropertyBase {
  category: 'residential';
  type: ResidentialType;
  bedrooms: number;
  bathrooms: number;
}

export interface LandProperty extends PropertyBase {
  category: 'land' | 'agricultural';
  type: LandType;
  hasRoadAccess: boolean;
  hasWater: boolean;
  hasElectricity: boolean;
}

export interface CommercialProperty extends PropertyBase {
  category: 'commercial' | 'mixed_use';
  type: CommercialType | 'mixed_use';
  floorAreaSqm: number;
}

export type Property = ResidentialProperty | LandProperty | CommercialProperty;
