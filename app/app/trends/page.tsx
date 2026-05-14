"use client";

import { useState, useMemo } from "react";
import { getProducts } from "@/lib/data";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { ProductSelector } from "@/components/trends/product-selector";
import { TimeRangeFilter, type TimeRange } from "@/components/trends/time-range-filter";
import type { MonthlyDataPoint } from "@/lib/types";

const TrendChart = dynamic(
  () => import("@/components/trends/trend-chart").then((m) => m.TrendChart),
  { ssr: false, loading: () => <div className="h-[320px] rounded-lg bg-white/3 animate-pulse" /> }
);

const products = getProducts();

function filterByRange(data: MonthlyDataPoint[], range: TimeRange): MonthlyDataPoint[] {
  if (range === "All" || data.length === 0) return data;
  const months = range === "3M" ? 3 : range === "6M" ? 6 : 12;
  return data.slice(-months);
}

export default function TrendsPage() {
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");
  const [timeRange, setTimeRange]   = useState<TimeRange>("All");

  const product = useMemo(
    () => products.find((p) => p.id === selectedId) ?? products[0],
    [selectedId]
  );

  const chartData = useMemo(
    () => filterByRange(product?.monthlySentiment ?? [], timeRange),
    [product, timeRange]
  );

  const avgPositive = chartData.length > 0
    ? Math.round(chartData.reduce((s, d) => s + d.positive, 0) / chartData.length)
    : 0;

  const totalReviews = chartData.reduce((s, d) => s + d.reviewCount, 0);

  return (
    <div className="max-w-5xl mx-auto px-5 py-8 lg:px-8 lg:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-black text-3xl text-foreground tracking-tight">
          Sentiment Trends
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Monthly sentiment trajectory for a selected product
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-5 mb-6">
        <ProductSelector
          products={products}
          selectedId={selectedId}
          onChange={setSelectedId}
        />
        <TimeRangeFilter active={timeRange} onChange={setTimeRange} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Months",   value: chartData.length.toString()       },
          { label: "Reviews",  value: totalReviews.toLocaleString()      },
          { label: "Avg Pos",  value: `${avgPositive}%`                  },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-border bg-card px-4 py-3.5">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
              {label}
            </p>
            <p className="font-heading font-black text-2xl text-foreground mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-6 bg-card border-border">
        <h2 className="font-heading font-bold text-sm text-foreground mb-1">
          Monthly Sentiment
        </h2>
        <p className="text-xs text-muted-foreground mb-5 line-clamp-1">
          {product?.name}
        </p>
        <TrendChart data={chartData} />
      </Card>
    </div>
  );
}
