"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Product } from "@/lib/types";
import { buildBrandAspectData, getBrandsFromProducts, BRAND_COLORS } from "@/lib/compare";

interface Props {
  products: Product[];
}

export function BrandAspectBar({ products }: Props) {
  const data   = buildBrandAspectData(products);
  const brands = getBrandsFromProducts(products);

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }} barSize={10} barCategoryGap="30%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="aspect"
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
            formatter={(value, name) => [`${value}%`, name]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          />
          {brands.map((brand) => (
            <Bar
              key={brand}
              dataKey={brand}
              fill={BRAND_COLORS[brand] ?? "#94a3b8"}
              radius={[3, 3, 0, 0]}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={500}
              animationEasing="ease-out"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
