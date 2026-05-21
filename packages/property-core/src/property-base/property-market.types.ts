export interface PropertyMarket {

  priceUGX: number;

  valuation?: {
    estimatedValueUGX: number;
    confidence: number;
    trend: 'rising' | 'stable' | 'falling';
  };

  listingType:
    | 'SALE'
    | 'RENT'
    | 'SHORT_STAY'
    | 'LEASE'
    | 'FRACTIONAL';

  demandLevel?: 'low' | 'medium' | 'high';

  liquidityScore?: number;
}