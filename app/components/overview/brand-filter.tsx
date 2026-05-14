"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/overview/product-card";
import type { Product, Brand } from "@/lib/types";

const ALL = "All" as const;
type FilterValue = typeof ALL | Brand;

interface BrandFilterProps {
  products: Product[];
  brands: Brand[];
}

export function BrandFilter({ products, brands }: BrandFilterProps) {
  const [active, setActive] = useState<FilterValue>(ALL);

  const filtered =
    active === ALL ? products : products.filter((p) => p.brand === active);

  const tabs: FilterValue[] = [ALL, ...brands];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors",
              active === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {tab}
            {tab !== ALL && (
              <span className="ml-1.5 text-xs opacity-60">
                {products.filter((p) => p.brand === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground text-sm">
          No products found for this brand.
        </div>
      )}
    </div>
  );
}
