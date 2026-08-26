"use client";

import React from "react";
import { motion } from "framer-motion";

interface NetworkMeshProps {
  className?: string;
  variant?: "hero" | "card" | "timeline";
}

export function NetworkMesh({ className, variant = "hero" }: NetworkMeshProps) {
  // Configurable nodes and connections
  const nodes = [
    { id: 1, x: 50, y: 40, label: "Vision", color: "#00A6E8" },
    { id: 2, x: 180, y: 90, label: "Startup", color: "#00658F" },
    { id: 3, x: 320, y: 45, label: "Capital", color: "#00A6E8" },
    { id: 4, x: 440, y: 110, label: "Scale", color: "#0A192A" },
    { id: 5, x: 260, y: 170, label: "Growth", color: "#00A6E8" },
    { id: 6, x: 100, y: 180, label: "Investor", color: "#00658F" },
    { id: 7, x: 390, y: 190, label: "Ecosystem", color: "#00A6E8" },
  ];

  const links = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 1, to: 4 },
    { from: 4, to: 3 },
    { from: 0, to: 5 },
    { from: 5, to: 4 },
    { from: 4, to: 6 },
    { from: 3, to: 6 },
  ];

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-radial from-primary-container/10 via-transparent to-transparent pointer-events-none blur-2xl" />

      <svg
        viewBox="0 0 500 240"
        className="w-full h-full max-w-lg drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A6E8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#DCECF2" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Animated Connection Lines */}
        {links.map((link, idx) => {
          const start = nodes[link.from];
          const end = nodes[link.to];
          return (
            <g key={`link-${idx}`}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#DCECF2"
                strokeWidth="1.5"
              />
              <motion.line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#00A6E8"
                strokeWidth="1.5"
                strokeDasharray="8 12"
                animate={{
                  strokeDashoffset: [-40, 0],
                }}
                transition={{
                  duration: 4 + (idx % 3),
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </g>
          );
        })}

        {/* Glowing Interactive Nodes */}
        {nodes.map((node) => (
          <g key={`node-${node.id}`} className="cursor-pointer">
            {/* Outer animated halo */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="14"
              fill={node.color}
              initial={{ opacity: 0.1, scale: 0.8 }}
              animate={{ opacity: [0.1, 0.25, 0.1], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: node.id * 0.4 }}
            />

            {/* Core Node Circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r="6"
              fill="#FFFFFF"
              stroke={node.color}
              strokeWidth="2.5"
              filter="url(#glow)"
            />

            {/* Node Label */}
            {variant === "hero" && (
              <text
                x={node.x}
                y={node.y + 18}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="#5F7180"
                fontFamily="var(--font-inter), sans-serif"
                className="select-none tracking-wider uppercase"
              >
                {node.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
