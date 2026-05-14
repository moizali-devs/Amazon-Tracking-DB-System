import { getProductById, getProducts } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductCharts } from "@/components/product/product-charts";

export async function generateStaticParams() {
  return getProducts().map((p) => ({ id: p.id }));
}

const BRAND_ACCENT: Record<string, string> = {
  Apple:    "#60a5fa",
  Samsung:  "#22d3ee",
  Google:   "#4ade80",
  OnePlus:  "#f87171",
  Motorola: "#c084fc",
  Nokia:    "#fb923c",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const { overallSentiment, reviewCount, brand, name } = product;
  const accent = BRAND_ACCENT[brand] ?? "#94a3b8";

  return (
    <div className="max-w-5xl mx-auto px-5 py-8 lg:px-8 lg:py-10">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All products
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: accent }}
          >
            {brand}
          </span>
          <span className="text-muted-foreground text-xs">·</span>
          <span className="text-xs text-muted-foreground font-mono">
            {reviewCount.toLocaleString()} reviews
          </span>
        </div>

        <h1 className="font-heading font-black text-2xl lg:text-3xl text-foreground leading-tight">
          {name}
        </h1>

        {/* Sentiment headline row */}
        <div className="flex items-end gap-6 mt-5">
          <div>
            <span className="font-heading font-black text-6xl text-foreground leading-none">
              {overallSentiment.positive}
              <span className="text-3xl text-muted-foreground">%</span>
            </span>
            <p className="text-sm text-emerald-400 font-medium mt-1">positive sentiment</p>
          </div>
          <div className="pb-2 space-y-1">
            <p className="text-sm">
              <span className="text-amber-400 font-semibold">{overallSentiment.neutral}%</span>
              <span className="text-muted-foreground ml-1.5 text-xs">neutral</span>
            </p>
            <p className="text-sm">
              <span className="text-rose-400 font-semibold">{overallSentiment.negative}%</span>
              <span className="text-muted-foreground ml-1.5 text-xs">negative</span>
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <ProductCharts product={product} />
    </div>
  );
}
