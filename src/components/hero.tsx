import React from "react";
import { Mail, MessageCircle, ArrowRight, Sparkles, ShieldCheck, Compass } from "lucide-react";
import { WentureEmblem } from "@/components/wenture-emblem";
import { NetworkVisual } from "@/components/network-visual";

export function Hero() {
  return (
    <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
      {/* Radiant Background Aura */}
      <div className="radiant-glow-hero" />
      
      {/* Decorative subtle background accents */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-wenture-cyanLight blur-3xl" />
        <div className="absolute top-40 right-10 w-80 h-80 rounded-full bg-sky-100 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Eyebrow Pill Badge with Official Emblem */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/95 border border-slate-200/90 shadow-sm backdrop-blur-md transition-all hover:border-wenture-blue/40">
            <WentureEmblem size={28} />
            <span className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-wenture-navy">
              WENTURE INDIA INTERNATIONAL
            </span>
            <span className="flex h-2 w-2 relative ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wenture-blue opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-wenture-blue" />
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-wenture-dark leading-[1.12]">
            Connect. Build. Scale. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-wenture-blue via-sky-600 to-wenture-dark bg-clip-text text-transparent">
              Grow Together.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
            Wenturex is building a platform that connects entrepreneurs, investors and business opportunities — bringing vision, capital and growth together.
          </p>

          {/* Micro Mission Statement */}
          <div className="p-4 sm:p-5 rounded-2xl bg-wenture-cyanLight/40 border border-wenture-blue/20 max-w-2xl mx-auto text-sm sm:text-base text-slate-700 font-medium leading-normal">
            &ldquo;A common online platform to connect entrepreneurs with investors, vision with capital, ideas with funds and giving wings to dreams.&rdquo;
          </div>

          {/* Call-to-Action Group */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {/* Primary CTA - Email */}
            <a
              href="mailto:wentureindia@gmail.com"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-wenture-dark text-white font-semibold text-base shadow-lg shadow-wenture-dark/15 hover:bg-wenture-navy hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Mail className="w-4 h-4 text-wenture-blueLight" />
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919841881008"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-wenture-dark border border-slate-300/80 font-semibold text-base shadow-sm hover:bg-slate-50 hover:border-emerald-400 hover:text-emerald-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Us</span>
            </a>

            {/* Secondary Badge - Coming Soon */}
            <div className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-wenture-blue" />
              <span>Coming Soon</span>
            </div>
          </div>
        </div>

        {/* SECTION 3 — VISUAL EXPERIENCE */}
        <div className="mt-12 sm:mt-16">
          <NetworkVisual />
        </div>
      </div>
    </section>
  );
}
