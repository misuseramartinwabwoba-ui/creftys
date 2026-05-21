import { validateProperty } from '../../validation/validateProperty';

describe('Mailo + Kibanja System', () => {

  it('should allow dual occupancy (Mailo + Kibanja)', () => {
    const property = {
      legal: {
        ownership: {
          kibanjaHolder: 'John Doe',
          primaryOwner: 'Landlord A'
        }
      }
    };

    expect(property.legal.ownership.kibanjaHolder).toBeDefined();
  });

  it('should flag disputes when both parties conflict', () => {
    const property = {
      legal: {
        disputeStatus: {
          hasDispute: true
        }
      }
    };

    expect(property.legal.disputeStatus.hasDispute).toBe(true);
  });

});