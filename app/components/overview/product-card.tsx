"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Product } from "@/lib/types";

const BRAND_COLORS: Record<string, string> = {
  Apple:    "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Samsung:  "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  Google:   "bg-green-500/15 text-green-400 border-green-500/20",
  OnePlus:  "bg-red-500/15 text-red-400 border-red-500/20",
  Motorola: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Nokia:    "bg-orange-500/15 text-orange-400 border-orange-500/20",
};

function SentimentBar({ positive, neutral, negative }: { positive: number; neutral: number; negative: number }) {
  return (
    <div className="flex h-1.5 w-full rounded-full overflow-hidden gap-px">
      <div className="bg-emerald-500 rounded-l-full" style={{ width: `${positive}%` }} />
      <div className="bg-amber-500" style={{ width: `${neutral}%` }} />
      <div className="bg-rose-500 rounded-r-full" style={{ width: `${negative}%` }} />
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { positive, neutral, negative } = product.overallSentiment;

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group relative flex flex-col gap-4 p-5 bg-card border-border hover:border-primary/40 hover:bg-card/80 transition-all duration-200 cursor-pointer h-full">
        {/* Brand + review count */}
        <div className="flex items-start justify-between gap-2">
          <Badge
            variant="outline"
            className={`text-xs font-medium border ${BRAND_COLORS[product.brand] ?? "bg-muted text-muted-foreground"}`}
          >
            {product.brand}
          </Badge>
          <span className="text-xs text-muted-foreground shrink-0">
            {product.reviewCount.toLocaleString()} reviews
          </span>
        </div>

        {/* Product name */}
        <p className="text-sm font-medium text-foreground leading-snug line-clamp-2 flex-1">
          {product.name}
        </p>

        {/* Sentiment headline */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-emerald-400">{positive}%</span>
              <span className="text-xs text-muted-foreground ml-1.5">positive</span>
            </div>
            <div className="text-right text-xs text-muted-foreground space-y-0.5">
              <div><span className="text-rose-400">{negative}%</span> neg</div>
              <div><span className="text-amber-400">{neutral}%</span> neu</div>
            </div>
          </div>
          <SentimentBar positive={positive} neutral={neutral} negative={negative} />
        </div>

        {/* Top aspects */}
        {product.topPraisedAspects.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.topPraisedAspects.slice(0, 3).map((aspect) => (
              <span
                key={aspect}
                className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                {aspect}
              </span>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}
