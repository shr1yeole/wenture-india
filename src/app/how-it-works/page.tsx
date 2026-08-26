import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { NetworkMesh } from "@/components/visual/network-mesh";
import { BentoCard } from "@/components/cards/bento-card";

export const metadata: Metadata = {
  title: "How It Works | Wenturex India International",
  description:
    "Explore how Wenturex bridges vision and capital through structured due diligence, matchmaking, and growth syndicates.",
};

export default function HowItWorksPage() {
  const narrativePillars = [
    {
      step: "01",
      title: "Entrepreneurs",
      desc: "Founders and enterprises submit their business models, growth metrics, and capital requirements in a standardized institutional format.",
    },
    {
      step: "02",
      title: "Wenturex Advisory & Due Diligence",
      desc: "Our vetting framework validates financials, compliance, market traction, and deal readiness before presenting to our network.",
    },
    {
      step: "03",
      title: "Institutional Investors",
      desc: "Venture capital firms, family offices, and verified angel syndicates explore high-conviction deal flow aligned with their thesis.",
    },
    {
      step: "04",
      title: "Strategic Connections & Growth",
      desc: "Facilitated discussions, confidential deal rooms, and syndicate formations empower enterprises to scale and grow together.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-container selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Header / Hero */}
        <section className="pt-16 md:pt-24 pb-16 bg-surface-pure border-b border-border-subtle">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-border-subtle text-primary font-label-caps text-xs mb-4">
                Architecture of Connectivity
              </div>
              <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface mb-4 tracking-tight">
                How Wenturex Works
              </h1>
              <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed">
                A common online platform to connect entrepreneurs with investors, vision with capital, ideas with funds and giving wings to dreams.
              </p>
            </div>

            <div className="mt-12 max-w-2xl mx-auto bg-surface rounded-2xl p-6 border border-border-subtle shadow-sm">
              <div className="h-64 sm:h-72 w-full flex items-center justify-center">
                <NetworkMesh variant="hero" />
              </div>
            </div>
          </Container>
        </section>

        {/* 4-Phase Ecosystem Narrative */}
        <section className="py-20 bg-surface">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mb-3">
                The 4 Pillars of Connection
              </h2>
              <p className="font-body-lg text-on-surface-variant">
                From initial submission to capital deployment and continuous enterprise scaling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {narrativePillars.map((pillar) => (
                <div
                  key={pillar.step}
                  className="bg-surface-pure rounded-xl p-6 border border-border-subtle shadow-sm flex flex-col justify-between relative group hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <span className="font-display-lg-mobile text-3xl font-extrabold text-primary-container/40 group-hover:text-primary-container transition-colors">
                      {pillar.step}
                    </span>
                    <h3 className="font-headline-md text-xl font-bold text-on-surface mt-2 mb-3">
                      {pillar.title}
                    </h3>
                    <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Dual Track Comparison */}
        <section className="py-20 bg-surface-container-low border-y border-border-subtle">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="bg-surface-pure rounded-2xl p-8 border border-border-subtle shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
                </div>
                <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-4">
                  For Entrepreneurs & Founders
                </h3>
                <ul className="space-y-3 font-body-md text-sm text-on-surface-variant">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">check</span>
                    Direct exposure to verified institutional syndicates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">check</span>
                    Standardized data rooms & presentation decks
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">check</span>
                    Confidentiality and intellectual property protection
                  </li>
                </ul>
                <div className="mt-8">
                  <Link
                    href="/signup/entrepreneur"
                    className="inline-flex items-center justify-center bg-primary-container text-white px-6 py-3 rounded-lg font-button-text text-sm hover:bg-surface-tint"
                  >
                    Start Founder Application
                  </Link>
                </div>
              </div>

              <div className="bg-surface-pure rounded-2xl p-8 border border-border-subtle shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[28px]">account_balance</span>
                </div>
                <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-4">
                  For Investors & Syndicates
                </h3>
                <ul className="space-y-3 font-body-md text-sm text-on-surface-variant">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">check</span>
                    Vetted high-growth deals filtered by sector and ticket size
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">check</span>
                    Comprehensive historical financials and growth models
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">check</span>
                    Direct founder access and co-investment syndication
                  </li>
                </ul>
                <div className="mt-8">
                  <Link
                    href="/signup/investor"
                    className="inline-flex items-center justify-center bg-on-surface text-white px-6 py-3 rounded-lg font-button-text text-sm hover:bg-surface-tint"
                  >
                    Join as Verified Investor
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
