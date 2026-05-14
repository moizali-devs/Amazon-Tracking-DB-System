import type { Product, Brand } from "@/lib/types";
import rawData from "@/data/data.json";

const products = rawData as Product[];

export function getProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | null {
  return products.find((p) => p.id === id) ?? null;
}

export function getProductsByBrand(brand: Brand): Product[] {
  return products.filter((p) => p.brand === brand);
}

export function getBrands(): Brand[] {
  const seen = new Set<Brand>();
  const result: Brand[] = [];
  for (const p of products) {
    if (!seen.has(p.brand as Brand)) {
      seen.add(p.brand as Brand);
      result.push(p.brand as Brand);
    }
  }
  return result;
}
