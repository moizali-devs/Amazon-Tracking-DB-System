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
import type { Product } from "@/lib/types";
import { buildBarData, COMPARE_COLORS } from "@/lib/compare";

interface Props {
  products: Product[];
}

export function CompareBar({ products }: Props) {
  const data = buildBarData(products);

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }} barSize={32}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={{
              background:   "#1a1a2e",
              border:       "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              fontSize:     "12px",
              color:        "#e2e8f0",
            }}
            formatter={(value) => [`${value}%`, "Positive sentiment"]}
          />
          <Bar
            dataKey="positive"
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={500}
            animationEasing="ease-out"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COMPARE_COLORS[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
