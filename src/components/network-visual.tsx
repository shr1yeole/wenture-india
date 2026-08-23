"use client";

import React, { useState } from "react";
import { 
  Users, 
  Lightbulb, 
  Coins, 
  TrendingUp, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react";

interface NodeItem {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  position: { x: number; y: number }; // percentage coordinates
  accent: string;
  borderAccent: string;
  glowColor: string;
  description: string;
}

const networkNodes: NodeItem[] = [
  {
    id: "entrepreneurs",
    label: "Entrepreneurs",
    sublabel: "Vision & Leadership",
    icon: Users,
    position: { x: 18, y: 28 },
    accent: "bg-sky-500/10 text-sky-600",
    borderAccent: "border-sky-500/30",
    glowColor: "rgba(14, 165, 233, 0.4)",
    description: "Visionary founders building transformative ventures.",
  },
  {
    id: "ideas",
    label: "Ideas",
    sublabel: "Innovation & Models",
    icon: Lightbulb,
    position: { x: 26, y: 76 },
    accent: "bg-cyan-500/10 text-cyan-600",
    borderAccent: "border-cyan-500/30",
    glowColor: "rgba(6, 182, 212, 0.4)",
    description: "High-potential concepts backed by strong execution.",
  },
  {
    id: "capital",
    label: "Capital",
    sublabel: "Funding & Liquidity",
    icon: Coins,
    position: { x: 74, y: 76 },
    accent: "bg-blue-600/10 text-blue-600",
    borderAccent: "border-blue-500/30",
    glowColor: "rgba(37, 99, 235, 0.4)",
    description: "Smart institutional and angel growth funding.",
  },
  {
    id: "investors",
    label: "Investors",
    sublabel: "Strategic Partners",
    icon: ShieldCheck,
    position: { x: 82, y: 28 },
    accent: "bg-indigo-500/10 text-indigo-600",
    borderAccent: "border-indigo-500/30",
    glowColor: "rgba(99, 102, 241, 0.4)",
    description: "Capital allocators seeking high-impact opportunities.",
  },
  {
    id: "growth",
    label: "Scale & Growth",
    sublabel: "Market Expansion",
    icon: TrendingUp,
    position: { x: 50, y: 12 },
    accent: "bg-emerald-500/10 text-emerald-600",
    borderAccent: "border-emerald-500/30",
    glowColor: "rgba(16, 185, 129, 0.4)",
    description: "Sustainable scaling and compounded value creation.",
  },
];

export function NetworkVisual() {
  const [activeNode, setActiveNode] = useState<string | null>("growth");

  return (
    <div className="relative w-full max-w-5xl mx-auto py-8 sm:py-12 select-none">
      {/* Background Soft Glow Auras */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] sm:w-[500px] h-[300px] sm:h-[400px] bg-gradient-to-tr from-wenture-cyanLight/60 via-sky-100/40 to-transparent rounded-full filter blur-3xl opacity-70 animate-pulse-slow" />
      </div>

      {/* Interactive Network Graph Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[540px] rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200/90 shadow-card overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />

        {/* SVG Network Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 650"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="netLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A6E8" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0A192A" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="activeLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A6E8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Central Nexus Connectors */}
          {/* Center to Growth */}
          <line x1="500" y1="325" x2="500" y2="110" stroke="url(#netLineGrad)" strokeWidth="2" strokeDasharray="5,5" className="dash-animated" />
          {/* Center to Entrepreneurs */}
          <line x1="500" y1="325" x2="220" y2="200" stroke="url(#netLineGrad)" strokeWidth="2" strokeDasharray="5,5" className="dash-animated" />
          {/* Center to Investors */}
          <line x1="500" y1="325" x2="780" y2="200" stroke="url(#netLineGrad)" strokeWidth="2" strokeDasharray="5,5" className="dash-animated" />
          {/* Center to Ideas */}
          <line x1="500" y1="325" x2="280" y2="480" stroke="url(#netLineGrad)" strokeWidth="2" strokeDasharray="5,5" className="dash-animated" />
          {/* Center to Capital */}
          <line x1="500" y1="325" x2="720" y2="480" stroke="url(#netLineGrad)" strokeWidth="2" strokeDasharray="5,5" className="dash-animated" />

          {/* Peripheral Interconnections (Ecosystem Synergy) */}
          {/* Entrepreneurs to Ideas */}
          <path d="M 220 200 Q 180 340 280 480" fill="none" stroke="rgba(0, 166, 232, 0.25)" strokeWidth="1.5" />
          {/* Investors to Capital */}
          <path d="M 780 200 Q 820 340 720 480" fill="none" stroke="rgba(0, 166, 232, 0.25)" strokeWidth="1.5" />
          {/* Ideas to Capital */}
          <path d="M 280 480 Q 500 560 720 480" fill="none" stroke="rgba(0, 166, 232, 0.3)" strokeWidth="1.8" strokeDasharray="4,4" />
          {/* Entrepreneurs to Growth */}
          <path d="M 220 200 Q 340 120 500 110" fill="none" stroke="rgba(0, 166, 232, 0.25)" strokeWidth="1.5" />
          {/* Investors to Growth */}
          <path d="M 780 200 Q 660 120 500 110" fill="none" stroke="rgba(0, 166, 232, 0.25)" strokeWidth="1.5" />
        </svg>

        {/* Central Core Emblem Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className="relative group">
            {/* Outer pulsating ring */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-wenture-blue/30 via-sky-400/20 to-wenture-navy/30 blur-md animate-pulse" />
            
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-wenture-dark text-white flex flex-col items-center justify-center p-3 shadow-glow border-2 border-wenture-blue/40 transition-transform duration-300 group-hover:scale-105">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-wenture-blue mb-0.5 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold tracking-wider text-wenture-cyanLight uppercase">
                WENTUREX
              </span>
              <span className="text-[8px] text-slate-400 font-medium">HUB</span>
            </div>
          </div>
          <span className="mt-2 text-[10px] sm:text-xs font-semibold text-wenture-navy/80 bg-white/90 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-sm backdrop-blur-sm">
            Ecosystem Core
          </span>
        </div>

        {/* Nodes Layer */}
        {networkNodes.map((node) => {
          const Icon = node.icon;
          const isActive = activeNode === node.id;

          return (
            <button
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              onMouseEnter={() => setActiveNode(node.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300 focus:outline-none group ${
                isActive ? "scale-105" : "hover:scale-102"
              }`}
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
              }}
              aria-label={`Node: ${node.label} - ${node.sublabel}`}
            >
              {/* Glowing Aura for active node */}
              {isActive && (
                <div
                  className="absolute -inset-2 rounded-2xl blur-md transition-opacity duration-300 opacity-60 pointer-events-none"
                  style={{ backgroundColor: node.glowColor }}
                />
              )}

              {/* Node Card */}
              <div
                className={`relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? "bg-white shadow-lg border-wenture-blue ring-2 ring-wenture-blue/20"
                    : "bg-white/95 shadow-sm border-slate-200/90 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {/* Node Icon Box */}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${node.accent}`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Node Text */}
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs sm:text-sm font-bold text-wenture-dark leading-snug">
                      {node.label}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-wenture-blue transition-colors" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">
                    {node.sublabel}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        {/* Dynamic Detail Overlay at Bottom of Visual Graph */}
        <div className="absolute bottom-3 left-4 right-4 sm:left-6 sm:right-6 z-30">
          <div className="px-4 py-2.5 sm:py-3 rounded-2xl bg-wenture-dark/95 text-white backdrop-blur-md border border-white/10 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-wenture-blue animate-ping" />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-wenture-cyanLight">
                  {networkNodes.find((n) => n.id === activeNode)?.label || "Synergy"}
                </span>
                <span className="text-slate-300 ml-2 hidden xs:inline">
                  — {networkNodes.find((n) => n.id === activeNode)?.description}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-wenture-blueLight" />
              <span>Connect · Build · Scale</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Micro-Badges */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-600 font-medium">
        <span className="px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 flex items-center gap-1.5 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-wenture-blue" />
          Vision with Capital
        </span>
        <span className="px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 flex items-center gap-1.5 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Ideas with Funds
        </span>
        <span className="px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 flex items-center gap-1.5 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          Giving Wings to Dreams
        </span>
      </div>
    </div>
  );
}
