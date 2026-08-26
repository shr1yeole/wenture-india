import React from "react";
import Link from "next/link";
import { SECTORS } from "@/lib/constants/sectors";

export function ExploreSectors() {
  return (
    <section className="w-full py-16 sm:py-20 bg-white border-b border-[#DCECF2]">
      <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
            Sector Exploration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192A] tracking-tight">
            Explore by Sector
          </h2>
          <p className="text-sm sm:text-base text-[#5F7180] mt-2">
            Discover opportunities across high-growth industries, traditional businesses, and specialized trade verticals.
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {SECTORS.map((sector) => (
            <Link
              key={sector.id}
              href={`/opportunities?sector=${encodeURIComponent(sector.name)}`}
              className="bg-[#F6FAFF] border border-[#DCECF2] hover:border-[#00A6E8] hover:bg-white p-5 rounded-xl transition-all duration-200 group flex flex-col justify-between hover:shadow-[0px_4px_16px_rgba(10,25,42,0.06)]"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-white border border-[#DCECF2] text-[#00A6E8] flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-[#00A6E8] group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[22px]">
                    {sector.icon}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#0A192A] group-hover:text-[#00A6E8] transition-colors mb-1">
                  {sector.name}
                </h3>
                <p className="text-xs text-[#5F7180] line-clamp-2 leading-relaxed">
                  {sector.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DCECF2]/60 flex items-center justify-between text-[11px] text-[#5F7180]">
                <span>{sector.count}</span>
                <span className="material-symbols-outlined text-[16px] text-[#00A6E8] group-hover:translate-x-1 transition-transform">
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
