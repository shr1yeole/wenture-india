import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { BentoCard } from "@/components/cards/bento-card";
import { NetworkMesh } from "@/components/visual/network-mesh";
import { JoinCta } from "@/components/ui/join-cta";

export const metadata: Metadata = {
  title: "For Entrepreneurs | Wenturex India International",
  description:
    "Present your vision to a curated network of institutional investors. Elevate your venture from concept to capital with Wenturex.",
};

export default function ForEntrepreneursPage() {
  const journeySteps = [
    { num: 1, title: "Create Your Profile", desc: "Join Wenturex and introduce yourself or your business." },
    { num: 2, title: "Discover Opportunities", desc: "Explore relevant businesses and opportunities." },
    { num: 3, title: "Explore Businesses", desc: "Discover businesses, startups and opportunities across different sectors." },
    { num: 4, title: "Review Information", desc: "Explore the available information about an opportunity." },
    { num: 5, title: "Express Interest", desc: "Submit an enquiry or express interest in an opportunity." },
    { num: 6, title: "Connect", desc: "Connect with the relevant entrepreneur, investor or business.", active: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-container selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-16 md:pt-24 pb-16 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-8 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-border-subtle text-primary font-label-caps text-xs w-fit">
                Founder Ecosystem
              </div>

              <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface leading-tight tracking-tight">
                Your Vision Deserves <br />
                <span className="text-primary-container">the Right Connection.</span>
              </h1>

              <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Present your business to a curated network of institutional investors. We provide the platform to elevate your vision from concept to capital.
              </p>

              {/* Action Buttons: Join, Find Investors & How It Works */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <JoinCta
                  roleType="entrepreneur"
                  singleMode
                  href="/signup/entrepreneur"
                  className="bg-primary-container text-white font-button-text text-base rounded-lg px-8 py-4 hover:bg-surface-tint shadow-[0px_4px_15px_rgba(0,166,232,0.3)] transition-all"
                  alternateLabel="Join Also as Investor"
                  alternateHref="/signup/investor"
                  bothRolesLabel="Explore Wenturex"
                  bothRolesHref="/opportunities"
                >
                  Join as Entrepreneur
                </JoinCta>

                <Link
                  href="/investors"
                  className="bg-white border border-[#DCECF2] hover:border-[#00A6E8] text-[#00658F] font-button-text text-base rounded-lg px-7 py-4 hover:bg-[#F4FAFD] shadow-sm transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#00A6E8]">
                    person_search
                  </span>
                  <span>Find Investors</span>
                </Link>

                <Link
                  href="/how-it-works"
                  className="bg-transparent border border-border-subtle text-on-surface font-button-text text-base rounded-lg px-8 py-4 hover:border-on-surface hover:bg-surface-container-low transition-all"
                >
                  How It Works
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
        {/* INVESTOR DISCOVERY SHOWCASE SECTION */}
        {/* ============================================================ */}
        <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
          <div className="bg-gradient-to-br from-white to-[#F4FAFD] border border-[#DCECF2] rounded-3xl p-8 sm:p-12 shadow-[0px_8px_30px_rgba(10,25,42,0.04)] flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF6FC] border border-[#DCECF2] text-[#00658F] font-bold text-xs">
                <span className="material-symbols-outlined text-[16px] text-[#00A6E8]">
                  verified
                </span>
                <span>Verified Capital Directory</span>
              </div>
              <h2 className="font-headline-xl text-2xl sm:text-3xl font-extrabold text-[#0A192A] tracking-tight font-heading">
                Explore Active Investors &amp; Capital Partners
              </h2>
              <p className="text-sm sm:text-base text-[#5F7180] leading-relaxed">
                Discover verified angel investors, venture capital funds, and institutional financiers actively seeking high-growth opportunities across technology, healthcare, manufacturing, and consumer sectors.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/investors"
                  className="bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">person_search</span>
                  <span>Browse Investor Directory</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>

                <JoinCta
                  roleType="entrepreneur"
                  singleMode
                  href="/signup/entrepreneur"
                  className="bg-white border border-[#DCECF2] hover:bg-slate-50 text-[#0A192A] font-bold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center gap-2"
                  alternateLabel={
                    <>
                      <span className="material-symbols-outlined text-[18px] text-[#00A6E8]">badge</span>
                      <span>Join Also as Investor</span>
                    </>
                  }
                  alternateHref="/signup/investor"
                  bothRolesLabel={
                    <>
                      <span className="material-symbols-outlined text-[18px] text-[#00A6E8]">explore</span>
                      <span>Explore Wenturex</span>
                    </>
                  }
                  bothRolesHref="/opportunities"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#00A6E8]">rocket_launch</span>
                  <span>Register Your Venture</span>
                </JoinCta>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:w-80 shrink-0">
              <div className="p-4 bg-white border border-[#DCECF2] rounded-2xl shadow-sm">
                <span className="material-symbols-outlined text-[24px] text-[#00A6E8] mb-1">
                  groups
                </span>
                <div className="text-base font-extrabold text-[#0A192A]">5+ Types</div>
                <p className="text-[11px] text-[#5F7180] mt-0.5">Angel, VC, Corporate &amp; Financiers</p>
              </div>
              <div className="p-4 bg-white border border-[#DCECF2] rounded-2xl shadow-sm">
                <span className="material-symbols-outlined text-[24px] text-[#00A6E8] mb-1">
                  currency_rupee
                </span>
                <div className="text-base font-extrabold text-[#0A192A]">Flexible</div>
                <p className="text-[11px] text-[#5F7180] mt-0.5">₹5 Lakhs to ₹10 Cr+ Ticket Sizes</p>
              </div>
              <div className="p-4 bg-white border border-[#DCECF2] rounded-2xl shadow-sm">
                <span className="material-symbols-outlined text-[24px] text-[#00A6E8] mb-1">
                  category
                </span>
                <div className="text-base font-extrabold text-[#0A192A]">Multi-Sector</div>
                <p className="text-[11px] text-[#5F7180] mt-0.5">Tech, Retail, Health &amp; Beyond</p>
              </div>
              <div className="p-4 bg-white border border-[#DCECF2] rounded-2xl shadow-sm">
                <span className="material-symbols-outlined text-[24px] text-[#00A6E8] mb-1">
                  handshake
                </span>
                <div className="text-base font-extrabold text-[#0A192A]">Direct</div>
                <p className="text-[11px] text-[#5F7180] mt-0.5">Express Interest to Verified Leads</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* VALUE PROPOSITION SECTION */}
        {/* ============================================================ */}
        <section className="w-full bg-background-alt py-20 border-y border-border-subtle">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mb-3">
                Why Build With Wenturex
              </h2>
              <p className="font-body-lg text-on-surface-variant">
                Strategic resources, verified capital access, and standardized presentation frameworks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
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
        {/* THE WENTUREX JOURNEY SECTION */}
        {/* ============================================================ */}
        <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-label-caps text-xs text-primary uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mt-1">
              The Wenturex Journey
            </h2>
            <p className="font-body-lg text-on-surface-variant mt-2">
              Discover opportunities, explore businesses and build meaningful connections.
            </p>
          </div>

          <div className="relative">
            {/* Desktop Connecting Line */}
            <div className="hidden md:block absolute top-8 left-12 right-12 h-0.5 bg-border-subtle z-0" />

            <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative z-10">
              {journeySteps.map((step) => (
                <div key={step.num} className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-button-text text-lg ambient-shadow relative z-10 transition-transform hover:scale-105 ${
                      step.active
                        ? "bg-primary-container text-white border-2 border-primary-container"
                        : "bg-surface-pure text-on-surface border-2 border-border-subtle"
                    }`}
                  >
                    {step.num}
                  </div>
                  <h4
                    className={`font-button-text text-base mt-4 mb-1 ${
                      step.active ? "text-primary-container font-bold" : "text-on-surface font-semibold"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            <JoinCta
              roleType="entrepreneur"
              singleMode
              href="/signup/entrepreneur"
              className="inline-flex items-center gap-2 bg-primary-container text-white font-button-text text-base rounded-lg px-8 py-4 hover:bg-surface-tint shadow-[0px_4px_15px_rgba(0,166,232,0.3)] transition-all"
              alternateLabel={
                <>
                  <span>Join Also as Investor</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              }
              alternateHref="/signup/investor"
              bothRolesLabel={
                <>
                  <span>Explore Wenturex</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              }
              bothRolesHref="/opportunities"
            >
              <span>Join as Entrepreneur</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </JoinCta>

            <Link
              href="/investors"
              className="inline-flex items-center gap-2 bg-white border border-[#DCECF2] hover:border-[#00A6E8] text-[#00658F] font-button-text text-base rounded-lg px-8 py-4 hover:bg-[#F4FAFD] transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-[#00A6E8]">person_search</span>
              <span>Find Investors</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
