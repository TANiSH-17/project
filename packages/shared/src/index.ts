export type CampaignSummary = {
  id: string;
  title: string;
  metricType: 'VIEWS' | 'CLICKS' | 'INTERACTIONS' | 'CONVERSIONS';
  ratePerThousand: number; // cents
  budgetRemaining: number; // cents
  currency: string;
};
