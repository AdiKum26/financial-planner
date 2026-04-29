export type RiskCategory = 'Conservative' | 'Balanced' | 'Aggressive';

export type FormData = {
  homeCountry: string;
  amount: number;
  duration: string;
  riskCategory: RiskCategory;
  numRecommendations: number;
  selectedRegions: string[];
};

export type RegionBreakdown = {
  region: string;
  percentage: number;
};

export type PortfolioSummary = {
  expectedReturnLow: number;
  expectedReturnHigh: number;
  riskLevel: RiskCategory;
  diversificationScore: number;
  diversificationLabel: string;
  overallRiskScore: number;
  overallRiskLabel: string;
  regionBreakdown: RegionBreakdown[];
};

export type Holding = {
  rank: number;
  name: string;
  ticker: string;
  allocation: number;
  amount: number;
  categories: string[];
  riskLabel: 'Low' | 'Medium' | 'High';
  liquidity: string;
  returnRange: string;
  riskScore: number;
  description: string;
  geographicExposure: RegionBreakdown[];
  color?: string;
};

export type PortfolioData = {
  summary: PortfolioSummary;
  holdings: Holding[];
};
