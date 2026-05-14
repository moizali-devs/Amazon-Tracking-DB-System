import { getProducts, getBrands } from "@/lib/data";
import { BrandFilter } from "@/components/overview/brand-filter";
import type { Brand } from "@/lib/types";

export default function OverviewPage() {
  const products    = getProducts();
  const brands      = getBrands();
  const totalReviews = products.reduce((sum, p) => sum + p.reviewCount, 0);
  const avgPositive  = Math.round(
    products.reduce((sum, p) => sum + p.overallSentiment.positive, 0) / products.length
  );

  const stats = [
    { label: "Products",      value: products.length.toString()    },
    { label: "Brands",        value: brands.length.toString()      },
    { label: "Reviews",       value: totalReviews.toLocaleString() },
    { label: "Avg Positive",  value: `${avgPositive}%`             },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 py-8 lg:px-8 lg:py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-heading font-black text-3xl text-foreground tracking-tight">
          Product Sentiment
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          NLP analysis of{" "}
          <span className="text-foreground font-medium">
            {totalReviews.toLocaleString()}
          </span>{" "}
          Amazon reviews across {products.length} products
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-card px-4 py-3.5"
          >
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
              {label}
            </p>
            <p className="font-heading font-black text-2xl text-foreground mt-1">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Brand filter + grid */}
      <BrandFilter products={products} brands={brands as Brand[]} />
    </div>
  );
}
