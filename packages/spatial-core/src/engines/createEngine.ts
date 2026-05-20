// packages/spatial-core/src/engines/createEngine.ts

import type { SpatialEngine } from "../core/SpatialEngine";

import type {
  Coordinate,
  Bounds,
  CellId,
  CoverageResult,
} from "../core/types";

export function createEngine(type: "utm_v1"): SpatialEngine {
  return {
    id: "utm_v1",

    encode(coord: Coordinate): CellId {
      return {
        value: "TEMP_CELL",
        engine: "utm_v1",
      };
    },

    decode(id: CellId): Coordinate {
      return {
        lat: 0,
        lng: 0,
      };
    },

    getBounds(id: CellId): Bounds {
      return {
        north: 0,
        south: 0,
        east: 0,
        west: 0,
      };
    },

    neighbors(id: CellId): CellId[] {
      return [];
    },

    polygonToCells(points: Coordinate[]): CoverageResult {
      return {
        cells: [],
      };
    },

    isValid(id: CellId): boolean {
      return true;
    },
  };
}