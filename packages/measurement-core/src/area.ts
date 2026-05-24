import { toMeters } from "./units";

export function toSqm(value: number, unit: string): number {
  const meters = toMeters(value, unit as any);
  return meters * meters;
}