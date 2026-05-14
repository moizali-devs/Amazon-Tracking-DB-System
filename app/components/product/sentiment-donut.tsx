"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { SentimentBreakdown } from "@/lib/types";

const COLORS = {
  Positive: "#10b981",
  Neutral:  "#f59e0b",
  Negative: "#f43f5e",
};

interface Props {
  sentiment: SentimentBreakdown;
}

export function SentimentDonut({ sentiment }: Props) {
  const data = [
    { name: "Positive", value: sentiment.positive },
    { name: "Neutral",  value: sentiment.neutral  },
    { name: "Negative", value: sentiment.negative },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              isAnimationActive={true}
              animationBegin={100}
              animationDuration={600}
              animationEasing="ease-out"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1a1a2e",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#e2e8f0",
              }}
              formatter={(value) => [`${value}%`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-emerald-400">
            {sentiment.positive}%
          </span>
          <span className="text-xs text-muted-foreground mt-0.5">positive</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-5">
        {data.map(({ name, value }) => (
          <div key={name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: COLORS[name as keyof typeof COLORS] }}
            />
            <span className="text-xs text-muted-foreground">{name}</span>
            <span className="text-xs font-semibold text-foreground">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
