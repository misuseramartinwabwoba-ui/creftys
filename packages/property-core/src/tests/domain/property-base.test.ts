import { createMockProperty } from '../fixtures/createMockProperty';

describe('Property Base Integrity', () => {

  it('must always have parcel', () => {
    const property = createMockProperty();

    expect(property.parcel).toBeDefined();
  });

  it('must always have spatial coordinates', () => {
    const property = createMockProperty();

    expect(property.parcel.latitude).toBeDefined();
    expect(property.parcel.longitude).toBeDefined();

    expect(property.parcel.coordinate.lat).toBeDefined();
    expect(property.parcel.coordinate.lng).toBeDefined();
  });

  it('must always have measurement normalization', () => {
    const property = createMockProperty();

    expect(property.parcel.area.normalizedSqm).toBeGreaterThan(0);
  });

  it('must always have broker accountability', () => {
    const property = createMockProperty();

    expect(property.brokerId).toBeDefined();
  });

});