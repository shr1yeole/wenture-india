import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { NetworkMesh } from "@/components/visual/network-mesh";
import { JoinCta } from "@/components/ui/join-cta";
import { COMPANY } from "@/lib/constants/company";

export const metadata: Metadata = {
  title: "How It Works | The Wenturex Journey | Wenturex",
  description:
    "Discover how Wenturex connects entrepreneurs and investors through a simple 6-step journey: discover, review, express interest, and connect.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      num: 1,
      title: "Create Your Profile",
      desc: "Join Wenturex and introduce yourself or your business.",
    },
    {
      num: 2,
      title: "Discover Opportunities",
      desc: "Explore relevant businesses and opportunities.",
    },
    {
      num: 3,
      title: "Explore Businesses",
      desc: "Discover businesses, startups and opportunities across sectors.",
    },
    {
      num: 4,
      title: "Review Information",
      desc: "Explore the available information about an opportunity.",
    },
    {
      num: 5,
      title: "Express Interest",
      desc: "Submit an enquiry or express interest.",
    },
    {
      num: 6,
      title: "Connect",
      desc: "Connect with the relevant entrepreneur, investor or business.",
      active: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F6FAFF] selection:bg-[#00A6E8] selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <section className="pt-16 md:pt-24 pb-16 bg-white border-b border-[#DCECF2]">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6FAFF] border border-[#DCECF2] text-[#00658F] font-semibold text-xs mb-4">
                Architecture of Connectivity
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192A] mb-4 tracking-tight font-heading">
                The Wenturex Journey
              </h1>
              <p className="text-sm sm:text-base text-[#5F7180] leading-relaxed max-w-2xl mx-auto">
                {COMPANY.corePositioning}
              </p>
            </div>

            <div className="mt-10 max-w-xl mx-auto bg-[#F6FAFF] rounded-2xl p-6 border border-[#DCECF2] shadow-sm">
              <div className="h-56 w-full flex items-center justify-center">
                <NetworkMesh variant="hero" />
              </div>
            </div>
          </Container>
        </section>

        {/* ============================================================ */}
        {/* 6-STEP WENTUREX JOURNEY */}
        {/* ============================================================ */}
        <section className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
              Step-By-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192A] tracking-tight">
              How Wenturex Works
            </h2>
            <p className="text-sm sm:text-base text-[#5F7180] mt-2">
              Discover opportunities, explore businesses and build meaningful connections.
            </p>
          </div>

          <div className="relative">
            {/* Desktop Connecting Line */}
            <div className="hidden md:block absolute top-8 left-12 right-12 h-0.5 bg-[#DCECF2] z-0" />

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
              {steps.map((step) => (
                <div key={step.num} className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg relative z-10 transition-transform hover:scale-105 shadow-sm ${
                      step.active
                        ? "bg-[#00A6E8] text-white border-2 border-[#00A6E8]"
                        : "bg-white text-[#0A192A] border-2 border-[#DCECF2]"
                    }`}
                  >
                    {step.num}
                  </div>
                  <h4
                    className={`text-sm sm:text-base mt-4 mb-1.5 font-bold ${
                      step.active ? "text-[#00A6E8]" : "text-[#0A192A]"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#5F7180] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dual Gateways */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* For Entrepreneurs */}
            <div className="bg-white rounded-2xl p-8 border border-[#DCECF2] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
                </div>
                <h3 className="text-xl font-bold text-[#0A192A] mb-3">
                  For Entrepreneurs &amp; Businesses
                </h3>
                <p className="text-xs sm:text-sm text-[#5F7180] leading-relaxed mb-6">
                  Present your business, startup, franchise, or trade concept to an active network of investors, franchisees, and commercial partners.
                </p>
              </div>
              <JoinCta
                roleType="entrepreneur"
                singleMode
                href="/for-entrepreneurs"
                className="w-full py-3 text-center bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-xs rounded-xl transition-colors shadow-sm block"
                alternateLabel="Join Also as Investor"
                alternateHref="/signup/investor"
                bothRolesLabel="Explore Opportunities"
                bothRolesHref="/opportunities"
              >
                Join as Entrepreneur
              </JoinCta>
            </div>

            {/* For Investors */}
            <div className="bg-white rounded-2xl p-8 border border-[#DCECF2] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[28px]">account_balance</span>
                </div>
                <h3 className="text-xl font-bold text-[#0A192A] mb-3">
                  For Investors &amp; Partners
                </h3>
                <p className="text-xs sm:text-sm text-[#5F7180] leading-relaxed mb-6">
                  Explore high-potential opportunities across diverse sectors, review business details, express interest, and connect directly.
                </p>
              </div>
              <JoinCta
                roleType="investor"
                singleMode
                href="/for-investors"
                className="w-full py-3 text-center bg-[#0A192A] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl transition-colors shadow-sm block"
                alternateLabel="Join Also as Entrepreneur"
                alternateHref="/signup/entrepreneur"
                bothRolesLabel="Explore Opportunities"
                bothRolesHref="/opportunities"
              >
                Join as Investor
              </JoinCta>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
