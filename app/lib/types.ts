export type SentimentLabel = "positive" | "neutral" | "negative";

export interface SentimentBreakdown {
  positive: number; // percentage 0–100
  neutral:  number;
  negative: number;
}

export interface AspectScore extends SentimentBreakdown {
  mentionCount: number;
}

export interface MonthlyDataPoint extends SentimentBreakdown {
  month:       string; // "YYYY-MM"
  reviewCount: number;
}

export type Aspect = "battery" | "camera" | "screen" | "price" | "build" | "delivery";

export interface Product {
  id:                   string;
  brand:                string;
  name:                 string;
  reviewCount:          number;
  overallSentiment:     SentimentBreakdown;
  aspectScores:         Record<Aspect, AspectScore>;
  monthlySentiment:     MonthlyDataPoint[];
  topPraisedAspects:    Aspect[];
  topCriticizedAspects: Aspect[];
}

export const BRANDS = ["Apple", "Samsung", "Google", "OnePlus", "Motorola", "Nokia"] as const;
export type Brand = (typeof BRANDS)[number];

export const ASPECTS: Aspect[] = ["battery", "camera", "screen", "price", "build", "delivery"];
