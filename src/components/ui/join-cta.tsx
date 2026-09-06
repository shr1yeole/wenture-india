"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth-context";
import { cn } from "@/lib/utils";

export interface JoinCtaProps {
  roleType: "entrepreneur" | "investor";
  href?: string;
  className?: string;
  children?: React.ReactNode;
  singleMode?: boolean;
}

/**
 * Role-aware Join CTA component (Single-Role Architecture).
 * - Logged-out users: show “Join as Entrepreneur” / “Join as Investor”.
 * - Logged-in Entrepreneur: on entrepreneur pages shows "Manage Listings" or hides redundant join button.
 * - Logged-in Investor: on investor pages shows "My Investor Profile" or hides redundant join button.
 */
export function JoinCta({
  roleType,
  href,
  className,
  children,
  singleMode = false,
}: JoinCtaProps) {
  const { isAuthenticated, isEntrepreneur, isInvestor, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultHref = href || (roleType === "entrepreneur" ? "/signup/entrepreneur" : "/signup/investor");
  const defaultText = children || (roleType === "entrepreneur" ? "Join as Entrepreneur" : "Join as Investor");

  // SSR / Loading state: render stable default button
  if (!mounted || loading || !isAuthenticated) {
    return (
      <Link href={defaultHref} className={className}>
        {defaultText}
      </Link>
    );
  }

  // 1. Logged-in Entrepreneur
  if (isEntrepreneur) {
    if (roleType === "entrepreneur") {
      if (singleMode) {
        return (
          <Link href="/profile/listings" className={className}>
            Manage Business Listings
          </Link>
        );
      }
      return null;
    }
    return null;
  }

  // 2. Logged-in Investor
  if (isInvestor) {
    if (roleType === "investor") {
      if (singleMode) {
        return (
          <Link href="/profile/investor" className={className}>
            My Investor Profile
          </Link>
        );
      }
      return null;
    }
    return null;
  }

  // Fallback for authenticated general user
  return (
    <Link href={defaultHref} className={className}>
      {defaultText}
    </Link>
  );
}

/**
 * Coordinated role-aware CTA group for areas where both CTAs appear together (e.g., Homepage hero/footer).
 */
export function RoleCtaGroup({
  className = "flex flex-wrap justify-center gap-3 sm:gap-4",
  investorClassName = "bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-xs sm:text-base px-5 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg transition-all text-center",
  entrepreneurClassName = "bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-base px-5 sm:px-8 py-3 sm:py-4 rounded-xl backdrop-blur-sm transition-all text-center",
  exploreClassName = "bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-xs sm:text-base px-5 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg transition-all text-center",
}: {
  className?: string;
  investorClassName?: string;
  entrepreneurClassName?: string;
  exploreClassName?: string;
}) {
  const { isAuthenticated, isEntrepreneur, isInvestor, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stable default render during SSR, loading, and logged-out state
  if (!mounted || loading || !isAuthenticated) {
    return (
      <div className={className}>
        <Link href="/signup/investor" className={investorClassName}>
          Join as Investor
        </Link>
        <Link href="/signup/entrepreneur" className={entrepreneurClassName}>
          Join as Entrepreneur
        </Link>
      </div>
    );
  }

  // Logged-in Entrepreneur: "Explore Opportunities" + "Manage Business Listings"
  if (isEntrepreneur) {
    return (
      <div className={className}>
        <Link href="/opportunities" className={exploreClassName}>
          Explore Opportunities
        </Link>
        <Link
          href="/profile/listings"
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-base px-5 sm:px-8 py-3 sm:py-4 rounded-xl backdrop-blur-sm transition-all text-center"
        >
          My Listings
        </Link>
      </div>
    );
  }

  // Logged-in Investor: "Explore Opportunities" + "My Investor Profile"
  if (isInvestor) {
    return (
      <div className={className}>
        <Link href="/opportunities" className={exploreClassName}>
          Explore Opportunities
        </Link>
        <Link
          href="/profile/investor"
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-base px-5 sm:px-8 py-3 sm:py-4 rounded-xl backdrop-blur-sm transition-all text-center"
        >
          My Investor Profile
        </Link>
      </div>
    );
  }

  // Authenticated user without specific role set
  return (
    <div className={className}>
      <Link href="/signup/investor" className={investorClassName}>
        Join as Investor
      </Link>
      <Link href="/signup/entrepreneur" className={entrepreneurClassName}>
        Join as Entrepreneur
      </Link>
    </div>
  );
}

/**
 * Single-Role Gateway Cards for the How-It-Works page.
 */
export function HowItWorksGatewayCards() {
  const { isAuthenticated, isEntrepreneur, isInvestor, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const entrepreneurCardHref =
    isAuthenticated && isEntrepreneur ? "/profile/listings" : "/signup/entrepreneur";
  const entrepreneurCardLabel =
    isAuthenticated && isEntrepreneur ? "Manage Your Listings" : "Join as Entrepreneur";

  const investorCardHref =
    isAuthenticated && isInvestor ? "/profile/investor" : "/signup/investor";
  const investorCardLabel =
    isAuthenticated && isInvestor ? "My Investor Profile" : "Join as Investor";

  return (
    <div className="mt-10 sm:mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto">
      {/* Entrepreneur Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-8 border border-[#DCECF2] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center mb-4 sm:mb-5">
            <span className="material-symbols-outlined text-2xl sm:text-[28px]">rocket_launch</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0A192A] mb-2 sm:mb-3">
            For Entrepreneurs &amp; Businesses
          </h3>
          <p className="text-xs sm:text-sm text-[#5F7180] leading-relaxed mb-5 sm:mb-6">
            Present your business, startup, franchise, or trade concept to an active network of investors, franchisees, and commercial partners.
          </p>
        </div>
        <Link
          href={entrepreneurCardHref}
          className="w-full py-3 sm:py-3.5 text-center bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm block"
        >
          {entrepreneurCardLabel}
        </Link>
      </div>

      {/* Investor Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-8 border border-[#DCECF2] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center mb-4 sm:mb-5">
            <span className="material-symbols-outlined text-2xl sm:text-[28px]">account_balance</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0A192A] mb-2 sm:mb-3">
            For Investors &amp; Partners
          </h3>
          <p className="text-xs sm:text-sm text-[#5F7180] leading-relaxed mb-5 sm:mb-6">
            Explore high-potential opportunities across diverse sectors, review business details, express interest, and connect directly.
          </p>
        </div>
        <Link
          href={investorCardHref}
          className="w-full py-3 sm:py-3.5 text-center font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm block bg-[#0A192A] hover:bg-[#1E293B] text-white"
        >
          {investorCardLabel}
        </Link>
      </div>
    </div>
  );
}

