"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/types";

const SentimentDonut = dynamic(
  () => import("@/components/product/sentiment-donut").then((m) => m.SentimentDonut),
  { ssr: false, loading: () => <div className="h-[220px] rounded-lg bg-white/5 animate-pulse" /> }
);

const AspectChart = dynamic(
  () => import("@/components/product/aspect-chart").then((m) => m.AspectChart),
  { ssr: false, loading: () => <div className="h-48 rounded-lg bg-white/5 animate-pulse" /> }
);

export function ProductCharts({ product }: { product: Product }) {
  const { overallSentiment } = product;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Donut — left / top */}
      <Card className="lg:col-span-2 p-6 bg-card border-border">
        <h2 className="text-sm font-semibold text-foreground mb-5">Overall Sentiment</h2>
        <SentimentDonut sentiment={overallSentiment} />

        <Separator className="my-5 bg-border" />

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Positive", value: `${overallSentiment.positive}%`, color: "text-emerald-400" },
            { label: "Neutral",  value: `${overallSentiment.neutral}%`,  color: "text-amber-400"  },
            { label: "Negative", value: `${overallSentiment.negative}%`, color: "text-rose-400"   },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Aspect chart — right */}
      <Card className="lg:col-span-3 p-6 bg-card border-border">
        <h2 className="text-sm font-semibold text-foreground mb-5">Aspect Breakdown</h2>
        <AspectChart product={product} />
      </Card>
    </div>
  );
}
