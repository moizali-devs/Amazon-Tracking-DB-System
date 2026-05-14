import type { Product, Aspect } from "@/lib/types";

export const ASPECT_LABELS: Record<Aspect, string> = {
  battery:  "Battery",
  camera:   "Camera",
  screen:   "Screen",
  price:    "Price",
  build:    "Build",
  delivery: "Delivery",
};

export const MAX_COMPARE = 3;

export const BRAND_COLORS: Record<string, string> = {
  Apple:    "#a78bfa",
  Samsung:  "#38bdf8",
  Google:   "#4ade80",
  OnePlus:  "#fb923c",
  Motorola: "#f472b6",
  Nokia:    "#facc15",
};

/** Toggle a product id in or out of the selection, capping at MAX_COMPARE. */
export function toggleSelection(ids: string[], id: string): string[] {
  if (ids.includes(id)) return ids.filter((x) => x !== id);
  if (ids.length >= MAX_COMPARE) return ids;
  return [...ids, id];
}

export interface RadarDataPoint {
  aspect: string;
  [productId: string]: string | number;
}

/** Build Recharts-compatible radar data keyed by product id. */
export function buildRadarData(products: Product[]): RadarDataPoint[] {
  const aspects: Aspect[] = ["battery", "camera", "screen", "price", "build", "delivery"];
  return aspects.map((a) => {
    const point: RadarDataPoint = { aspect: ASPECT_LABELS[a] };
    for (const p of products) {
      point[p.id] = p.aspectScores[a]?.positive ?? 0;
    }
    return point;
  });
}

export interface BarDataPoint {
  id:       string;
  name:     string;
  positive: number;
}

/** Build Recharts-compatible bar data for overall positive sentiment. */
export function buildBarData(products: Product[]): BarDataPoint[] {
  return products.map((p) => ({
    id:       p.id,
    name:     p.name.length > 28 ? p.name.slice(0, 28) + "…" : p.name,
    positive: p.overallSentiment.positive,
  }));
}

export const COMPARE_COLORS = ["#818cf8", "#34d399", "#f59e0b"] as const;

export interface BrandAspectDataPoint {
  aspect: string;
  [brand: string]: string | number;
}

/** Aggregate aspect positive-sentiment % by brand, averaged across each brand's products. */
export function buildBrandAspectData(products: Product[]): BrandAspectDataPoint[] {
  const byBrand: Record<string, Product[]> = {};
  for (const p of products) {
    (byBrand[p.brand] ??= []).push(p);
  }
  const aspects: Aspect[] = ["battery", "camera", "screen", "price", "build", "delivery"];
  return aspects.map((a) => {
    const point: BrandAspectDataPoint = { aspect: ASPECT_LABELS[a] };
    for (const [brand, prods] of Object.entries(byBrand)) {
      const scores = prods.map((p) => p.aspectScores[a]?.positive ?? 0);
      point[brand] = Math.round(scores.reduce((sum, v) => sum + v, 0) / scores.length);
    }
    return point;
  });
}

/** Return unique brand names in the order they first appear in the product list. */
export function getBrandsFromProducts(products: Product[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const p of products) {
    if (!seen.has(p.brand)) {
      seen.add(p.brand);
      result.push(p.brand);
    }
  }
  return result;
}
