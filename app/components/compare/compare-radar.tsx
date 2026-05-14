"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { Product } from "@/lib/types";
import { buildRadarData, COMPARE_COLORS } from "@/lib/compare";

interface Props {
  products: Product[];
}

export function CompareRadar({ products }: Props) {
  const data = buildRadarData(products);

  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="aspect"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
          />
          <Tooltip
            contentStyle={{
              background:   "#1a1a2e",
              border:       "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              fontSize:     "12px",
              color:        "#e2e8f0",
            }}
            formatter={(value) => [`${value}%`, ""]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
            formatter={(value) => {
              const p = products.find((x) => x.id === value);
              return p ? (p.name.length > 35 ? p.name.slice(0, 35) + "…" : p.name) : value;
            }}
          />
          {products.map((p, i) => (
            <Radar
              key={p.id}
              name={p.id}
              dataKey={p.id}
              stroke={COMPARE_COLORS[i]}
              fill={COMPARE_COLORS[i]}
              fillOpacity={0.12}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationBegin={i * 100}
              animationDuration={600}
              animationEasing="ease-out"
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
