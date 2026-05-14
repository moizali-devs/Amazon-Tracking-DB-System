"use client";

import { useState, useMemo } from "react";
import { getProducts } from "@/lib/data";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";

const TrendChart = dynamic(
  () => import("@/components/trends/trend-chart").then((m) => m.TrendChart),
  { ssr: false, loading: () => <div className="h-[320px] rounded-lg bg-white/3 animate-pulse" /> }
);
import { ProductSelector } from "@/components/trends/product-selector";
import { TimeRangeFilter, type TimeRange } from "@/components/trends/time-range-filter";
import type { MonthlyDataPoint } from "@/lib/types";

const products = getProducts();

function filterByRange(data: MonthlyDataPoint[], range: TimeRange): MonthlyDataPoint[] {
  if (range === "All" || data.length === 0) return data;

  const months = range === "3M" ? 3 : range === "6M" ? 6 : 12;
  return data.slice(-months);
}

export default function TrendsPage() {
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");
  const [timeRange, setTimeRange] = useState<TimeRange>("All");

  const product = useMemo(
    () => products.find((p) => p.id === selectedId) ?? products[0],
    [selectedId]
  );

  const chartData = useMemo(
    () => filterByRange(product?.monthlySentiment ?? [], timeRange),
    [product, timeRange]
  );

  const avgPositive =
    chartData.length > 0
      ? Math.round(
          chartData.reduce((s, d) => s + d.positive, 0) / chartData.length
        )
      : 0;

  const totalReviews = chartData.reduce((s, d) => s + d.reviewCount, 0);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Sentiment Trends
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monthly sentiment trajectory for a selected product
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-6 mb-6">
        <ProductSelector
          products={products}
          selectedId={selectedId}
          onChange={setSelectedId}
        />
        <TimeRangeFilter active={timeRange} onChange={setTimeRange} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Months shown",   value: chartData.length.toString() },
          { label: "Reviews in range", value: totalReviews.toLocaleString() },
          { label: "Avg positive",   value: `${avgPositive}%` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-card px-4 py-3"
          >
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-sm font-semibold text-foreground mb-5">
          Monthly Sentiment — {product?.name.slice(0, 60)}{(product?.name.length ?? 0) > 60 ? "…" : ""}
        </h2>
        <TrendChart data={chartData} />
      </Card>
    </div>
  );
}
