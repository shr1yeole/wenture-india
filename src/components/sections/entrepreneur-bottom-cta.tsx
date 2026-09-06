"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth-context";

export function EntrepreneurBottomCta() {
  const { isAuthenticated, isEntrepreneur, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine destination for "List Your Venture"
  const listVentureHref = (mounted && !loading && isAuthenticated && isEntrepreneur)
    ? "/profile/listings"
    : "/signup/entrepreneur";

  return (
    <section className="py-20 px-5 sm:px-8 lg:px-12 bg-gradient-to-b from-[#F4FAFD]/50 to-white text-center border-t border-[#DCECF2]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192A] mb-4 tracking-tight font-heading">
          Ready to List Your Venture?
        </h2>

        <p className="text-base sm:text-lg text-[#5F7180] mb-8 leading-relaxed max-w-2xl mx-auto">
          Showcase your business, startup, franchise, or trade concept to an active network of verified angel investors, VC funds, and commercial partners.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={listVentureHref}
            className="inline-flex items-center gap-2.5 bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-base rounded-xl px-8 py-4 shadow-[0px_4px_15px_rgba(0,166,232,0.3)] transition-all hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
            <span>List Your Venture</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>

          <Link
            href="/investors"
            className="inline-flex items-center gap-2.5 bg-white border border-[#DCECF2] hover:border-[#00A6E8] text-[#00658F] font-bold text-base rounded-xl px-8 py-4 hover:bg-[#F4FAFD] transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px] text-[#00A6E8]">person_search</span>
            <span>Find Investors</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
