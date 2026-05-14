"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";

const BRAND_ACCENT: Record<string, string> = {
  Apple:    "#60a5fa", // blue
  Samsung:  "#22d3ee", // cyan
  Google:   "#4ade80", // green
  OnePlus:  "#f87171", // red
  Motorola: "#c084fc", // purple
  Nokia:    "#fb923c", // orange
};

function SentimentBar({
  positive,
  neutral,
  negative,
}: {
  positive: number;
  neutral: number;
  negative: number;
}) {
  return (
    <div className="flex h-1 w-full rounded-full overflow-hidden gap-[2px]">
      <div className="bg-emerald-500 rounded-l-full" style={{ width: `${positive}%` }} />
      <div className="bg-amber-500" style={{ width: `${neutral}%` }} />
      <div className="bg-rose-500 rounded-r-full" style={{ width: `${negative}%` }} />
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { positive, neutral, negative } = product.overallSentiment;
  const accent = BRAND_ACCENT[product.brand] ?? "#94a3b8";

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <article
        className="
          relative flex flex-col h-full
          rounded-lg border border-border
          bg-card overflow-hidden
          transition-all duration-200
          hover:border-white/15 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30
        "
      >
        {/* Brand colour accent strip */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg"
          style={{ background: accent }}
        />

        <div className="flex flex-col gap-4 p-5 pl-6 h-full">
          {/* Top row: brand + review count */}
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: accent }}
            >
              {product.brand}
            </span>
            <span className="text-xs text-muted-foreground font-mono tabular-nums">
              {product.reviewCount.toLocaleString()}
            </span>
          </div>

          {/* Hero: big positive % */}
          <div className="flex items-end gap-3">
            <span className="font-heading font-black text-5xl leading-none text-foreground">
              {positive}
              <span className="text-2xl text-muted-foreground">%</span>
            </span>
            <div className="pb-1.5 text-xs text-muted-foreground leading-snug">
              <div className="text-emerald-400 font-medium">positive</div>
              <div className="text-rose-400">{negative}% neg</div>
            </div>
          </div>

          {/* Product name */}
          <p className="text-sm text-foreground/80 leading-snug line-clamp-2 flex-1 min-h-[2.5rem]">
            {product.name}
          </p>

          {/* Sentiment bar */}
          <SentimentBar positive={positive} neutral={neutral} negative={negative} />

          {/* Top praised aspects */}
          {product.topPraisedAspects.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.topPraisedAspects.slice(0, 3).map((aspect) => (
                <span
                  key={aspect}
                  className="
                    text-[10px] px-2 py-0.5 rounded-full
                    bg-emerald-500/10 text-emerald-400
                    border border-emerald-500/20 font-medium
                  "
                >
                  ↑ {aspect}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
