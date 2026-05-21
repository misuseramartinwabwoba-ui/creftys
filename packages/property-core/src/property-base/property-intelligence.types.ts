export interface PropertyIntelligence {

  trustScore: number;

  fraudRisk: {
    score: number;
    level: 'low' | 'medium' | 'high';
  };

  legalRisk: {
    level: 'low' | 'medium' | 'high';
  };

  marketRisk: {
    level: 'low' | 'medium' | 'high';
  };

  diasporaRating?: number;
}