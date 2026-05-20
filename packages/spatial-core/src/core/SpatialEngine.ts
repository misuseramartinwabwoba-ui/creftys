import type {
  Coordinate,
  Bounds,
  CellId,
  CoverageResult,
} from "./types";

export interface SpatialEngine {
  id: string;

  encode(coord: Coordinate): CellId;

  decode(id: CellId): Coordinate;

  getBounds(id: CellId): Bounds;

  neighbors(id: CellId): CellId[];

  polygonToCells(points: Coordinate[]): CoverageResult;

  isValid(id: CellId): boolean;
}