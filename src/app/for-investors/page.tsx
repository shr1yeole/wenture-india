"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { OpportunityCard } from "@/components/cards/opportunity-card";
import { OpportunityEnquiryModal } from "@/components/forms/opportunity-enquiry-modal";
import { JoinCta } from "@/components/ui/join-cta";
import { OPPORTUNITIES, Opportunity } from "@/lib/constants/opportunities";
import { getPublishedListings, convertListingToOpportunity } from "@/lib/firebase/listings";

export default function ForInvestorsPage() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [publishedOpps, setPublishedOpps] = useState<Opportunity[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getPublishedListings();
      if (!res.error && res.listings && res.listings.length > 0) {
        setPublishedOpps(res.listings.map((l) => convertListingToOpportunity(l)));
      }
    }
    load();
  }, []);

  const featuredOpps = useMemo(() => {
    const demoWithFlag = OPPORTUNITIES.map((opp) => ({ ...opp, isDemo: true }));
    const liveSlugs = new Set(publishedOpps.map((l) => l.slug));
    const liveIds = new Set(publishedOpps.map((l) => l.id));
    const dedupedDemo = demoWithFlag.filter(
      (d) =>
        !liveSlugs.has(d.slug) &&
        !liveSlugs.has(d.id) &&
        !liveIds.has(d.id) &&
        !liveIds.has(d.slug)
    );
    return [...publishedOpps, ...dedupedDemo].slice(0, 3);
  }, [publishedOpps]);

  const handleEnquire = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setModalOpen(true);
  };

  const investorSteps = [
    { num: 1, title: "Create Your Profile", desc: "Join Wenturex as an investor and create your basic profile." },
    { num: 2, title: "Discover Opportunities", desc: "Explore relevant business and investment opportunities." },
    { num: 3, title: "Explore Businesses", desc: "Discover businesses, startups and opportunities across sectors." },
    { num: 4, title: "Review Information", desc: "Review the available business and opportunity information." },
    { num: 5, title: "Express Interest", desc: "Submit an enquiry or express interest in an opportunity." },
    { num: 6, title: "Connect", desc: "Connect with the relevant entrepreneur or business.", active: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-container selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <section className="relative pt-16 md:pt-24 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="col-span-1 md:col-span-7 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-border-subtle text-primary font-label-caps text-xs w-fit mb-6">
                Institutional Capital Gateway
              </div>

              <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface mb-stack-md leading-tight tracking-tight">
                Discover Where <br />
                <span className="text-primary-container">Opportunity Is Growing.</span>
              </h1>

              <p className="font-body-lg text-lg text-on-surface-variant mb-stack-lg max-w-2xl leading-relaxed">
                Access curated investment opportunities, connect with visionary entrepreneurs, and build a diversified portfolio in a transparent, professional ecosystem.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/profile/investor"
                  className="inline-flex items-center justify-center gap-2 bg-[#00A6E8] text-white font-button-text text-base px-8 py-4 rounded-xl hover:bg-[#0093CE] shadow-[0px_4px_16px_rgba(0,166,232,0.35)] transition-all hover:-translate-y-0.5 font-bold"
                >
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                  <span>Get Listed as an Investor</span>
                </Link>
                <JoinCta
                  roleType="investor"
                  singleMode
                  href="/signup/investor"
                  className="inline-flex items-center justify-center bg-white text-[#00658F] font-button-text text-base px-7 py-4 rounded-xl border border-[#DCECF2] hover:bg-[#F4FAFD] transition-colors font-bold"
                  alternateLabel="Join Also as Entrepreneur"
                  alternateHref="/signup/entrepreneur"
                  bothRolesLabel="Explore Wenturex"
                  bothRolesHref="/opportunities"
                >
                  Join as Investor
                </JoinCta>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center text-on-surface font-button-text text-base px-6 py-4 rounded-xl border border-border-subtle hover:bg-surface-container-low transition-colors font-semibold"
                >
                  See How It Works
                </Link>
              </div>
            </div>

            {/* Right Side: Live Deal Card Graphic from Stitch */}
            <div className="col-span-1 md:col-span-5 relative mt-8 md:mt-0">
              <div className="bg-surface-pure border border-border-subtle rounded-2xl p-6 shadow-[0_4px_25px_rgba(10,25,42,0.06)] relative z-10 md:rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary-container">
                      <span className="material-symbols-outlined text-[24px]">trending_up</span>
                    </div>
                    <div>
                      <h3 className="font-button-text text-base text-on-surface font-bold">
                        Live Opportunity
                      </h3>
                      <p className="font-label-caps text-xs text-on-surface-variant">
                        Enterprise AI / FinTech
                      </p>
                    </div>
                  </div>
                  <span className="bg-primary-fixed text-on-primary-fixed font-label-caps text-[10px] px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>

                <div className="space-y-3 py-2">
                  <div className="flex justify-between text-xs font-body-md text-on-surface-variant">
                    <span>Target Capital</span>
                    <span className="font-bold text-on-surface">₹8.5M (Series A)</span>
                  </div>
                  <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full rounded-full" style={{ width: "80%" }} />
                  </div>
                  <div className="flex justify-between text-[11px] font-label-caps text-on-surface-variant">
                    <span>80% Subscribed</span>
                    <span>5 Days Remaining</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border-subtle flex justify-between items-center">
                  <div>
                    <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                      Min Ticket
                    </p>
                    <p className="font-headline-md text-base text-on-surface font-bold">
                      ₹500K
                    </p>
                  </div>
                  <Link
                    href="/opportunities/ledgerflow-ai"
                    className="text-primary-container hover:text-primary font-button-text text-sm flex items-center gap-1 font-semibold"
                  >
                    View Details
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* TOP OPPORTUNITIES SHOWCASE */}
        {/* ============================================================ */}
        <section className="bg-surface-pure py-20 px-margin-mobile md:px-margin-desktop border-t border-border-subtle">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
              <div>
                <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mb-2">
                  Featured Opportunities
                </h2>
                <p className="font-body-lg text-on-surface-variant">
                  A curated selection of high-growth ventures currently seeking institutional capital.
                </p>
              </div>
              <Link
                href="/opportunities"
                className="font-button-text text-primary flex items-center gap-1 hover:text-surface-tint font-semibold transition-colors"
              >
                View All Opportunities
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            {featuredOpps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {featuredOpps.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    featured
                    onEnquire={handleEnquire}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#F4FAFD] rounded-2xl border border-[#DCECF2] p-8">
                <span className="material-symbols-outlined text-[36px] text-slate-300 mb-2 block">
                  storefront
                </span>
                <p className="text-sm font-semibold text-[#0A192A] mb-1">
                  No Approved Opportunities Currently Listed
                </p>
                <p className="text-xs text-[#5F7180]">
                  New verified investment opportunities will be featured here as they are published.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* PROMINENT CTA: GET LISTED AS AN INVESTOR */}
        {/* ============================================================ */}
        <section className="w-full py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-gradient-to-b from-[#F4FAFD] via-white to-[#F4FAFD] border-t border-b border-[#DCECF2]">
          <div className="max-w-container-max mx-auto">
            <div className="bg-gradient-to-br from-white to-[#F8FCFE] rounded-2xl md:rounded-3xl p-8 md:p-12 border border-[#DCECF2] shadow-[0px_8px_30px_rgba(10,25,42,0.06)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative overflow-hidden">
              {/* Decorative subtle ambient circle */}
              <div className="absolute -right-16 -top-16 w-72 h-72 bg-[#00A6E8]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF6FC] text-[#00658F] font-bold text-xs mb-3 border border-[#00A6E8]/20">
                  <span className="material-symbols-outlined text-[16px] text-[#00A6E8]">verified</span>
                  <span>Investor Discovery Program</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0A192A] mb-3 font-heading tracking-tight">
                  Get Listed as an Investor
                </h2>
                <p className="text-base sm:text-lg text-[#5F7180] leading-relaxed">
                  Create your investor profile and let entrepreneurs discover your investment interests, expertise and experience.
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-[#00658F] flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    Admin approval & verification
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    Public directory discovery
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    Direct entrepreneur interest
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 relative z-10 w-full lg:w-auto">
                <Link
                  href="/profile/investor"
                  className="inline-flex items-center justify-center gap-2 bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-base px-8 py-4 rounded-xl shadow-[0px_4px_16px_rgba(0,166,232,0.35)] transition-all hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                  <span>Get Listed as an Investor</span>
                </Link>
                <Link
                  href="/investors"
                  className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#F4FAFD] text-[#0A192A] font-bold text-sm px-6 py-4 rounded-xl border border-[#DCECF2] transition-colors"
                >
                  <span>Explore Directory</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* "MORE THAN CAPITAL. BUILD CONNECTIONS." SECTION */}
        {/* ============================================================ */}
        <section className="relative py-20 md:py-24 px-margin-mobile md:px-margin-desktop bg-gradient-to-b from-surface via-[#F7FBFD] to-surface border-b border-border-subtle overflow-hidden">
          {/* Subtle Grid with Fade on Top, Bottom, and Sides */}
          <div
            className="absolute inset-0 pointer-events-none opacity-35"
            style={{
              backgroundImage: `linear-gradient(to right, #DCECF2 1px, transparent 1px), linear-gradient(to bottom, #DCECF2 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, transparent 100%)",
            }}
          />

          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-[#EEF9FD] rounded-full blur-3xl pointer-events-none -z-10 opacity-70" />

          <div className="max-w-container-max mx-auto relative z-10">
            {/* Centered Heading */}
            <div className="text-center max-w-3xl mx-auto mb-3">
              <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface tracking-tight leading-[1.15]">
                More Than Capital. <br />
                Build Connections.
              </h2>
            </div>

            {/* Connecting Vertical Line Indicator */}
            <div className="w-[1.5px] h-9 bg-primary-container/40 mx-auto mb-10" />

            {/* 3 Working Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1: Discover Opportunities */}
              <div className="bg-surface-pure rounded-xl p-8 border border-border-subtle shadow-[0px_4px_20px_rgba(10,25,42,0.04)] hover:shadow-[0px_8px_30px_rgba(10,25,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-start group">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high text-primary flex items-center justify-center mb-6 group-hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-[28px]">
                    explore
                  </span>
                </div>
                <h3 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface mb-3">
                  Discover Opportunities
                </h3>
                <p className="font-body-md text-sm sm:text-[14.5px] text-on-surface-variant leading-relaxed">
                  Identify emerging ventures across a spectrum of dynamic industries before they hit the mainstream market.
                </p>
              </div>

              {/* Card 2: Explore Sectors */}
              <div className="bg-surface-pure rounded-xl p-8 border border-border-subtle shadow-[0px_4px_20px_rgba(10,25,42,0.04)] hover:shadow-[0px_8px_30px_rgba(10,25,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-start group">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high text-primary flex items-center justify-center mb-6 group-hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-[28px]">
                    category
                  </span>
                </div>
                <h3 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface mb-3">
                  Explore Sectors
                </h3>
                <p className="font-body-md text-sm sm:text-[14.5px] text-on-surface-variant leading-relaxed">
                  Navigate curated industry landscapes, from Deep Tech to Sustainable Energy, guided by data-driven insights.
                </p>
              </div>

              {/* Card 3: Connect */}
              <div className="bg-surface-pure rounded-xl p-8 border border-border-subtle shadow-[0px_4px_20px_rgba(10,25,42,0.04)] hover:shadow-[0px_8px_30px_rgba(10,25,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-start group">
                <div className="w-11 h-11 rounded-lg bg-surface-container-high text-primary flex items-center justify-center mb-6 group-hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-[28px]">
                    handshake
                  </span>
                </div>
                <h3 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface mb-3">
                  Connect
                </h3>
                <p className="font-body-md text-sm sm:text-[14.5px] text-on-surface-variant leading-relaxed">
                  Engage directly with founders and build strategic partnerships that go beyond mere financial transactions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* INVESTOR JOURNEY TIMELINE */}
        {/* ============================================================ */}
        <section className="py-20 md:py-28 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" id="how-it-works">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="font-label-caps text-xs text-primary uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mt-1 mb-3">
              Your Investment Journey
            </h2>
            <p className="font-body-lg text-on-surface-variant">
              A simple, 6-step overview of exploring and connecting with opportunities on Wenturex.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-7 left-12 right-12 h-0.5 bg-border-subtle z-0" />

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
              {investorSteps.map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col items-center text-center bg-surface-pure md:bg-transparent p-5 md:p-0 rounded-xl md:rounded-none border md:border-none border-border-subtle shadow-sm md:shadow-none"
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-button-text text-base relative z-10 transition-colors shadow-sm ${
                      step.active
                        ? "bg-primary-container text-white border-2 border-primary-container"
                        : "bg-surface-pure border-2 border-border-subtle text-on-surface"
                    }`}
                  >
                    {step.num}
                  </div>
                  <h4 className="font-button-text text-sm text-on-surface mt-3 mb-1 font-bold">
                    {step.title}
                  </h4>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FINAL CTA */}
        {/* ============================================================ */}
        <section className="py-20 px-margin-mobile md:px-margin-desktop bg-surface-container-low text-center border-t border-border-subtle">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mb-4">
              Ready to Build Your Portfolio?
            </h2>
            <p className="font-body-lg text-on-surface-variant mb-8">
              Join a network of professional investors and discover the next generation of industry leaders.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/profile/investor"
                className="inline-flex items-center justify-center gap-2 bg-[#00A6E8] text-white font-button-text text-base px-8 py-4 rounded-xl hover:bg-[#0093CE] shadow-[0px_4px_16px_rgba(0,166,232,0.35)] transition-all hover:-translate-y-0.5 font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">badge</span>
                <span>Get Listed as an Investor</span>
              </Link>
              <JoinCta
                roleType="investor"
                singleMode
                href="/signup/investor"
                className="inline-flex items-center justify-center bg-white text-[#00658F] font-button-text text-base px-8 py-4 rounded-xl border border-[#DCECF2] hover:bg-[#F4FAFD] transition-colors font-bold"
                alternateLabel="Join Also as Entrepreneur"
                alternateHref="/signup/entrepreneur"
                bothRolesLabel="Explore Wenturex"
                bothRolesHref="/opportunities"
              >
                Join as Investor
              </JoinCta>
            </div>
          </div>
        </section>
      </main>

      <OpportunityEnquiryModal
        opportunity={selectedOpportunity}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
