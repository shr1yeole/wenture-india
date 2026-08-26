import React from "react";
import Link from "next/link";

interface TrendingItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  link: string;
  icon: string;
  badgeColor: string;
}

const TRENDING_ITEMS: TrendingItem[] = [
  {
    id: "trend-1",
    tag: "Trending Opportunity",
    title: "EcoVolt Energy Storage",
    subtitle: "Modular battery storage systems and intelligent microgrid control units in CleanTech.",
    link: "/opportunities/ecovolt-solutions",
    icon: "bolt",
    badgeColor: "bg-amber-100 text-amber-800",
  },
  {
    id: "trend-2",
    tag: "Popular Sector",
    title: "Food & Beverage Franchises",
    subtitle: "High consumer footfall QSR models, specialty cafes, and cloud kitchens expanding across India.",
    link: "/opportunities?sector=Food%20%26%20Beverage",
    icon: "restaurant",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "trend-3",
    tag: "Featured Guide",
    title: "Guide to Business Franchise",
    subtitle: "Practical evaluation criteria for FOFO, FOCO, and Master franchise playbooks.",
    link: "/guides/business-franchise",
    icon: "menu_book",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  {
    id: "trend-4",
    tag: "Featured Business",
    title: "Apex Precision Tooling",
    subtitle: "10+ years established CNC precision machining unit supplying automotive and industrial sectors.",
    link: "/opportunities/apex-cnc-manufacturing",
    icon: "precision_manufacturing",
    badgeColor: "bg-purple-100 text-purple-800",
  },
];

export function TrendingNow() {
  return (
    <section className="w-full py-16 sm:py-20 bg-[#F6FAFF] border-b border-[#DCECF2]">
      <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A6E8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00A6E8]"></span>
              </span>
              <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider">
                Curated Highlights
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192A] tracking-tight mt-1">
              Trending Now
            </h2>
          </div>

          <Link
            href="/opportunities"
            className="text-xs sm:text-sm font-bold text-[#00A6E8] hover:text-[#00658F] transition-colors"
          >
            Browse Catalog →
          </Link>
        </div>

        {/* 4 Trending Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRENDING_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="bg-white border border-[#DCECF2] hover:border-[#00A6E8] p-5 rounded-xl shadow-[0px_4px_16px_rgba(10,25,42,0.03)] hover:shadow-[0px_8px_24px_rgba(10,25,42,0.07)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${item.badgeColor}`}
                  >
                    {item.tag}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#5F7180] group-hover:text-[#00A6E8] transition-colors">
                    {item.icon}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#0A192A] group-hover:text-[#00A6E8] transition-colors mb-1.5 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-[#5F7180] leading-relaxed">
                  {item.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DCECF2] flex items-center justify-between text-xs font-semibold text-[#00A6E8]">
                <span>Explore</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
