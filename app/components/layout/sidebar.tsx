"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, GitCompare, TrendingUp, BookOpen, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/",            label: "Overview",    icon: BarChart2  },
  { href: "/compare",     label: "Compare",     icon: GitCompare },
  { href: "/trends",      label: "Trends",      icon: TrendingUp },
  { href: "/methodology", label: "Methodology", icon: BookOpen   },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col min-h-screen bg-sidebar border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">SentimentIQ</p>
          <p className="text-[10px] text-muted-foreground">Amazon Reviews</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          18 products · 155k reviews
          <br />
          IDS Project · May 2026
        </p>
      </div>
    </aside>
  );
}
