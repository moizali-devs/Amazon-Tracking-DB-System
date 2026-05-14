"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/overview/product-card";
import type { Product, Brand } from "@/lib/types";

const ALL = "All" as const;
type FilterValue = typeof ALL | Brand;

interface BrandFilterProps {
  products: Product[];
  brands:   Brand[];
}

export function BrandFilter({ products, brands }: BrandFilterProps) {
  const [active, setActive] = useState<FilterValue>(ALL);

  const filtered =
    active === ALL ? products : products.filter((p) => p.brand === active);

  const tabs: FilterValue[] = [ALL, ...brands];

  return (
    <div className="space-y-6">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150",
              active === tab
                ? "bg-accent text-accent-foreground"
                : "border border-border text-muted-foreground hover:text-foreground hover:border-white/20"
            )}
          >
            {tab}
            {tab !== ALL && (
              <span className="ml-1.5 text-[10px] opacity-60 font-mono">
                {products.filter((p) => p.brand === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((product, i) => (
          <div
            key={product.id}
            className="animate-in-page"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-muted-foreground text-sm">No products for this brand.</p>
        </div>
      )}
    </div>
  );
}
