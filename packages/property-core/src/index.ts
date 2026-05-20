/**
 * PROPERTY CORE - Canonical Domain Engine
 */

// Types
export * from './types/listing.types';
export * from './types/property.types';
export * from './types/tenure.types';
export * from './types/status.types';
export * from './types/category.types';
export * from './types/rental.types';
export * from './types/title.types';
export * from './types/parcel.types';
export * from './types/property-base.types';
export * from './types/discriminated-unions.types';
export * from './types/diaspora.types';

// Enums
export * from './enums/PropertyStatus';
export * from './enums/PropertyType';

// Core entities
export * from './entities/Title';

// Validation
export * from './validation/validateProperty';
export * from './validation/validateFarmland';
export * from './validation/validateDiaspora';

// Lifecycle
export * from './lifecycle/property.lifecycle';
export * from './lifecycle/property.transitions';

// Guards
export * from './guards/property.guards';
export * from './guards/diaspora.guards';

// Spatial
export * from './spatial/spatial-context';
export * from './spatial/spatial-property-link';

// Mapping
export * from './mappers/property.mapper';
export * from './mappers/diaspora.mapper';

// Rules engines
export * from './residential/residential.rules';
export * from './commercial/commercial.rules';
export * from './land/land.rules';
export * from './rentals/rental.rules';
export * from './fractional/fractional.rules';
export * from './farmland/farmland.rules';
export * from './mixed-use/mixed-use.rules';

// Utilities
export * from './utils/property.utils';
export * from './utils/property-formatters';
export * from './utils/property-filters';
export * from './utils/property-slugs';

// Verticals
export * from './verticals/vertical-mapping';

// Tests (optional dev export guard)
