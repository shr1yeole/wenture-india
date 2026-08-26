"use client";

import React from "react";
import Link from "next/link";
import { Opportunity } from "@/lib/constants/opportunities";

interface OpportunityCardProps {
  opportunity: Opportunity;
  featured?: boolean;
  onEnquire?: (opportunity: Opportunity) => void;
}

export function OpportunityCard({
  opportunity,
}: OpportunityCardProps) {
  return (
    <article className="bg-white border border-[#DCECF2] hover:border-[#00A6E8]/60 rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(10,25,42,0.04)] hover:shadow-[0px_8px_30px_rgba(10,25,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col group relative">
      {/* Top Cover Image with Stage Badge */}
      <div className="h-48 w-full relative overflow-hidden bg-slate-100">
        <img
          src={opportunity.imageUrl}
          alt={opportunity.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Stage Badge in Top-Right */}
        {opportunity.stageBadge && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-white/95 backdrop-blur-sm text-[#00A6E8] font-bold text-[11px] px-2.5 py-1 rounded shadow-sm border border-slate-100 tracking-wide">
              {opportunity.stageBadge}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Sector Pill & Location */}
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-[#EBF6FC] text-[#00A6E8] font-bold text-xs px-2.5 py-0.5 rounded">
              {opportunity.sector}
            </span>
            <span className="text-xs text-[#5F7180] flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[15px] text-[#00A6E8]">
                location_on
              </span>
              {opportunity.location}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-[#0A192A] mb-2 group-hover:text-[#00A6E8] transition-colors leading-snug">
            <Link href={`/opportunities/${opportunity.slug}`}>
              {opportunity.title}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[#5F7180] mb-6 line-clamp-3 leading-relaxed">
            {opportunity.shortDescription}
          </p>
        </div>

        {/* Bottom Target Raise & View Details */}
        <div className="pt-4 border-t border-[#DCECF2] flex items-center justify-between">
          <div>
            <span className="block text-[11px] text-[#5F7180] uppercase tracking-wider font-semibold mb-0.5">
              Target Raise
            </span>
            <span className="text-base sm:text-lg font-bold text-[#0A192A]">
              {opportunity.targetRaise}
            </span>
          </div>

          <Link
            href={`/opportunities/${opportunity.slug}`}
            className="text-xs sm:text-sm font-bold text-[#00A6E8] hover:text-[#00658F] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            <span>View Details</span>
            <span className="text-[16px] leading-none">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
