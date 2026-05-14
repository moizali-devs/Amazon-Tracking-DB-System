"use client";

import { cn } from "@/lib/utils";

export type TimeRange = "3M" | "6M" | "1Y" | "All";

const RANGES: TimeRange[] = ["3M", "6M", "1Y", "All"];

interface Props {
  active: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeFilter({ active, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground font-medium">Range</span>
      <div className="flex gap-1">
        {RANGES.map((range) => (
          <button
            key={range}
            onClick={() => onChange(range)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              active === range
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}
