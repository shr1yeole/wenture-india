import React from "react";
import { cn } from "@/lib/utils";

interface WentureEmblemProps {
  className?: string;
  size?: number | string;
  showChakra?: boolean;
}

export function WentureEmblem({
  className,
  size = 56,
  showChakra = true,
}: WentureEmblemProps) {
  // 24 spokes for Ashoka Chakra (15 degrees each)
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      style={{
        width: size,
        height: typeof size === "number" ? size * 0.9 : "auto",
      }}
      aria-label="Wenture India Official Emblem"
    >
      <defs>
        {/* Subtle drop shadow for 3D realism */}
        <filter id="emblemShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" floodColor="#0A192A" floodOpacity="0.12" />
        </filter>
        {/* Gradient for Chakra wheel */}
        <linearGradient id="chakraBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B1E40" />
          <stop offset="100%" stopColor="#002B66" />
        </linearGradient>
      </defs>

      {/* --- 1. ASHOKA CHAKRA (Top Centered) --- */}
      {showChakra && (
        <g transform="translate(100, 30)">
          {/* Outer Wheel Rim */}
          <circle cx="0" cy="0" r="22" stroke="url(#chakraBlue)" strokeWidth="2.6" fill="#FFFFFF" />
          <circle cx="0" cy="0" r="19.5" stroke="url(#chakraBlue)" strokeWidth="1" fill="none" opacity="0.6" />

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
          <circle cx="0" cy="0" r="4" fill="#0B1E40" />
          <circle cx="0" cy="0" r="1.6" fill="#FFFFFF" />
        </g>
      )}

      {/* --- 2. GEOMETRIC LOW-POLY TRICOLOR EMBLEM (Winged Origami Crown) --- */}
      <g filter="url(#emblemShadow)">
        {/* === TOP ROW: SAFFRON / ORANGE FACETS === */}
        {/* Left Peak */}
        <polygon points="34,95 65,60 76,95" fill="#E65100" />
        <polygon points="65,60 100,95 76,95" fill="#F47920" />

        {/* Center Peak */}
        <polygon points="76,95 100,60 100,95" fill="#FF8A00" />
        <polygon points="100,60 124,95 100,95" fill="#FFA726" />

        {/* Right Peak */}
        <polygon points="100,95 135,60 124,95" fill="#F47920" />
        <polygon points="135,60 166,95 124,95" fill="#E65100" />

        {/* === MIDDLE ROW: WHITE / SILVER / REFLECTIVE FACETS === */}
        {/* Left middle facets */}
        <polygon points="34,95 56,128 76,95" fill="#CBD5E1" />
        <polygon points="56,128 100,128 76,95" fill="#FFFFFF" />
        <polygon points="76,95 100,95 100,128" fill="#E2E8F0" />

        {/* Right middle facets */}
        <polygon points="100,95 124,95 100,128" fill="#F8FAFC" />
        <polygon points="100,128 124,95 144,128" fill="#E2E8F0" />
        <polygon points="124,95 166,95 144,128" fill="#CBD5E1" />

        {/* === BOTTOM ROW: INDIA GREEN FACETS === */}
        {/* Left green facet */}
        <polygon points="56,128 76,160 100,128" fill="#0B8043" />
        {/* Center-Left green facet */}
        <polygon points="76,160 100,160 100,128" fill="#009639" />
        {/* Center-Right green facet */}
        <polygon points="100,128 100,160 124,160" fill="#10B981" />
        {/* Right green facet */}
        <polygon points="100,128 124,160 144,128" fill="#0B8043" />
      </g>
    </svg>
  );
}
