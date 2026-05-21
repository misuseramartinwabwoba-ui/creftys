import type { TenureType } from '../types/tenure.types';

export interface PropertyLegal {

  tenure: TenureType;

  ownership: {
    primaryOwner?: string;

    // 🧠 BUGANDA REALITY LAYER
    kibanjaHolder?: string;
    busuluCollector?: string;

    multipleClaimants: boolean;
  };

  disputeStatus: {
    hasDispute: boolean;
    hasCourtCase: boolean;
    hasCaveat: boolean;
  };

  verification: {
    titleVerified: boolean;
    fieldVerified: boolean;
    surveyVerified: boolean;
  };
}