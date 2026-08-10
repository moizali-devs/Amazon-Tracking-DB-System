import { toggleSelection, buildRadarData, buildBarData, buildBrandAspectData, getBrandsFromProducts, MAX_COMPARE } from "@/lib/compare";
import type { Product } from "@/lib/types";

// Minimal product fixture
function makeProduct(id: string, brand = "TestBrand", positivePct = 70): Product {
  const aspect = { positive: positivePct, neutral: 20, negative: 10, mentionCount: 100 };
  return {
    id,
    brand,
    name: `Product ${id}`,
    reviewCount: 500,
    overallSentiment: { positive: positivePct, neutral: 20, negative: 10 },
    aspectScores: {
      battery:  aspect,
      camera:   aspect,
      screen:   aspect,
      price:    aspect,
      build:    aspect,
      delivery: aspect,
    },
    monthlySentiment:     [],
    topPraisedAspects:    ["battery"],
    topCriticizedAspects: ["price"],
  };
}

describe("toggleSelection", () => {
  it("adds an id when the list is under the cap", () => {
    expect(toggleSelection([], "a")).toEqual(["a"]);
    expect(toggleSelection(["a"], "b")).toEqual(["a", "b"]);
  });

  it("removes an id that is already selected", () => {
    expect(toggleSelection(["a", "b"], "a")).toEqual(["b"]);
  });

  it(`prevents adding a ${MAX_COMPARE + 1}th product - caps at MAX_COMPARE`, () => {
    const full = ["a", "b", "c"];
    expect(full).toHaveLength(MAX_COMPARE);
    const result = toggleSelection(full, "d");
    expect(result).toHaveLength(MAX_COMPARE);
    expect(result).not.toContain("d");
  });
});

describe("buildRadarData", () => {
  it("returns one entry per aspect (6 total)", () => {
    const products = [makeProduct("p1"), makeProduct("p2")];
    const data = buildRadarData(products);
    expect(data).toHaveLength(6);
  });

  it("each entry has an aspect label and a numeric value per product", () => {
    const products = [makeProduct("p1", "A", 80), makeProduct("p2", "B", 60)];
    const data = buildRadarData(products);
    for (const point of data) {
      expect(typeof point.aspect).toBe("string");
      expect(typeof point["p1"]).toBe("number");
      expect(typeof point["p2"]).toBe("number");
    }
  });

  it("values match the product aspect scores", () => {
    const p = makeProduct("solo", "X", 75);
    const data = buildRadarData([p]);
    for (const point of data) {
      expect(point["solo"]).toBe(75);
    }
  });
});

describe("buildBarData", () => {
  it("returns one entry per product", () => {
    const products = [makeProduct("p1"), makeProduct("p2"), makeProduct("p3")];
    expect(buildBarData(products)).toHaveLength(3);
  });

  it("each entry has id, name, and positive percentage", () => {
    const p = makeProduct("abc", "Brand", 65);
    const [entry] = buildBarData([p]);
    expect(entry.id).toBe("abc");
    expect(typeof entry.name).toBe("string");
    expect(entry.positive).toBe(65);
  });
});

describe("buildBrandAspectData", () => {
  it("returns 6 data points (one per aspect)", () => {
    const products = [makeProduct("p1", "Apple"), makeProduct("p2", "Samsung")];
    expect(buildBrandAspectData(products)).toHaveLength(6);
  });

  it("each point has an aspect label and a numeric score per brand", () => {
    const products = [makeProduct("p1", "Apple", 80), makeProduct("p2", "Samsung", 60)];
    const data = buildBrandAspectData(products);
    for (const point of data) {
      expect(typeof point.aspect).toBe("string");
      expect(typeof point["Apple"]).toBe("number");
      expect(typeof point["Samsung"]).toBe("number");
    }
  });

  it("averages scores across multiple products in the same brand", () => {
    const p1 = makeProduct("p1", "Apple", 80);
    const p2 = makeProduct("p2", "Apple", 60);
    const [batteryPoint] = buildBrandAspectData([p1, p2]);
    expect(batteryPoint["Apple"]).toBe(70); // (80 + 60) / 2
  });

  it("scores are in 0–100 range", () => {
    const products = [makeProduct("p1", "Nokia", 55)];
    const data = buildBrandAspectData(products);
    for (const point of data) {
      expect(point["Nokia"]).toBeGreaterThanOrEqual(0);
      expect(point["Nokia"]).toBeLessThanOrEqual(100);
    }
  });
});

describe("getBrandsFromProducts", () => {
  it("returns unique brands in insertion order", () => {
    const products = [
      makeProduct("p1", "Apple"),
      makeProduct("p2", "Samsung"),
      makeProduct("p3", "Apple"),
    ];
    expect(getBrandsFromProducts(products)).toEqual(["Apple", "Samsung"]);
  });

  it("returns an empty array for an empty product list", () => {
    expect(getBrandsFromProducts([])).toEqual([]);
  });
});
