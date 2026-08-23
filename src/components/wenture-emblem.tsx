import React from "react";
import { cn } from "@/lib/utils";

interface WentureEmblemProps {
  className?: string;
  size?: number | string;
  showChakra?: boolean;
}

export function WentureEmblem({
  className,
  size = 48,
  showChakra = true,
}: WentureEmblemProps) {
  // 24 spokes for Ashoka Chakra
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      style={{ width: size, height: typeof size === "number" ? size * 0.9 : "auto" }}
      aria-label="Wenture India Official Emblem"
    >
      <defs>
        <filter id="emblemShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* --- 1. ASHOKA CHAKRA (Top) --- */}
      {showChakra && (
        <g transform="translate(100, 32)" className="text-[#0B1E40]">
          {/* Outer Wheel Rim */}
          <circle cx="0" cy="0" r="22" stroke="#0B1E40" strokeWidth="2.5" fill="#FFFFFF" />
          <circle cx="0" cy="0" r="19.5" stroke="#0B1E40" strokeWidth="1" fill="none" opacity="0.6" />
          
          {/* 24 Radiating Spokes */}
          {spokes.map((angle) => (
            <line
              key={angle}
              x1="0"
              y1="0"
              x2="0"
              y2="-19"
              stroke="#0B1E40"
              strokeWidth="1.2"
              strokeLinecap="round"
              transform={`rotate(${angle})`}
            />
          ))}

          {/* Central Hub */}
          <circle cx="0" cy="0" r="3.5" fill="#0B1E40" />
          <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
        </g>
      )}

      {/* --- 2. GEOMETRIC LOW-POLY TRICOLOR EMBLEM (Winged / Crown Polygon) --- */}
      {/* Total Width spans 30 to 170 (140px width), Height spans 65 to 160 */}
      <g filter="url(#emblemShadow)">
        {/* === TOP ROW: SAFFRON / ORANGE PEAKS === */}
        {/* Left Peak */}
        <polygon points="35,100 65,65 75,100" fill="#E65A00" />
        <polygon points="65,65 100,100 75,100" fill="#FF8026" />

        {/* Center Peak */}
        <polygon points="75,100 100,65 100,100" fill="#FF8D3B" />
        <polygon points="100,65 125,100 100,100" fill="#FFA559" />

        {/* Right Peak */}
        <polygon points="100,100 135,65 125,100" fill="#FF8026" />
        <polygon points="135,65 165,100 125,100" fill="#E65A00" />

        {/* === MIDDLE ROW: WHITE / SILVER / LIGHT SLATE FACETS === */}
        {/* Left side middle facets */}
        <polygon points="35,100 55,130 75,100" fill="#CBD5E1" />
        <polygon points="55,130 100,130 75,100" fill="#F8FAFC" />
        <polygon points="75,100 100,100 100,130" fill="#E2E8F0" />

        {/* Right side middle facets */}
        <polygon points="100,100 125,100 100,130" fill="#FFFFFF" />
        <polygon points="100,130 125,100 145,130" fill="#E2E8F0" />
        <polygon points="125,100 165,100 145,130" fill="#CBD5E1" />

        {/* === BOTTOM ROW: INDIA GREEN BASE FACETS === */}
        {/* Left base facet */}
        <polygon points="55,130 75,160 100,130" fill="#15803D" />
        {/* Center-Left base facet */}
        <polygon points="75,160 100,160 100,130" fill="#16A34A" />
        {/* Center-Right base facet */}
        <polygon points="100,130 100,160 125,160" fill="#22C55E" />
        {/* Right base facet */}
        <polygon points="100,130 125,160 145,130" fill="#15803D" />
      </g>
    </svg>
  );
}
