export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface CellId {
  value: string;
  engine: string;
}

export interface CoverageResult {
  cells: CellId[];
}