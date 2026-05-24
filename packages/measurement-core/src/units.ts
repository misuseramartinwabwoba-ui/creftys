export type LengthUnit = "m" | "ft" | "acre" | "sqm";

export function toMeters(value: number, unit: LengthUnit): number {
  switch (unit) {
    case "m":
      return value;
    case "ft":
      return value * 0.3048;
    case "acre":
      return value * 4046.86;
    case "sqm":
      return value;
    default:
      throw new Error("Unknown unit");
  }
}