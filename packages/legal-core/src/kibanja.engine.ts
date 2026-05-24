/**
 * KIBANJA ENGINE
 */

export interface KibanjaOccupancy {
  occupantName: string;

  occupancyVerified: boolean;

  landlordKnown: boolean;

  annualBusulu?: number;
}

export function isValidKibanjaOccupancy(
  occupancy: KibanjaOccupancy
): boolean {

  return (
    occupancy.occupancyVerified &&
    occupancy.landlordKnown
  );
}
