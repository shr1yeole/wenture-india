"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { OpportunityCard } from "@/components/cards/opportunity-card";
import { OpportunityEnquiryModal } from "@/components/forms/opportunity-enquiry-modal";
import { OPPORTUNITIES, Opportunity } from "@/lib/constants/opportunities";

export default function ForInvestorsPage() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const featuredOpps = OPPORTUNITIES.slice(0, 3);

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

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/signup/investor"
                  className="inline-flex items-center justify-center bg-primary-container text-white font-button-text text-base px-8 py-4 rounded-lg hover:bg-surface-tint shadow-[0px_4px_15px_rgba(0,166,232,0.3)] transition-all hover:-translate-y-0.5"
                >
                  Join as Investor
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center text-on-surface font-button-text text-base px-8 py-4 rounded-lg border border-border-subtle hover:bg-surface-container-low transition-colors"
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
        {/* "MORE THAN CAPITAL. BUILD CONNECTIONS." SECTION */}
        {/* ============================================================ */}
        <section className="relative py-20 md:py-24 px-margin-mobile md:px-margin-desktop bg-gradient-to-b from-surface via-[#F7FBFD] to-surface border-y border-border-subtle overflow-hidden">
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
            <Link
              href="/signup/investor"
              className="inline-flex items-center justify-center bg-primary-container text-white font-button-text text-base px-10 py-4 rounded-lg hover:bg-surface-tint transition-all shadow-[0px_4px_15px_rgba(0,166,232,0.3)] hover:-translate-y-0.5"
            >
              Join as Investor
            </Link>
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
