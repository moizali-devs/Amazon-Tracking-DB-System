"use client";

import { useState, useMemo } from "react";
import { getProducts } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { CompareSelector } from "@/components/compare/compare-selector";
import dynamic from "next/dynamic";

const CompareRadar = dynamic(
  () => import("@/components/compare/compare-radar").then((m) => m.CompareRadar),
  { ssr: false, loading: () => <div className="h-[340px] rounded-lg bg-white/3 animate-pulse" /> }
);
const CompareBar = dynamic(
  () => import("@/components/compare/compare-bar").then((m) => m.CompareBar),
  { ssr: false, loading: () => <div className="h-[220px] rounded-lg bg-white/3 animate-pulse" /> }
);
const BrandAspectBar = dynamic(
  () => import("@/components/compare/brand-aspect-bar").then((m) => m.BrandAspectBar),
  { ssr: false, loading: () => <div className="h-[320px] rounded-lg bg-white/3 animate-pulse" /> }
);

const products = getProducts();

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selected = useMemo(
    () => products.filter((p) => selectedIds.includes(p.id)),
    [selectedIds]
  );

  return (
    <div className="max-w-6xl mx-auto px-5 py-8 lg:px-8 lg:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-black text-3xl text-foreground tracking-tight">
          Compare
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Side-by-side sentiment comparison across up to 3 products
        </p>
      </div>

      {/* Selector + reset */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
        <div className="flex-1 min-w-0 max-w-sm">
          <CompareSelector
            products={products}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
          />
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={() => setSelectedIds([])}
            className="
              text-sm px-4 py-2 rounded-full self-end
              border border-border text-muted-foreground
              hover:text-foreground hover:border-white/20
              transition-colors
            "
          >
            Reset
          </button>
        )}
      </div>

      {/* Empty state */}
      {selected.length < 2 && (
        <div className="rounded-lg border border-dashed border-border py-24 flex flex-col items-center gap-2 text-center mb-8">
          <p className="text-sm text-foreground/50 font-medium">
            Select at least 2 products to compare
          </p>
          <p className="text-xs text-muted-foreground">Up to 3 products side by side</p>
        </div>
      )}

      {/* Product comparison charts */}
      {selected.length >= 2 && (
        <div className="space-y-5 mb-10">
          <Card className="p-6 bg-card border-border">
            <h2 className="font-heading font-bold text-sm text-foreground mb-1">
              Overall Positive Sentiment
            </h2>
            <p className="text-xs text-muted-foreground mb-5">
              Percentage of reviews classified as positive
            </p>
            <CompareBar products={selected} />
          </Card>

          <Card className="p-6 bg-card border-border">
            <h2 className="font-heading font-bold text-sm text-foreground mb-1">
              Aspect Scores
            </h2>
            <p className="text-xs text-muted-foreground mb-5">
              Positive sentiment per product aspect
            </p>
            <CompareRadar products={selected} />
          </Card>
        </div>
      )}

      {/* Brand benchmark - always visible */}
      <div>
        <h2 className="font-heading font-black text-xl text-foreground mb-1">
          Brand Benchmark
        </h2>
        <p className="text-xs text-muted-foreground mb-5">
          Average aspect sentiment across all brands - benchmark any product&apos;s weaknesses against the competition
        </p>
        <Card className="p-6 bg-card border-border">
          <BrandAspectBar products={products} />
        </Card>
      </div>
    </div>
  );
}
