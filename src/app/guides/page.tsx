import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { GuideCard } from "@/components/cards/guide-card";
import { GUIDES } from "@/lib/constants/guides";

export const metadata: Metadata = {
  title: "Investment & Business Guides | Wenturex India International",
  description:
    "Institutional frameworks, term sheet breakdowns, venture capital strategies, angel investing playbooks, and franchise evaluation guides.",
};

export default function GuidesHubPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-container selection:text-white">
      <Navbar />

      <main className="flex-grow py-12 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="font-label-caps text-xs text-primary uppercase tracking-wider font-semibold">
              Knowledge Base & Advisory
            </span>
            <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface mt-1 mb-4 tracking-tight">
              Business & Investment Guides
            </h1>
            <p className="font-body-lg text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Curated masterclasses and strategic blueprints for founders, corporate leaders, and institutional capital allocators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {GUIDES.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
