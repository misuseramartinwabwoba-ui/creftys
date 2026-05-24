/**
 * MAILO LAND ENGINE
 */

export interface MailoOwnership {
  registeredOwner: string;

  kibanjaOccupants?: string[];

  busuluRequired: boolean;
}

export function hasKibanjaOccupants(
  ownership: MailoOwnership
): boolean {

  return (
    ownership.kibanjaOccupants !== undefined &&
    ownership.kibanjaOccupants.length > 0
  );
}
