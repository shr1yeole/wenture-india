import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { BentoCard } from "@/components/cards/bento-card";
import { NetworkMesh } from "@/components/visual/network-mesh";
import { JoinCta } from "@/components/ui/join-cta";
import { ActiveInvestorsShowcase } from "@/components/sections/active-investors-showcase";
import { EntrepreneurBottomCta } from "@/components/sections/entrepreneur-bottom-cta";

export const metadata: Metadata = {
  title: "For Entrepreneurs | Wenture India International",
  description:
    "Present your vision to a curated network of institutional investors. Elevate your venture from concept to capital with Wenture India.",
};

export default function ForEntrepreneursPage() {


  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-container selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <section className="w-full max-w-container-max mx-auto px-3.5 sm:px-6 md:px-margin-desktop pt-8 sm:pt-14 md:pt-24 pb-10 sm:pb-16 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-gutter items-center">
            <div className="md:col-span-8 flex flex-col gap-3 sm:gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-border-subtle text-primary font-label-caps text-xs w-fit">
                Founder Ecosystem
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface leading-tight tracking-tight font-heading">
                Your Vision Deserves <br />
                <span className="text-primary-container">the Right Connection.</span>
              </h1>

              <p className="text-xs sm:text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Present your business to a curated network of institutional investors. We provide the platform to elevate your vision from concept to capital.
              </p>

              {/* Action Buttons: Join & Find Investors */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
                <JoinCta
                  roleType="entrepreneur"
                  href="/signup/entrepreneur"
                  className="bg-primary-container text-white font-button-text text-xs sm:text-base rounded-xl px-5 sm:px-8 py-2.5 sm:py-4 hover:bg-surface-tint shadow-[0px_4px_15px_rgba(0,166,232,0.3)] transition-all"
                >
                  Join as Entrepreneur
                </JoinCta>

                <Link
                  href="/investors"
                  className="bg-white border border-[#DCECF2] hover:border-[#00A6E8] text-[#00658F] font-button-text text-xs sm:text-base rounded-xl px-4 sm:px-7 py-2.5 sm:py-4 hover:bg-[#F4FAFD] shadow-xs transition-all flex items-center gap-1.5 sm:gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-[#00A6E8]">
                    person_search
                  </span>
                  <span>Find Investors</span>
                </Link>
              </div>
            </div>

            <div className="md:col-span-4 hidden md:flex items-center justify-center">
              <div className="w-full h-72 bg-surface-pure rounded-2xl p-4 border border-border-subtle shadow-sm flex items-center justify-center">
                <NetworkMesh variant="card" />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ACTIVE INVESTORS SHOWCASE SECTION */}
        {/* ============================================================ */}
        <ActiveInvestorsShowcase />

        {/* ============================================================ */}
        {/* VALUE PROPOSITION SECTION */}
        {/* ============================================================ */}
        <section className="w-full bg-background-alt py-10 sm:py-16 md:py-20 border-y border-border-subtle">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface mb-2 sm:mb-3 font-heading">
                Why Build With Wenture India
              </h2>
              <p className="text-xs sm:text-base text-on-surface-variant">
                Strategic resources, verified capital access, and standardized presentation frameworks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-gutter">
              <BentoCard
                icon="swipe_vertical"
                title="Present Your Business"
                description="Showcase your growth metrics, business model, and vision in a standardized, premium format designed to capture institutional attention."
              />

              <BentoCard
                icon="hub"
                title="Connect With Investors"
                description="Gain direct access to a verified network of venture capitalists, private equity firms, and strategic angel investors actively seeking opportunities."
              />

              <BentoCard
                icon="handshake"
                title="Build Strategic Relationships"
                description="Go beyond capital. Cultivate partnerships with industry leaders who bring expertise, networks, and operational guidance to scale your venture."
              />
            </div>
          </Container>
        </section>

        {/* ============================================================ */}
        {/* DYNAMIC BOTTOM CTA */}
        {/* ============================================================ */}
        <EntrepreneurBottomCta />
      </main>

      <Footer />
    </div>
  );
}
