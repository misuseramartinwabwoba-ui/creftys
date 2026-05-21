export interface Endagaano {
  id: string;

  type: 'sale' | 'family' | 'occupancy' | 'development';

  propertyId: string;

  parties: string[];

  witnesses?: string[];

  terms: string;

  isFormalized: boolean;
}