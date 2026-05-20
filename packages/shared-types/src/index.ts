// packages/shared-types/src/index.ts

export type UUID = string;

export interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}