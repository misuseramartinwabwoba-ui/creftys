import type { UUID } from '@creftys/shared-types';

export interface PropertyRelations {

  agents: {
    hunterId?: UUID;
    closerId?: UUID;
    verifierId?: UUID;
  };

  stakeholders?: {
    lawyerId?: UUID;
    valuerId?: UUID;
    lenderId?: UUID;
  };

  thirdParties?: {
    bankId?: UUID;
    developerId?: UUID;
  };
}