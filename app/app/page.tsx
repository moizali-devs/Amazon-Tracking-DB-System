import { getProducts, getBrands } from "@/lib/data";
import { BrandFilter } from "@/components/overview/brand-filter";
import type { Brand } from "@/lib/types";

export default function OverviewPage() {
  const products = getProducts();
  const brands = getBrands();

  const totalReviews = products.reduce((sum, p) => sum + p.reviewCount, 0);
  const avgPositive =
    Math.round(products.reduce((sum, p) => sum + p.overallSentiment.positive, 0) / products.length);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Product Sentiment Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          NLP analysis of {totalReviews.toLocaleString()} Amazon reviews across{" "}
          {products.length} products
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Products",      value: products.length.toString()         },
          { label: "Brands",        value: brands.length.toString()           },
          { label: "Total Reviews", value: totalReviews.toLocaleString()      },
          { label: "Avg Positive",  value: `${avgPositive}%`                  },
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

      {/* Brand filter + product grid */}
      <BrandFilter products={products} brands={brands as Brand[]} />
    </div>
  );
}
