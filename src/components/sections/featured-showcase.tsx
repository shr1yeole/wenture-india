"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FEATURED_DATA, FeaturedItem } from "@/lib/constants/featured";

type FeaturedTab = "businesses" | "startups" | "franchises" | "dealerships" | "exim";

interface TabOption {
  id: FeaturedTab;
  label: string;
  count: number;
}

const TABS: TabOption[] = [
  { id: "businesses", label: "Featured Businesses", count: FEATURED_DATA.businesses.length },
  { id: "startups", label: "Featured Startups", count: FEATURED_DATA.startups.length },
  { id: "franchises", label: "Featured Franchise", count: FEATURED_DATA.franchises.length },
  { id: "dealerships", label: "Featured Dealerships", count: FEATURED_DATA.dealerships.length },
  { id: "exim", label: "Featured EXIM", count: FEATURED_DATA.exim.length },
];

export function FeaturedShowcase() {
  const [activeTab, setActiveTab] = useState<FeaturedTab>("businesses");

  const activeItems: FeaturedItem[] = FEATURED_DATA[activeTab] || [];

  return (
    <section className="w-full py-16 sm:py-20 bg-[#F6FAFF] border-b border-[#DCECF2]">
      <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
              Curated Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192A] tracking-tight">
              Featured Directory
            </h2>
            <p className="text-sm sm:text-base text-[#5F7180] mt-2 max-w-2xl">
              Explore established enterprises, innovative startups, franchise brands, authorized dealerships, and export partners.
            </p>
          </div>

          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00A6E8] hover:text-[#00658F] transition-colors shrink-0 group"
          >
            <span>View All Listings</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? "bg-[#0A192A] text-white border-[#0A192A] shadow-sm"
                    : "bg-white text-[#5F7180] border-[#DCECF2] hover:border-[#00A6E8] hover:text-[#0A192A]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeItems.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-[#DCECF2] hover:border-[#00A6E8]/60 rounded-2xl overflow-hidden shadow-[0px_4px_20px_rgba(10,25,42,0.04)] hover:shadow-[0px_8px_30px_rgba(10,25,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col group relative"
            >
              {/* Image */}
              <div className="h-48 w-full relative overflow-hidden bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {item.tag && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-white/95 backdrop-blur-sm text-[#00658F] font-bold text-[11px] px-2.5 py-1 rounded shadow-sm border border-slate-100 tracking-wide">
                      {item.tag}
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#EBF6FC] text-[#00A6E8] font-bold text-[11px] px-2.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="bg-slate-100 text-[#5F7180] font-medium text-[11px] px-2 py-0.5 rounded">
                        {item.sector}
                      </span>
                    </div>
                    <span className="text-xs text-[#5F7180] flex items-center gap-1 font-medium shrink-0">
                      <span className="material-symbols-outlined text-[14px] text-[#00A6E8]">
                        location_on
                      </span>
                      {item.location}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0A192A] mb-2 group-hover:text-[#00A6E8] transition-colors leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5F7180] mb-4 line-clamp-3 leading-relaxed">
                    {item.shortDescription}
                  </p>
                </div>

                <div>
                  <div className="pt-3 pb-4 border-t border-[#DCECF2] flex items-center justify-between text-xs">
                    <div>
                      <span className="block text-[10px] text-[#5F7180] uppercase tracking-wider font-semibold">
                        Investment Range
                      </span>
                      <span className="font-bold text-[#0A192A]">
                        {item.investmentRange}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-[#5F7180] uppercase tracking-wider font-semibold">
                        Type
                      </span>
                      <span className="font-semibold text-[#00658F]">
                        {item.opportunityType}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/opportunities${item.slug ? `/${item.slug}` : ""}`}
                    className="w-full text-center bg-[#F6FAFF] border border-[#DCECF2] hover:border-[#00A6E8] hover:bg-white text-[#0A192A] hover:text-[#00A6E8] font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Details</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
