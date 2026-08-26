import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { OPPORTUNITIES, Opportunity } from "@/lib/constants/opportunities";
import { ContactForm } from "@/components/forms/contact-form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return OPPORTUNITIES.map((opp) => ({
    slug: opp.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const opp = OPPORTUNITIES.find((o) => o.slug === slug);
  if (!opp) return { title: "Opportunity Not Found" };

  return {
    title: `${opp.title} (${opp.sector}) | Opportunities | Wenturex`,
    description: opp.shortDescription,
  };
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const opp = OPPORTUNITIES.find((o) => o.slug === slug);

  if (!opp) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-container selection:text-white">
      <Navbar />

      <main className="flex-grow py-12 md:py-16">
        <Container>
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-body-md text-on-surface-variant mb-6">
            <Link href="/opportunities" className="hover:text-primary-container">
              Opportunities
            </Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">{opp.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Details & Narrative */}
            <div className="lg:col-span-8 space-y-8">
              {/* Header Title Card */}
              <div className="bg-surface-pure rounded-2xl p-8 border border-border-subtle shadow-sm">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="primary">{opp.category}</Badge>
                  <span className="bg-surface-container-high text-on-surface-variant font-label-caps text-xs px-2.5 py-1 rounded">
                    {opp.sector}
                  </span>
                  <span className="font-body-md text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {opp.location}
                  </span>
                </div>

                <h1 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mb-4">
                  {opp.title}
                </h1>

                <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed">
                  {opp.overview}
                </p>
              </div>

              {/* Growth Metrics Grid */}
              <div className="bg-surface-pure rounded-2xl p-8 border border-border-subtle shadow-sm">
                <h3 className="font-headline-md text-xl font-bold text-on-surface mb-6">
                  Key Performance Metrics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {opp.growthMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="bg-surface rounded-xl p-5 border border-border-subtle text-center"
                    >
                      <p className="font-label-caps text-xs text-on-surface-variant uppercase mb-1">
                        {metric.label}
                      </p>
                      <p className="font-headline-md text-2xl font-bold text-primary">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights & Strengths */}
              <div className="bg-surface-pure rounded-2xl p-8 border border-border-subtle shadow-sm">
                <h3 className="font-headline-md text-xl font-bold text-on-surface mb-4">
                  Business & Opportunity Highlights
                </h3>
                <ul className="space-y-3">
                  {opp.businessHighlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3 text-on-surface font-body-md text-sm">
                      <span className="material-symbols-outlined text-primary-container text-[20px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Institutional Inquiry Form */}
              <div className="bg-surface-pure rounded-2xl p-8 border border-border-subtle shadow-sm">
                <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
                  Request Deal Room / Information Memorandum
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant mb-6">
                  Fill out your details to request an NDA and access confidential financial materials for {opp.title}.
                </p>
                <ContactForm />
              </div>
            </div>

            {/* Right Column: Capital Summary Sticky Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-surface-pure rounded-2xl p-6 border border-border-subtle shadow-sm sticky top-24 space-y-6">
                <div>
                  <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider">
                    Target Capital
                  </span>
                  <div className="font-headline-xl text-3xl font-bold text-on-surface mt-1">
                    {opp.targetRaise}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border-subtle text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Deal Type</span>
                    <span className="font-semibold text-on-surface">{opp.type}</span>
                  </div>

                  {opp.equityOffered && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Equity Allocation</span>
                      <span className="font-semibold text-on-surface">{opp.equityOffered}</span>
                    </div>
                  )}

                  {opp.estRoi && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Est. ROI</span>
                      <span className="font-semibold text-primary">{opp.estRoi}</span>
                    </div>
                  )}

                  {opp.term && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Term</span>
                      <span className="font-semibold text-on-surface">{opp.term}</span>
                    </div>
                  )}
                </div>

                {opp.percentFunded !== undefined && (
                  <div className="pt-4 border-t border-border-subtle">
                    <div className="flex justify-between text-xs font-label-caps text-on-surface-variant mb-1.5">
                      <span>{opp.percentFunded}% Subscribed</span>
                      <span>{opp.daysLeft} Days Left</span>
                    </div>
                    <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary-container h-full rounded-full"
                        style={{ width: `${Math.min(opp.percentFunded, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 space-y-3">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center bg-primary-container text-white font-button-text text-sm py-3.5 rounded-lg hover:bg-surface-tint shadow-sm transition-all"
                  >
                    Direct Inquiry
                  </Link>

                  <Link
                    href="/opportunities"
                    className="w-full inline-flex items-center justify-center bg-transparent border border-border-subtle text-on-surface font-button-text text-sm py-3 rounded-lg hover:bg-surface transition-colors"
                  >
                    Back to All Opportunities
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
