"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Layers, Send } from "lucide-react";

export function ComingSoonCard() {
  const [emailInput, setEmailInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) return;
    
    // Smoothly redirect to email client with pre-filled subject/body or show success note
    window.location.href = `mailto:wentureindia@gmail.com?subject=Early Access & Inquiry - Wenturex Platform&body=Hello Wenturex Team,%0D%0A%0D%0AI would like to stay connected regarding platform updates and opportunities.%0D%0A%0D%0AMy email: ${encodeURIComponent(
      emailInput
    )}`;
    setSubmitted(true);
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-wenture-dark text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-slate-800">
          {/* Background Ambient Radial Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-wenture-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
          
          {/* Subtle grid pattern inside dark container */}
          <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs sm:text-sm font-semibold text-wenture-cyanLight">
              <Sparkles className="w-4 h-4 text-wenture-blueLight animate-pulse" />
              <span>Platform Development in Progress</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Something meaningful is coming.
            </h2>

            {/* Supporting Copy */}
            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
              We&apos;re building a new digital experience for entrepreneurs, investors and businesses. Stay connected with Wenturex.
            </p>

            {/* Subtle Animated Progress / Momentum Element (No fake dates or countdowns) */}
            <div className="pt-2 max-w-lg mx-auto space-y-2 text-left">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5 text-wenture-cyanLight">
                  <span className="w-1.5 h-1.5 rounded-full bg-wenture-blue animate-ping" />
                  Building Core Infrastructure
                </span>
                <span>Active Engineering Phase</span>
              </div>
              <div className="relative h-2 w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/60 shadow-inner">
                {/* Glowing forward moving gradient beam */}
                <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-wenture-blue via-sky-400 to-wenture-blueLight rounded-full shadow-glow-sm" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-wave" />
              </div>
            </div>

            {/* Stay Connected Form / Direct Link */}
            <div className="pt-4 max-w-md mx-auto">
              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-center gap-2.5 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-700/80 shadow-lg focus-within:border-wenture-blue transition-colors"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email to connect..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                    aria-label="Email address for early updates and inquiries"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-wenture-blue hover:bg-wenture-blueHover active:scale-95 text-wenture-dark font-bold text-sm transition-all shadow-md"
                  >
                    <span>Connect</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-wenture-blue/20 border border-wenture-blue/40 text-sm text-wenture-cyanLight flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-wenture-blue" />
                  <span>Thank you! Opening your email to connect directly.</span>
                </div>
              )}
            </div>

            {/* Quick Pillars Footer */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-wenture-blueLight" />
                Verified Opportunities
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-wenture-blueLight" />
                Curated Matching
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-wenture-blueLight" />
                Institutional-Grade Trust
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
