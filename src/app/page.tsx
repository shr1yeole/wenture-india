"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JoinCta, RoleCtaGroup } from "@/components/ui/join-cta";
import { Container } from "@/components/layout/container";
import { NetworkMesh } from "@/components/visual/network-mesh";
import { TopOpportunities } from "@/components/sections/top-opportunities";
import { FeaturedShowcase } from "@/components/sections/featured-showcase";
import { GuidesSection } from "@/components/sections/guides-section";
import { ExploreSectors } from "@/components/sections/explore-sectors";
import { TrendingNow } from "@/components/sections/trending-now";
import { COMPANY } from "@/lib/constants/company";
import { motion } from "framer-motion";

export default function HomePage() {
  const [deletedNotice, setDeletedNotice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("deleted") === "true") {
        setDeletedNotice(true);
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-container selection:text-white">
      {deletedNotice && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3 text-center text-sm font-bold text-emerald-800 flex items-center justify-center gap-2 transition-all">
          <span className="material-symbols-outlined text-[20px] text-emerald-600">
            check_circle
          </span>
          <span>Your Wenturex account has been deleted.</span>
          <button
            type="button"
            onClick={() => setDeletedNotice(false)}
            className="ml-3 text-emerald-700 hover:text-emerald-950 text-xs font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Sticky Navigation */}
      <Navbar />

      <main className="flex-grow flex flex-col w-full overflow-hidden">
        {/* ============================================================ */}
        {/* 1. HERO SECTION */}
        {/* ============================================================ */}
        <section className="relative pt-16 md:pt-24 pb-20 md:pb-24 overflow-hidden border-b border-[#DCECF2] bg-[#F4FAFD]/50">
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-[#EBF6FB] to-transparent opacity-60 -z-10 pointer-events-none" />

          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline, Tagline & CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 flex flex-col"
              >
                {/* Brand Ecosystem Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DCECF2] text-[#00658F] font-semibold text-xs w-fit mb-6 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#00A6E8] animate-pulse" />
                  India&apos;s Premier Business &amp; Investment Ecosystem
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A192A] mb-6 leading-[1.12] tracking-tight font-heading">
                  Where Vision <br />
                  <span className="text-[#00A6E8]">Meets Capital.</span>
                </h1>

                <p className="text-base sm:text-lg text-[#5F7180] mb-8 max-w-xl leading-relaxed">
                  {COMPANY.corePositioning}
                </p>

                {/* Primary Gateway CTAs */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/for-investors"
                    className="bg-[#00A6E8] text-white font-bold text-sm sm:text-base rounded-xl px-7 py-3.5 hover:bg-[#0093CE] shadow-[0px_4px_15px_rgba(0,166,232,0.25)] transition-all flex items-center gap-2"
                  >
                    <span>For Investors</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>

                  <Link
                    href="/for-entrepreneurs"
                    className="bg-white border border-[#DCECF2] text-[#0A192A] font-bold text-sm sm:text-base rounded-xl px-7 py-3.5 hover:border-[#00A6E8] hover:bg-[#F6FAFF] shadow-sm transition-all"
                  >
                    <span>For Entrepreneurs</span>
                  </Link>
                </div>
              </motion.div>

              {/* Right Column: Visual Mesh / Ecosystem Anchor */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="lg:col-span-5 flex justify-center"
              >
                <div className="w-full max-w-md bg-white border border-[#DCECF2] rounded-3xl p-6 sm:p-8 shadow-[0px_8px_30px_rgba(10,25,42,0.06)] relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4 border-b border-[#DCECF2] pb-3">
                    <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider">
                      Live Opportunities
                    </span>
                    <span className="text-xs text-[#5F7180] font-medium">Pan-India Access</span>
                  </div>

                  <div className="h-56 flex items-center justify-center">
                    <NetworkMesh variant="card" />
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#DCECF2] flex items-center justify-between text-xs text-[#5F7180]">
                    <span className="font-semibold text-[#0A192A]">Active Categories:</span>
                    <span>Investment • Franchise • EXIM</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ============================================================ */}
        {/* 2. INVESTOR & ENTREPRENEUR ENTRY GATEWAYS */}
        {/* ============================================================ */}
        <section className="w-full py-12 bg-white border-b border-[#DCECF2]">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Investor Gateway Card */}
              <div className="bg-[#F6FAFF] border border-[#DCECF2] hover:border-[#00A6E8] p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between group shadow-sm">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#DCECF2] text-[#00A6E8] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">trending_up</span>
                  </div>
                  <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
                    Direct Opportunities
                  </span>
                  <h3 className="text-2xl font-bold text-[#0A192A] mb-3">
                    Looking to Invest or Expand?
                  </h3>
                  <p className="text-sm text-[#5F7180] leading-relaxed mb-6">
                    Discover high-potential businesses, franchise expansions, dealership rights, and international trade opportunities across India.
                  </p>
                </div>
                <Link
                  href="/for-investors"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#00658F] group-hover:text-[#00A6E8] transition-colors"
                >
                  <span>Explore Investor Opportunities</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* Entrepreneur Gateway Card */}
              <div className="bg-[#F6FAFF] border border-[#DCECF2] hover:border-[#00A6E8] p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between group shadow-sm">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#DCECF2] text-[#00A6E8] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
                  </div>
                  <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
                    Strategic Growth
                  </span>
                  <h3 className="text-2xl font-bold text-[#0A192A] mb-3">
                    Looking for Growth Capital or Partners?
                  </h3>
                  <p className="text-sm text-[#5F7180] leading-relaxed mb-6">
                    Present your company, startup, or franchise concept to a nationwide network of active investors, franchisees, and trade partners.
                  </p>
                </div>
                <Link
                  href="/for-entrepreneurs"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#00658F] group-hover:text-[#00A6E8] transition-colors"
                >
                  <span>Present Your Business</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* ============================================================ */}
        {/* 3. TOP OPPORTUNITIES (Investment, Business, Franchise, etc.) */}
        {/* ============================================================ */}
        <TopOpportunities
          title="Top Opportunities"
          subtitle="Explore curated business, investment, franchise, dealership, and international export opportunities."
          limit={6}
          showViewAll={true}
        />

        {/* ============================================================ */}
        {/* 4. FEATURED DIRECTORY SHOWCASE */}
        {/* ============================================================ */}
        <FeaturedShowcase />

        {/* ============================================================ */}
        {/* 5. BUSINESS & INVESTMENT GUIDES ("Learn. Explore. Grow.") */}
        {/* ============================================================ */}
        <GuidesSection />

        {/* ============================================================ */}
        {/* 6. EXPLORE BY SECTOR (13 Approved Sectors) */}
        {/* ============================================================ */}
        <ExploreSectors />

        {/* ============================================================ */}
        {/* 7. TRENDING NOW */}
        {/* ============================================================ */}
        <TrendingNow />

        {/* ============================================================ */}
        {/* 8. FINAL CALL TO ACTION */}
        {/* ============================================================ */}
        <section className="w-full py-20 bg-gradient-to-b from-white to-[#F4FAFD]">
          <Container>
            <div className="bg-[#0A192A] rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl">
              {/* Subtle background glow */}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#00A6E8]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#00A6E8]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-2">
                  Get Started Today
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight font-heading">
                  Ready to Connect, Build &amp; Scale?
                </h2>
                <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
                  Join Wenturex India International to explore active opportunities, discover vetted businesses, and connect with visionary entrepreneurs.
                </p>

                <RoleCtaGroup
                  className="flex flex-wrap justify-center gap-4"
                  investorClassName="bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg transition-all"
                  entrepreneurClassName="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm sm:text-base px-8 py-4 rounded-xl backdrop-blur-sm transition-all"
                  exploreClassName="bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg transition-all"
                />
              </div>
            </div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
