import React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg";
  dark?: boolean;
}

export function BrandLogo({
  className,
  showSubtitle = true,
  size = "md",
  dark = false,
}: BrandLogoProps) {
  const iconSize = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];

  const titleSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl sm:text-3xl",
  }[size];

  const subSize = {
    sm: "text-[9px] tracking-[0.25em]",
    md: "text-[10px] tracking-[0.28em]",
    lg: "text-xs tracking-[0.3em]",
  }[size];

  return (
    <div className={cn("inline-flex items-center gap-3 select-none group", className)}>
      {/* Dynamic Emblem */}
      <div className={cn("relative flex items-center justify-center shrink-0", iconSize)}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="wxGrad1" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00A6E8" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0A192A" />
            </linearGradient>
            <linearGradient id="wxGrad2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#00A6E8" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Rounded Diamond / Shield with soft border */}
          <rect
            x="4"
            y="4"
            width="40"
            height="40"
            rx="12"
            fill={dark ? "#0A192A" : "#FFFFFF"}
            stroke={dark ? "#1E293B" : "#E2E8F0"}
            strokeWidth="1.5"
            className="shadow-sm"
          />

          {/* Connected Network Nodes & Dynamic 'W' Wing Shape */}
          {/* Left Wing / Pillar */}
          <path
            d="M13 16L19 32L24 22"
            stroke="url(#wxGrad2)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Wing / Pillar with Growth Ascent */}
          <path
            d="M24 22L29 32L35 15"
            stroke="url(#wxGrad2)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Central Apex Node / Star */}
          <circle cx="24" cy="22" r="2.5" fill="#00A6E8" filter="url(#glowFilter)" />
          <circle cx="13" cy="16" r="2" fill="#38BDF8" />
          <circle cx="35" cy="15" r="2.5" fill="#00A6E8" />
          <circle cx="19" cy="32" r="2" fill="#0A192A" />
          <circle cx="29" cy="32" r="2" fill="#0A192A" />

          {/* Subtle Growth Arrowhead at Right Peak */}
          <path
            d="M31 15H35V19"
            stroke="#00A6E8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center">
        <span
          className={cn(
            "font-extrabold tracking-tight leading-none transition-colors",
            titleSize,
            dark ? "text-white" : "text-wenture-dark"
          )}
        >
          WENTUREX
        </span>
        {showSubtitle && (
          <span
            className={cn(
              "font-semibold uppercase mt-1 leading-none text-slate-500",
              subSize
            )}
          >
            India International
          </span>
        )}
      </div>
    </div>
  );
}
