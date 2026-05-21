export interface Landmark {
  type:
    | 'road'
    | 'school'
    | 'hospital'
    | 'market'
    | 'fuel_station'
    | 'stage'
    | 'church'
    | 'other';

  name: string;

  distanceMeters?: number;
}