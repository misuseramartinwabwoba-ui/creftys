// SAFE PUBLIC API SURFACE (PHASE 3 STABILIZATION)

export * from './entities/property';
export { Parcel as ParcelEntity } from './entities/parcel';
export { Title as TitleEntity } from './entities/title';

export * from './identity/property-hash';
export * from './identity/duplicate-detector';

// Export stable type names. Note: `property-base.types` and `services/property.service`
// are intentionally not re-exported here because they are currently empty modules.
export * from './types/parcel.types';
export * from './types/title.types';
