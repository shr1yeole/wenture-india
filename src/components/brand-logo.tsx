import React from "react";
import { cn } from "@/lib/utils";
import { WentureEmblem } from "@/components/wenture-emblem";

interface BrandLogoProps {
  className?: string;
  showSubtitle?: boolean;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  dark?: boolean;
}

export function BrandLogo({
  className,
  showSubtitle = true,
  showTagline = false,
  size = "md",
  dark = false,
}: BrandLogoProps) {
  const emblemSize = {
    sm: 36,
    md: 44,
    lg: 54,
    xl: 68,
  }[size];

  const titleSize = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
    xl: "text-3xl sm:text-4xl",
  }[size];

  const subSize = {
    sm: "text-[9px] tracking-[0.2em]",
    md: "text-[10px] tracking-[0.22em]",
    lg: "text-xs tracking-[0.25em]",
    xl: "text-sm tracking-[0.28em]",
  }[size];

  const taglineSize = {
    sm: "text-[8px] tracking-[0.16em]",
    md: "text-[9px] tracking-[0.18em]",
    lg: "text-[10px] tracking-[0.2em]",
    xl: "text-xs tracking-[0.22em]",
  }[size];

  return (
    <div className={cn("inline-flex items-center gap-3 select-none group", className)}>
      {/* Official Wenture India Emblem */}
      <div className="relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
        <WentureEmblem size={emblemSize} />
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-baseline">
          <span
            className={cn(
              "font-extrabold tracking-tight leading-none font-heading transition-colors",
              titleSize,
              dark ? "text-white" : "text-[#0A192A]"
            )}
          >
            Wenture<span className="text-[#00A6E8]">India</span>
          </span>
        </div>

        {showSubtitle && (
          <span
            className={cn(
              "font-bold uppercase mt-1 leading-none",
              subSize,
              dark ? "text-slate-400" : "text-slate-500"
            )}
          >
            India International
          </span>
        )}

        {showTagline && (
          <span
            className={cn(
              "font-extrabold uppercase mt-1.5 leading-tight tracking-wider",
              taglineSize,
              dark ? "text-slate-400" : "text-slate-700"
            )}
          >
            CONNECT. BUILD. SCALE. GROW TOGETHER.
          </span>
        )}
      </div>
    </div>
  );
}
