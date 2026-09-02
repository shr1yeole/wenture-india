import React from "react";
import Link from "next/link";
import Image from "next/image";
import { InvestorProfile } from "@/lib/firebase/investors";

interface InvestorCardProps {
  investor: InvestorProfile;
}

export function InvestorCard({ investor }: InvestorCardProps) {
  // Investor type color badge styling
  let typeBadgeStyle = "bg-[#EBF6FC] text-[#00658F] border-[#DCECF2]";
  if (investor.investorType === "VC") {
    typeBadgeStyle = "bg-purple-50 text-purple-800 border-purple-200";
  } else if (investor.investorType === "Angel Investor") {
    typeBadgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
  } else if (investor.investorType === "Corporate") {
    typeBadgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
  }

  const initial = investor.investorName?.charAt(0).toUpperCase() || "I";

  return (
    <article className="bg-white border border-[#DCECF2] hover:border-[#00A6E8]/60 rounded-2xl p-6 sm:p-7 shadow-[0px_4px_20px_rgba(10,25,42,0.03)] hover:shadow-[0px_8px_30px_rgba(10,25,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative">
      <div>
        {/* Top Row: Avatar/Initial + Investor Type Badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {investor.profileImage ? (
              <div className="w-12 h-12 rounded-2xl overflow-hidden relative border border-[#DCECF2] shrink-0 bg-slate-100">
                <Image
                  src={investor.profileImage}
                  alt={investor.investorName}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-[#EBF6FC] border border-[#DCECF2] text-[#00658F] font-extrabold text-lg flex items-center justify-center shrink-0">
                {initial}
              </div>
            )}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0A192A] group-hover:text-[#00A6E8] transition-colors leading-snug">
                <Link href={`/investors/${investor.id}`}>
                  {investor.investorName}
                </Link>
              </h3>
              <span className="text-xs text-[#5F7180] flex items-center gap-1 font-medium mt-0.5">
                <span className="material-symbols-outlined text-[13px] text-[#00A6E8]">
                  location_on
                </span>
                {investor.location}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
            {investor.isDemo ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#5F7180] border border-slate-200">
                Sample
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-emerald-600">verified</span>
                Verified
              </span>
            )}
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border shrink-0 ${typeBadgeStyle}`}
            >
              {investor.investorType}
            </span>
          </div>
        </div>

        {/* Short Introduction */}
        <p className="text-xs sm:text-sm text-[#5F7180] mb-5 line-clamp-3 leading-relaxed">
          {investor.shortIntroduction}
        </p>

        {/* Preferred Sectors Pills */}
        <div className="mb-5">
          <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
            Target Sectors
          </span>
          <div className="flex flex-wrap gap-1.5">
            {investor.preferredSectors.slice(0, 3).map((sec) => (
              <span
                key={sec}
                className="bg-[#F4FAFD] border border-[#DCECF2] text-[#0A192A] text-[11px] font-semibold px-2.5 py-0.5 rounded-md"
              >
                {sec}
              </span>
            ))}
            {investor.preferredSectors.length > 3 && (
              <span className="bg-slate-50 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-md self-center">
                +{investor.preferredSectors.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Investment Range & View Profile CTA */}
      <div className="pt-4 border-t border-[#DCECF2] flex items-center justify-between gap-3">
        <div>
          <span className="block text-[10px] text-[#5F7180] uppercase tracking-wider font-semibold">
            Investment Range
          </span>
          <span className="text-xs sm:text-sm font-bold text-[#00658F]">
            {investor.investmentRange}
          </span>
        </div>

        <Link
          href={`/investors/${investor.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#00A6E8] group-hover:text-[#0089C2] hover:underline"
        >
          <span>View Profile</span>
          <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-0.5">
            arrow_forward
          </span>
        </Link>
      </div>
    </article>
  );
}
