"use client";

import type { Product } from "@/lib/types";
import { MAX_COMPARE, COMPARE_COLORS, toggleSelection } from "@/lib/compare";

interface Props {
  products:    Product[];
  selectedIds: string[];
  onChange:    (ids: string[]) => void;
}

export function CompareSelector({ products, selectedIds, onChange }: Props) {
  const byBrand = products.reduce<Record<string, Product[]>>((acc, p) => {
    (acc[p.brand] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-muted-foreground font-medium">
        Select products to compare{" "}
        <span className="text-foreground/40">({selectedIds.length}/{MAX_COMPARE})</span>
      </label>
      <div className="rounded-lg border border-border bg-card p-3 space-y-3 max-h-72 overflow-y-auto">
        {Object.entries(byBrand).map(([brand, brandProducts]) => (
          <div key={brand}>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              {brand}
            </p>
            <div className="space-y-1">
              {brandProducts.map((p) => {
                const idx      = selectedIds.indexOf(p.id);
                const checked  = idx !== -1;
                const disabled = !checked && selectedIds.length >= MAX_COMPARE;
                const color    = checked ? COMPARE_COLORS[idx] : undefined;

                return (
                  <label
                    key={p.id}
                    className={`
                      flex items-center gap-2.5 px-2 py-1.5 rounded cursor-pointer
                      transition-colors text-sm
                      ${checked   ? "bg-white/5"               : ""}
                      ${disabled  ? "opacity-40 cursor-not-allowed" : "hover:bg-white/4"}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => onChange(toggleSelection(selectedIds, p.id))}
                      className="sr-only"
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-sm border flex-shrink-0 flex items-center justify-center"
                      style={{
                        borderColor:     color ?? "rgba(255,255,255,0.2)",
                        backgroundColor: checked ? color : "transparent",
                      }}
                    >
                      {checked && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3L3.5 5.5L8 1" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className={checked ? "text-foreground" : "text-foreground/70"}>
                      {p.name.length > 55 ? p.name.slice(0, 55) + "…" : p.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
