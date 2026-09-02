"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Opportunity } from "@/lib/constants/opportunities";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";

interface OpportunityCardProps {
  opportunity: Opportunity;
  featured?: boolean;
  onInterested?: (opportunity: Opportunity) => void;
  onEnquire?: (opportunity: Opportunity) => void;
}

export function OpportunityCard({
  opportunity,
  onInterested,
  onEnquire,
}: OpportunityCardProps) {
  const [imgSrc, setImgSrc] = useState(opportunity.imageUrl || DEFAULT_IMAGE);

  const handleInterestClick = () => {
    if (onInterested) onInterested(opportunity);
    else if (onEnquire) onEnquire(opportunity);
  };
  return (
    <article className="bg-white border border-[#DCECF2] hover:border-[#00A6E8]/60 rounded-2xl overflow-hidden shadow-[0px_4px_20px_rgba(10,25,42,0.04)] hover:shadow-[0px_8px_30px_rgba(10,25,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col group relative">
      {/* Top Cover Image with Stage Badge */}
      <div className="h-48 w-full relative overflow-hidden bg-slate-100">
        <Image
          src={imgSrc}
          alt={opportunity.title || "Opportunity"}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc(DEFAULT_IMAGE)}
        />

        {/* Stage or Category Badge in Top-Right */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 flex-wrap justify-end">
          {opportunity.isDemo ? (
            <span className="bg-white/95 backdrop-blur-sm text-[#5F7180] font-bold text-[10px] px-2 py-0.5 rounded shadow-sm border border-slate-200 tracking-wide uppercase">
              Sample
            </span>
          ) : (
            <span className="bg-emerald-600/95 backdrop-blur-sm text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-sm flex items-center gap-1 tracking-wide uppercase">
              <span className="material-symbols-outlined text-[12px]">verified</span>
              Live Listing
            </span>
          )}
          {opportunity.stageBadge && (
            <span className="bg-white/95 backdrop-blur-sm text-[#00658F] font-bold text-[11px] px-2.5 py-0.5 rounded shadow-sm border border-slate-100 tracking-wide">
              {opportunity.stageBadge}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Category/Sector Pill & Location */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#EBF6FC] text-[#00A6E8] font-bold text-[11px] px-2.5 py-0.5 rounded">
                {opportunity.category}
              </span>
              <span className="bg-slate-100 text-[#5F7180] font-medium text-[11px] px-2 py-0.5 rounded">
                {opportunity.sector}
              </span>
            </div>
            <span className="text-xs text-[#5F7180] flex items-center gap-1 font-medium shrink-0">
              <span className="material-symbols-outlined text-[14px] text-[#00A6E8]">
                location_on
              </span>
              {opportunity.location}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-[#0A192A] mb-2 group-hover:text-[#00A6E8] transition-colors leading-snug">
            <Link href={`/opportunities/${opportunity.slug}`}>
              {opportunity.title}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[#5F7180] mb-5 line-clamp-3 leading-relaxed">
            {opportunity.shortDescription}
          </p>
        </div>

        <div>
          {/* Investment Requirement Row */}
          <div className="pt-3 pb-4 border-t border-[#DCECF2] flex items-center justify-between">
            <div>
              <span className="block text-[10px] text-[#5F7180] uppercase tracking-wider font-semibold">
                Investment Range
              </span>
              <span className="text-sm sm:text-base font-bold text-[#0A192A]">
                {opportunity.investmentRange}
              </span>
            </div>

            <div className="text-right">
              <span className="block text-[10px] text-[#5F7180] uppercase tracking-wider font-semibold">
                Target Requirement
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#00658F]">
                {opportunity.targetRaise}
              </span>
            </div>
          </div>

          {/* Primary & Secondary Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href={`/opportunities/${opportunity.slug}`}
              className="w-full text-center bg-white border border-[#DCECF2] hover:border-[#00A6E8] text-[#0A192A] font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <span>View Opportunity</span>
            </Link>

            <button
              type="button"
              onClick={handleInterestClick}
              className="w-full text-center bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              <span>I&apos;m Interested</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
