"use client";

import type { Product } from "@/lib/types";

interface Props {
  products: Product[];
  selectedId: string;
  onChange: (id: string) => void;
}

export function ProductSelector({ products, selectedId, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-muted-foreground font-medium">Product</label>
      <select
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        className="
          bg-card border border-border rounded-md
          px-3 py-2 text-sm text-foreground
          focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50
          hover:border-border/80 transition-colors
          max-w-sm
        "
      >
        {products.map((p) => (
          <option key={p.id} value={p.id} className="bg-card text-foreground">
            [{p.brand}] {p.name.length > 55 ? p.name.slice(0, 55) + "…" : p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
