export type PropertyCategory =
  | 'residential'
  | 'commercial'
  | 'land'
  | 'mixed_use';

export type ResidentialType =
  | 'house'
  | 'bungalow'
  | 'maisonette'
  | 'townhouse'
  | 'villa'
  | 'apartment'
  | 'condominium'
  | 'studio';

export type CommercialType =
  | 'office'
  | 'retail_shop'
  | 'warehouse'
  | 'industrial'
  | 'hotel'
  | 'restaurant';

export type LandType =
  | 'residential_plot'
  | 'commercial_plot'
  | 'agricultural'
  | 'industrial_plot';

export type PropertyType =
  | ResidentialType
  | CommercialType
  | LandType
  | 'mixed_use';