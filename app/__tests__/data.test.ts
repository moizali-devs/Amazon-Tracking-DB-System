import { getProducts, getProductById, getProductsByBrand, getBrands } from "@/lib/data";
import type { Brand } from "@/lib/types";

describe("getProducts", () => {
  it("returns 18 products", () => {
    expect(getProducts()).toHaveLength(18);
  });

  it("every product has required fields", () => {
    for (const p of getProducts()) {
      expect(p.id).toBeTruthy();
      expect(p.brand).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.reviewCount).toBeGreaterThan(0);
      expect(p.overallSentiment).toBeDefined();
      expect(p.aspectScores).toBeDefined();
      expect(p.monthlySentiment).toBeDefined();
      expect(p.topPraisedAspects).toBeDefined();
      expect(p.topCriticizedAspects).toBeDefined();
    }
  });

  it("overall sentiment percentages sum to ~100", () => {
    for (const p of getProducts()) {
      const { positive, neutral, negative } = p.overallSentiment;
      const sum = positive + neutral + negative;
      expect(sum).toBeCloseTo(100, 0);
    }
  });
});

describe("getProductById", () => {
  it("returns the correct product for a known id", () => {
    const all = getProducts();
    const first = all[0];
    expect(getProductById(first.id)).toEqual(first);
  });

  it("returns null for an unknown id", () => {
    expect(getProductById("UNKNOWN_ID")).toBeNull();
  });
});

describe("getProductsByBrand", () => {
  it("returns only products for the given brand", () => {
    const appleProducts = getProductsByBrand("Apple" as Brand);
    expect(appleProducts.length).toBeGreaterThan(0);
    for (const p of appleProducts) {
      expect(p.brand).toBe("Apple");
    }
  });

  it("returns 3 products per brand", () => {
    const brands: Brand[] = ["Apple", "Samsung", "Google", "OnePlus", "Motorola", "Nokia"];
    for (const brand of brands) {
      expect(getProductsByBrand(brand)).toHaveLength(3);
    }
  });
});

describe("getBrands", () => {
  it("returns 6 unique brands", () => {
    const brands = getBrands();
    expect(brands).toHaveLength(6);
    expect(new Set(brands).size).toBe(6);
  });
});
