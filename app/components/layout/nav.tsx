"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutGrid, ArrowLeftRight, TrendingUp, BookOpen } from "lucide-react";

const NAV_ITEMS = [
  { href: "/",            label: "Overview",    icon: LayoutGrid     },
  { href: "/compare",     label: "Compare",     icon: ArrowLeftRight },
  { href: "/trends",      label: "Trends",      icon: TrendingUp     },
  { href: "/methodology", label: "Methodology", icon: BookOpen       },
];

export function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Desktop top bar ─────────────────────────────── */}
      <header
        className="
          hidden md:flex fixed top-0 left-0 right-0 z-50 h-14
          items-center gap-8 px-6
          border-b border-border
          bg-background/90 backdrop-blur-md
        "
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span
            className="
              w-7 h-7 rounded-md flex items-center justify-center
              bg-accent text-accent-foreground font-heading font-black text-xs
              select-none
            "
          >
            SQ
          </span>
          <span className="font-heading font-bold text-sm tracking-tight text-foreground">
            SentimentIQ
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150",
                isActive(href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto text-xs text-muted-foreground font-mono">
          18 products · IDS 2026
        </div>
      </header>

      {/* ── Mobile top mini header ──────────────────────── */}
      <header
        className="
          md:hidden fixed top-0 left-0 right-0 z-50 h-12
          flex items-center px-4 gap-2.5
          border-b border-border
          bg-background/90 backdrop-blur-md
        "
      >
        <span className="w-6 h-6 rounded-md bg-accent flex items-center justify-center font-heading font-black text-[10px] text-accent-foreground select-none">
          SQ
        </span>
        <span className="font-heading font-bold text-sm text-foreground">
          SentimentIQ
        </span>
      </header>

      {/* ── Mobile bottom tab bar ───────────────────────── */}
      <nav
        className="
          md:hidden fixed bottom-0 left-0 right-0 z-50
          flex border-t border-border
          bg-background/95 backdrop-blur-md
        "
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3",
              "text-[10px] font-medium transition-colors",
              isActive(href)
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground/80"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
