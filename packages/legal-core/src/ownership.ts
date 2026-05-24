import { TenureType } from "./tenure";

export interface OwnershipRecord {
  propertyId: string;
  ownerId: string;
  tenure: TenureType;
  percentage?: number;
  registeredAt: Date;
}