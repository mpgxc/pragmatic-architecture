type Plan = {
  planId?: string;
  name: string;
  slug: string;
  isPublic: boolean;
  maxEstablishments: number;
  maxSpotsPerEstablishment: number;
  pricePerAdditionalEstablishment: number;
  pricePerAdditionalSpot: number;
};

type Frequency = 'monthly' | 'yearly';

type Subscription = {
  partnerId: string;
  planId: string;
  subscribedPlan: Plan;
  fullPrice: number;
  frequency: Frequency;
};

export { Subscription, Plan };
