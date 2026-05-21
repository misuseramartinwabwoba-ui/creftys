export interface PropertySpatial {

  coordinate: {
    lat: number;
    lng: number;
  };

  spatialCellId: string;

  proximity: {
    roadDistanceM?: number;
    powerDistanceM?: number;
    waterDistanceM?: number;
    telecomDistanceM?: number;
  };

  accessibilityScore?: number;
}