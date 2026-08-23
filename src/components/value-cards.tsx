import React from "react";
import { Users, Briefcase, TrendingUp, ArrowUpRight, Sparkles, Shield, Compass } from "lucide-react";

interface ValueCardItem {
  number: string;
  category: string;
  title: string;
  description: string;
  icon: React.ElementType;
  accentGradient: string;
  iconBg: string;
  iconColor: string;
  tag: string;
}

const valueCards: ValueCardItem[] = [
  {
    number: "01",
    category: "FOR ENTREPRENEURS",
    title: "Turn ideas and businesses into opportunities.",
    description:
      "Access strategic capital, network with committed investors, and gain the wings needed to scale visionary concepts into thriving market leaders.",
    icon: Compass,
    accentGradient: "from-sky-500/10 to-transparent",
    iconBg: "bg-sky-50 border-sky-200",
    iconColor: "text-wenture-blue",
    tag: "Founders & Visionaries",
  },
  {
    number: "02",
    category: "FOR INVESTORS",
    title: "Discover businesses, ideas and opportunities with potential.",
    description:
      "Evaluate curated, high-conviction ventures across high-growth sectors. Connect directly with founders with verified drive and strategic alignment.",
    icon: Briefcase,
    accentGradient: "from-blue-600/10 to-transparent",
    iconBg: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    tag: "Strategic Capital Allocators",
  },
  {
    number: "03",
    category: "FOR GROWTH",
    title: "Connect the right people, capital and opportunities.",
    description:
      "Bridge the critical gap between groundbreaking ideas and the resources required to build sustainable, scalable, and compounding value together.",
    icon: TrendingUp,
    accentGradient: "from-emerald-500/10 to-transparent",
    iconBg: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    tag: "Ecosystem Acceleration",
  },
];

export function ValueCards() {
  return (
    <section className="py-16 sm:py-24 relative bg-slate-50/60 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wenture-cyanLight/70 border border-wenture-blue/20 text-xs font-bold uppercase tracking-wider text-wenture-navy">
            <span>Core Focus Pillars</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-wenture-dark tracking-tight">
            Built to Empower Every Stakeholder
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            A unified ecosystem purposefully engineered to align visionary entrepreneurs with forward-thinking investors.
          </p>
        </div>

        {/* 3 Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {valueCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.number}
                className="group relative flex flex-col justify-between p-8 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Subtle top gradient accent on hover */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-wenture-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

                <div>
                  {/* Top metadata row */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black tracking-tight text-slate-200 group-hover:text-wenture-blue/40 transition-colors">
                      {card.number}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs transition-transform duration-300 group-hover:scale-105 ${card.iconBg}`}
                    >
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                  </div>

                  {/* Category Eyebrow */}
                  <span className="inline-block text-xs font-bold tracking-widest text-wenture-blue uppercase mb-2">
                    {card.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-wenture-dark leading-snug mb-4 group-hover:text-wenture-navy transition-colors">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Tag */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{card.tag}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-wenture-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
