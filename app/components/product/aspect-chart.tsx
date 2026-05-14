"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Product, Aspect } from "@/lib/types";

const ASPECT_LABELS: Record<Aspect, string> = {
  battery:  "Battery",
  camera:   "Camera",
  screen:   "Screen",
  price:    "Price",
  build:    "Build",
  delivery: "Delivery",
};

interface Props {
  product: Product;
}

export function AspectChart({ product }: Props) {
  const { aspectScores, topPraisedAspects, topCriticizedAspects } = product;

  const data = (Object.entries(aspectScores) as [Aspect, (typeof aspectScores)[Aspect]][])
    .filter(([, score]) => score.mentionCount > 0)
    .map(([aspect, score]) => ({
      aspect,
      label:        ASPECT_LABELS[aspect],
      positive:     score.positive,
      negative:     score.negative,
      mentionCount: score.mentionCount,
      isPraised:    topPraisedAspects.includes(aspect),
      isCriticized: topCriticizedAspects.includes(aspect),
    }))
    .sort((a, b) => b.positive - a.positive);

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No aspect mentions found for this product.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Horizontal bars */}
      <div className="w-full" style={{ height: data.length * 44 + 20 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 8, right: 40, top: 4, bottom: 4 }}
            barSize={14}
          >
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={62}
              tick={{ fontSize: 12, fill: "#e2e8f0" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                background: "#1a1a2e",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#e2e8f0",
              }}
              formatter={(value, name) => [
                `${value}%`,
                name === "positive" ? "Positive" : "Negative",
              ]}
            />
            <Bar
              dataKey="positive"
              radius={[0, 4, 4, 0]}
              name="positive"
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={500}
              animationEasing="ease-out"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.aspect}
                  fill={entry.isPraised ? "#10b981" : "#34d399"}
                  opacity={entry.isPraised ? 1 : 0.65}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Aspect callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <AspectCallout
          title="Most Praised"
          aspects={topPraisedAspects}
          color="emerald"
          icon="↑"
        />
        <AspectCallout
          title="Most Criticized"
          aspects={topCriticizedAspects}
          color="rose"
          icon="↓"
        />
      </div>
    </div>
  );
}

function AspectCallout({
  title,
  aspects,
  color,
  icon,
}: {
  title: string;
  aspects: Aspect[];
  color: "emerald" | "rose";
  icon: string;
}) {
  const styles = {
    emerald: {
      container: "bg-emerald-500/8 border-emerald-500/20",
      title:     "text-emerald-400",
      pill:      "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
    },
    rose: {
      container: "bg-rose-500/8 border-rose-500/20",
      title:     "text-rose-400",
      pill:      "bg-rose-500/15 text-rose-300 border-rose-500/25",
    },
  }[color];

  return (
    <div className={`rounded-lg border p-3 ${styles.container}`}>
      <p className={`text-xs font-semibold mb-2 ${styles.title}`}>
        {icon} {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {aspects.length > 0 ? (
          aspects.map((a) => (
            <span
              key={a}
              className={`text-xs px-2 py-0.5 rounded border ${styles.pill}`}
            >
              {ASPECT_LABELS[a]}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">None</span>
        )}
      </div>
    </div>
  );
}
