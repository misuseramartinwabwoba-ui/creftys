/**
 * BUSULU ENGINE
 */

export interface BusuluRecord {
  amount: number;

  paidAt: Date;

  collector: string;

  receiptNumber?: string;
}

export function isBusuluCurrent(
  record: BusuluRecord
): boolean {

  const currentYear =
    new Date().getFullYear();

  return (
    record.paidAt.getFullYear() ===
    currentYear
  );
}
