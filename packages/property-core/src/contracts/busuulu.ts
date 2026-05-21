export interface Busuulu {
  id: string;

  propertyId: string;

  annualRentUGX: number;

  status: 'paid' | 'pending' | 'disputed';

  lastPaymentDate?: Date;
}