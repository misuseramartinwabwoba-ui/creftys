import { normalizeArea } from '../../property-base';

describe('Measurement System', () => {
  it('converts acres to sqm correctly', () => {
    expect(normalizeArea(1, 'acre')).toBeCloseTo(4046.86);
  });
  it('converts decimals to sqm', () => {
    expect(normalizeArea(100, 'decimal')).toBeCloseTo(4046.86);
  });
});
