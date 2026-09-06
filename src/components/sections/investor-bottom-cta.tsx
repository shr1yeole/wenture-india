"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth-context";

export function InvestorBottomCta() {
  const { isAuthenticated, isInvestor, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine destination for "Get Listed as an Investor"
  const getListedHref = (mounted && !loading && isAuthenticated && isInvestor)
    ? "/profile/investor"
    : "/signup/investor";

  return (
    <section className="py-20 px-5 sm:px-8 lg:px-12 bg-gradient-to-b from-[#F4FAFD]/50 to-white text-center border-t border-[#DCECF2]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192A] mb-4 tracking-tight font-heading">
          Ready to Build Your Investment Portfolio?
        </h2>

        <p className="text-base sm:text-lg text-[#5F7180] mb-8 leading-relaxed max-w-2xl mx-auto">
          Access curated businesses, high-growth startups, franchise rollouts, and strategic investment ventures seeking accredited capital across India.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2.5 bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-base rounded-xl px-8 py-4 shadow-[0px_4px_15px_rgba(0,166,232,0.3)] transition-all hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[20px]">explore</span>
            <span>Explore Opportunities</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>

          <Link
            href={getListedHref}
            className="inline-flex items-center gap-2.5 bg-white border border-[#DCECF2] hover:border-[#00A6E8] text-[#00658F] font-bold text-base rounded-xl px-8 py-4 hover:bg-[#F4FAFD] transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px] text-[#00A6E8]">badge</span>
            <span>Get Listed as an Investor</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
