export type MeasurementUnit =
  | 'sqft'
  | 'sqm'
  | 'acre'
  | 'hectare'
  | 'decimal'
  | 'feet';

export interface Measurement {
  value: number;
  unit: MeasurementUnit;
  normalizedSqm: number;
}