import { getProductById, getProducts } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductCharts } from "@/components/product/product-charts";

export async function generateStaticParams() {
  return getProducts().map((p) => ({ id: p.id }));
}

const BRAND_COLORS: Record<string, string> = {
  Apple:    "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Samsung:  "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  Google:   "bg-green-500/15 text-green-400 border-green-500/20",
  OnePlus:  "bg-red-500/15 text-red-400 border-red-500/20",
  Motorola: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Nokia:    "bg-orange-500/15 text-orange-400 border-orange-500/20",
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

  // Estimate avg star rating from sentiment (positive → ~4-5, negative → ~1-2)
  const estimatedRating = (
    (overallSentiment.positive * 4.5 +
      overallSentiment.neutral * 3.0 +
      overallSentiment.negative * 1.5) /
    100
  ).toFixed(1);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All products
      </Link>

      {/* Header */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={`text-xs font-medium border ${BRAND_COLORS[brand] ?? "bg-muted text-muted-foreground"}`}
          >
            {brand}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5" />
            {reviewCount.toLocaleString()} reviews
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 font-medium">{estimatedRating}</span>
            <span>est. rating</span>
          </div>
        </div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground leading-snug">
          {name}
        </h1>
      </div>

      {/* Main grid — charts in a client wrapper to avoid SSR */}
      <ProductCharts product={product} />
    </div>
  );
}
