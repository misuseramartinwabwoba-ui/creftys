export type PropertyCategory = 'residential' | 'commercial' | 'land' | 'agricultural' | 'mixed_use';

export type ResidentialType = 'house' | 'bungalow' | 'maisonette' | 'townhouse' | 'villa' | 'apartment' | 'condominium' | 'duplex' | 'studio';
export type CommercialType = 'office' | 'retail_shop' | 'warehouse' | 'industrial' | 'hotel' | 'restaurant' | 'arcade';
export type LandType = 'residential_plot' | 'commercial_plot' | 'agricultural' | 'industrial_plot';

export type PropertyType = ResidentialType | CommercialType | LandType | 'mixed_use';
