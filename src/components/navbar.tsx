import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { MessageCircle, ArrowRight, Mail } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Wordmark & Emblem */}
        <Link
          href="/"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wenture-blue rounded-lg p-1 transition-opacity hover:opacity-90"
          aria-label="Wenturex India International - Home"
        >
          <BrandLogo size="md" />
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Subtle Status Indicator */}
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wenture-cyanLight/70 border border-wenture-blue/20 text-xs font-semibold text-wenture-navy">
            <span className="w-2 h-2 rounded-full bg-wenture-blue animate-ping" />
            <span className="relative inline-flex w-2 h-2 -ml-3 rounded-full bg-wenture-blue" />
            <span>Platform Coming Soon</span>
          </div>

          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/919841881008"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/80 hover:bg-emerald-100/80 hover:border-emerald-300 transition-all duration-200 shadow-sm"
            aria-label="Connect on WhatsApp (+91 98418 81008)"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          {/* Primary CTA - Get in Touch */}
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-wenture-dark text-white text-sm font-semibold hover:bg-wenture-navy active:scale-95 transition-all duration-200 shadow-sm hover:shadow-glow-sm"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-3.5 h-3.5 text-wenture-blueLight" />
          </a>
        </div>
      </div>
    </header>
  );
}
