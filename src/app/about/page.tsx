import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { COMPANY } from "@/lib/constants/company";
import { BentoCard } from "@/components/cards/bento-card";

export const metadata: Metadata = {
  title: "About Wenturex | Omniverse Technologies Private Limited",
  description:
    "Learn about Wenturex India International — our mission, vision, and core positioning as an institutional business ecosystem.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-container selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="pt-16 md:pt-24 pb-16 bg-surface-pure border-b border-border-subtle">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-border-subtle text-primary font-label-caps text-xs mb-4">
                Corporate Overview
              </div>
              <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface mb-4 tracking-tight">
                About Wenturex
              </h1>
              <p className="font-headline-md text-2xl text-secondary font-medium mb-4">
                {COMPANY.tagline}
              </p>
              <p className="font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed">
                {COMPANY.corePositioning}
              </p>
            </div>
          </Container>
        </section>

        {/* Core Pillars */}
        <section className="py-20 bg-surface">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mb-3">
                Our Institutional Focus
              </h2>
              <p className="font-body-lg text-on-surface-variant">
                Built to provide a secure, transparent, and structured environment for capital deployment and enterprise expansion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <BentoCard
                icon="hub"
                title="Connect"
                description="Creating direct, verified conduits between visionary entrepreneurs and institutional capital providers, venture funds, and angel syndicates."
              />

              <BentoCard
                icon="construction"
                title="Build"
                description="Providing standardized deal documentation, structured evaluation frameworks, and due diligence resources to build resilient enterprises."
              />

              <BentoCard
                icon="trending_up"
                title="Scale & Grow Together"
                description="Facilitating strategic alliances, master franchise rollouts, and international export partnerships that foster long-term value creation."
              />
            </div>
          </Container>
        </section>

        {/* Corporate Legal Information */}
        <section className="py-20 bg-surface-container-low border-y border-border-subtle">
          <Container size="narrow">
            <div className="bg-surface-pure rounded-2xl p-8 md:p-12 border border-border-subtle shadow-sm space-y-6">
              <span className="font-label-caps text-xs text-primary uppercase tracking-wider font-semibold">
                Corporate Governance
              </span>
              <h3 className="font-headline-md text-2xl font-bold text-on-surface">
                Omniverse Technologies Private Limited
              </h3>
              <p className="font-body-md text-base text-on-surface-variant leading-relaxed">
                Wenturex India International operates under <strong>{COMPANY.legalEntity}</strong>, headquartered in New Delhi, India. The company is committed to upholding institutional integrity, data confidentiality, and regulatory compliance across all business networking and advisory activities.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border-subtle text-sm">
                <div>
                  <h4 className="font-label-caps text-xs text-on-surface-variant uppercase mb-1">
                    Registered Office
                  </h4>
                  <p className="font-body-md text-on-surface">
                    {COMPANY.contact.address}
                  </p>
                </div>
                <div>
                  <h4 className="font-label-caps text-xs text-on-surface-variant uppercase mb-1">
                    Official Inquiries
                  </h4>
                  <p className="font-body-md text-on-surface">
                    {COMPANY.contact.businessEmail}
                  </p>
                  <p className="font-body-md text-on-surface">
                    {COMPANY.contact.phone}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Link
                  href="/contact"
                  className="bg-primary-container text-white px-6 py-3 rounded-lg font-button-text text-sm hover:bg-surface-tint"
                >
                  Contact Management
                </Link>
                <Link
                  href="/opportunities"
                  className="border border-border-subtle text-on-surface px-6 py-3 rounded-lg font-button-text text-sm hover:bg-surface"
                >
                  Explore Opportunities
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
