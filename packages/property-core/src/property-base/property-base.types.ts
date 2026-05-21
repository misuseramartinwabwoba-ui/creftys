export type PropertyStatus = "DRAFT" | "VERIFIED" | "LISTED" | "SOLD";

export interface PropertyBase {
  id: string;
  title: string;
  brokerId?: string;

  parcel: {
    id: string;
    area: number;
    unit: string;
    coordinate: {
      lat: number;
      lng: number;
    };
  };

  tenure: {
    type: "MAILO" | "FREEHOLD" | "LEASEHOLD" | "CUSTOMARY";
    region?: string;
  };

  status: PropertyStatus;

  spatial: {
    accuracy: "LOW" | "MEDIUM" | "HIGH";
    source: "GPS" | "SURVEY" | "ESTIMATED";
  };
}