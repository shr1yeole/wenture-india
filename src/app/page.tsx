"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { NetworkMesh } from "@/components/visual/network-mesh";
import { OpportunityCard } from "@/components/cards/opportunity-card";
import { GuideCard } from "@/components/cards/guide-card";
import { OpportunityEnquiryModal } from "@/components/forms/opportunity-enquiry-modal";
import { OPPORTUNITIES, Opportunity } from "@/lib/constants/opportunities";
import { GUIDES } from "@/lib/constants/guides";
import { COMPANY } from "@/lib/constants/company";
import { motion } from "framer-motion";

export default function HomePage() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const featuredOpps = OPPORTUNITIES.slice(0, 3);
  const previewGuides = GUIDES.slice(0, 3);

  const handleEnquire = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-container selection:text-white">
      {/* Sticky Navigation */}
      <Navbar />

      <main className="flex-grow flex flex-col w-full overflow-hidden">
        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <section className="relative pt-16 md:pt-24 pb-20 md:pb-section-gap overflow-hidden">
          {/* Subtle Ambient Decorative Gradient from Stitch */}
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-surface-container to-transparent opacity-60 -z-10 rounded-l-[120px] pointer-events-none" />

          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline, Tagline & CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 flex flex-col"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-border-subtle text-primary font-label-caps text-xs w-fit mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                  Institutional Business Ecosystem
                </div>

                <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface mb-stack-md leading-[1.1] tracking-tight">
                  Where Vision <br />
                  <span className="text-primary-container">Meets Capital.</span>
                </h1>

                <p className="font-headline-md text-2xl md:text-3xl text-secondary font-medium mb-stack-md">
                  {COMPANY.tagline}
                </p>

                <p className="font-body-lg text-lg text-on-surface-variant mb-stack-lg max-w-xl leading-relaxed">
                  {COMPANY.corePositioning}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
                  <Link
                    href="/signup"
                    className="bg-primary-container text-white px-8 py-4 rounded-lg font-button-text text-base hover:bg-surface-tint transition-all duration-300 shadow-[0px_4px_15px_rgba(0,166,232,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    Get Started
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </Link>

                  <Link
                    href="/opportunities"
                    className="bg-transparent border-2 border-border-subtle text-on-surface px-8 py-4 rounded-lg font-button-text text-base hover:border-on-surface transition-all duration-300 flex items-center justify-center gap-2 hover:bg-surface-container-low"
                  >
                    View Opportunities
                  </Link>
                </div>
              </motion.div>

              {/* Right Column: Interactive Network Mesh Graphic */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="lg:col-span-5 relative flex items-center justify-center"
              >
                <div className="w-full bg-surface-pure/80 backdrop-blur-md rounded-2xl p-6 border border-border-subtle shadow-[0px_8px_30px_rgba(10,25,42,0.06)] relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-border-subtle">
                    <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider">
                      Live Ecosystem Nodes
                    </span>
                    <span className="font-label-caps text-xs text-primary-container font-semibold">
                      Institutional Matchmaking
                    </span>
                  </div>

                  <div className="h-64 sm:h-72 w-full flex items-center justify-center">
                    <NetworkMesh variant="hero" />
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-subtle flex justify-between items-center text-xs text-on-surface-variant font-body-md">
                    <span>Entrepreneurs ➔ Deal Flow</span>
                    <span className="font-semibold text-primary">Active Verified Capital</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ============================================================ */}
        {/* ROLE GATEWAYS SECTION (From Stitch Discover Screen) */}
        {/* ============================================================ */}
        <section className="py-16 md:py-24 bg-surface-pure relative border-y border-border-subtle">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mb-3">
                Tailored Gateways
              </h2>
              <p className="font-body-lg text-base text-on-surface-variant">
                Whether you are building the future or deploying institutional capital, Wenturex provides the dedicated infrastructure you need.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {/* Entrepreneur Gateway */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-surface border border-border-subtle hover:border-primary-container/60 rounded-xl p-8 md:p-10 card-shadow card-hover transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-36 h-36 bg-primary-container opacity-5 rounded-bl-[100px] transition-transform group-hover:scale-150 duration-500 pointer-events-none" />

                <div>
                  <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6 border border-border-subtle group-hover:bg-primary-container/10 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[32px]">lightbulb</span>
                  </div>

                  <h3 className="font-headline-md text-3xl text-on-surface mb-3 font-semibold">
                    Entrepreneur
                  </h3>

                  <p className="font-body-md text-base text-on-surface-variant mb-8 leading-relaxed">
                    Present your vision, build your network, and connect with potential capital to scale your business to institutional heights.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border-subtle/60">
                  <Link
                    href="/signup/entrepreneur"
                    className="bg-primary-container text-white px-6 py-2.5 rounded-lg font-button-text text-sm hover:bg-surface-tint transition-colors duration-300 shadow-sm"
                  >
                    Pitch Idea
                  </Link>
                  <Link
                    href="/for-entrepreneurs"
                    className="text-on-surface font-button-text text-sm hover:text-primary-container transition-colors flex items-center gap-1"
                  >
                    Learn More
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </Link>
                </div>
              </motion.div>

              {/* Investor Gateway */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-surface border border-border-subtle hover:border-primary-container/60 rounded-xl p-8 md:p-10 card-shadow card-hover transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-36 h-36 bg-surface-tint opacity-5 rounded-bl-[100px] transition-transform group-hover:scale-150 duration-500 pointer-events-none" />

                <div>
                  <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6 border border-border-subtle group-hover:bg-primary-container/10 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[32px]">account_balance</span>
                  </div>

                  <h3 className="font-headline-md text-3xl text-on-surface mb-3 font-semibold">
                    Investor
                  </h3>

                  <p className="font-body-md text-base text-on-surface-variant mb-8 leading-relaxed">
                    Discover vetted businesses, high-growth ideas, and exclusive investment opportunities in a compliant, data-forward environment.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border-subtle/60">
                  <Link
                    href="/opportunities"
                    className="bg-on-surface text-white px-6 py-2.5 rounded-lg font-button-text text-sm hover:bg-surface-tint transition-colors duration-300 shadow-sm"
                  >
                    Browse Deals
                  </Link>
                  <Link
                    href="/for-investors"
                    className="text-on-surface font-button-text text-sm hover:text-primary-container transition-colors flex items-center gap-1"
                  >
                    Join Syndicate
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ============================================================ */}
        {/* FEATURED OPPORTUNITIES SECTION */}
        {/* ============================================================ */}
        <section className="py-16 md:py-24 bg-surface">
          <Container>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
              <div>
                <span className="font-label-caps text-xs text-primary uppercase tracking-wider">
                  Curated Deal Flow
                </span>
                <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mt-1">
                  Top Opportunities
                </h2>
              </div>
              <Link
                href="/opportunities"
                className="font-button-text text-primary-container hover:text-primary flex items-center gap-1 text-sm font-semibold transition-colors"
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
          </Container>
        </section>

        {/* ============================================================ */}
        {/* SECTORS DISCOVERY */}
        {/* ============================================================ */}
        <section className="py-16 md:py-20 bg-surface-container-low border-y border-border-subtle">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface mb-2">
                Ecosystem Categories
              </h2>
              <p className="font-body-md text-on-surface-variant">
                Explore deals and partnerships across high-growth industry sectors.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "FinTech", icon: "payments", count: "24 Deals" },
                { name: "CleanTech", icon: "bolt", count: "18 Deals" },
                { name: "Logistics", icon: "local_shipping", count: "15 Deals" },
                { name: "Real Estate", icon: "domain", count: "12 Deals" },
                { name: "Franchise", icon: "storefront", count: "30 Deals" },
                { name: "EXIM", icon: "public", count: "14 Deals" },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href={`/opportunities?sector=${cat.name}`}
                  className="bg-surface-pure rounded-xl p-5 border border-border-subtle hover:border-primary-container text-center group hover:-translate-y-1 transition-all duration-200 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-lg bg-surface-container text-primary-container flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                  </div>
                  <h4 className="font-button-text text-sm text-on-surface font-semibold group-hover:text-primary-container">
                    {cat.name}
                  </h4>
                  <span className="font-label-caps text-[11px] text-on-surface-variant mt-1 block">
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* ============================================================ */}
        {/* INVESTMENT & BUSINESS GUIDES */}
        {/* ============================================================ */}
        <section className="py-16 md:py-24 bg-surface">
          <Container>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
              <div>
                <span className="font-label-caps text-xs text-primary uppercase tracking-wider">
                  Knowledge & Advisory
                </span>
                <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mt-1">
                  Business & Investment Guides
                </h2>
              </div>
              <Link
                href="/guides"
                className="font-button-text text-primary-container hover:text-primary flex items-center gap-1 text-sm font-semibold transition-colors"
              >
                View All Guides
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {previewGuides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </Container>
        </section>

        {/* ============================================================ */}
        {/* FINAL CALL TO ACTION */}
        {/* ============================================================ */}
        <section className="py-20 bg-surface-container-low text-center border-t border-border-subtle relative overflow-hidden">
          <Container size="narrow">
            <h2 className="font-display-lg-mobile md:font-headline-xl text-3xl md:text-5xl font-bold text-on-surface mb-4">
              Ready to Accelerate Your Journey?
            </h2>
            <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
              Join a verified institutional community connecting visionary entrepreneurs with catalytic capital.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/signup/entrepreneur"
                className="bg-primary-container text-white px-8 py-4 rounded-lg font-button-text text-base hover:bg-surface-tint shadow-[0px_4px_15px_rgba(0,166,232,0.3)] transition-all"
              >
                Join as Entrepreneur
              </Link>
              <Link
                href="/signup/investor"
                className="bg-on-surface text-white px-8 py-4 rounded-lg font-button-text text-base hover:bg-surface-tint transition-all"
              >
                Join as Investor
              </Link>
            </div>
          </Container>
        </section>
      </main>

      {/* Enquiry Modal */}
      <OpportunityEnquiryModal
        opportunity={selectedOpportunity}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
