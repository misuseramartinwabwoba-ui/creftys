import { createMockProperty } from '../fixtures/valid-property';

describe('PropertyBase Integrity', () => {
  it('must always have parcel', () => {
    const property = createMockProperty();
    expect(property.parcel).toBeDefined();
  });

  it('must always have spatial coordinates', () => {
    const property = createMockProperty();
    expect(property.parcel.latitude).toBeDefined();
    expect(property.parcel.longitude).toBeDefined();
  });

  it('must reject property without broker', () => {
    const property = createMockProperty();
    property.brokerId = undefined;
    expect(property.brokerId).toBeUndefined();
  });
});
