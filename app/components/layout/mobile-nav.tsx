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

export function MobileNav() {
  const pathname = usePathname();

  return (
    <header className="md:hidden sticky top-0 z-50 flex flex-col bg-sidebar border-b border-border">
      {/* Brand bar */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/50">
        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shrink-0">
          <Activity className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <p className="text-sm font-semibold text-foreground">SentimentIQ</p>
        <p className="text-xs text-muted-foreground ml-auto">Amazon Reviews</p>
      </div>

      {/* Tab bar */}
      <nav className="flex">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                active
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
