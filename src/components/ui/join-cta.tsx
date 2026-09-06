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
  /**
   * If true, this CTA is a standalone hero button that shows the alternate
   * role if the user already has this role, or Explore Wenture India if both.
   */
  singleMode?: boolean;
  alternateLabel?: React.ReactNode;
  alternateHref?: string;
  alternateClassName?: string;
  showExploreWhenBoth?: boolean;
  bothRolesLabel?: React.ReactNode;
  bothRolesHref?: string;
  bothRolesClassName?: string;
}

/**
 * Role-aware Join CTA component.
 * - Logged-out users: show “Join as Entrepreneur” and “Join as Investor”.
 * - Logged-in Entrepreneur: NEVER show “Join as Entrepreneur” or “Join Also as Entrepreneur”; only show “Join Also as Investor”.
 * - Logged-in Investor: NEVER show “Join as Investor” or “Join Also as Investor”; only show “Join Also as Entrepreneur”.
 * - Both roles joined: hide both join CTAs and show a suitable “Explore Wenture India” or profile action.
 */
export function JoinCta({
  roleType,
  href,
  className,
  children,
  singleMode = false,
  alternateLabel,
  alternateHref,
  alternateClassName,
  showExploreWhenBoth = false,
  bothRolesLabel,
  bothRolesHref = "/opportunities",
  bothRolesClassName,
}: JoinCtaProps) {
  const { isAuthenticated, isEntrepreneur, isInvestor, hasBothRoles, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultHref = href || (roleType === "entrepreneur" ? "/signup/entrepreneur" : "/signup/investor");
  const defaultText = children || (roleType === "entrepreneur" ? "Join as Entrepreneur" : "Join as Investor");

  // SSR / Loading state: render stable logged-out button to eliminate layout shift and flickering
  if (!mounted || loading) {
    return (
      <Link href={defaultHref} className={className}>
        {defaultText}
      </Link>
    );
  }

  // 1. Logged-out users: show default join CTA
  if (!isAuthenticated) {
    return (
      <Link href={defaultHref} className={className}>
        {defaultText}
      </Link>
    );
  }

  // 2. Both roles already joined: NEVER show "Join as..." or "Join Also as..."
  if (hasBothRoles) {
    if (showExploreWhenBoth || singleMode) {
      return (
        <Link
          href={bothRolesHref}
          className={bothRolesClassName || className}
        >
          {bothRolesLabel || "Explore Wenture India"}
        </Link>
      );
    }
    return null;
  }

  // 3. Logged-in Entrepreneur (not investor)
  // RULE: NEVER show “Join as Entrepreneur” or “Join Also as Entrepreneur”; only show “Join Also as Investor”.
  if (isEntrepreneur && !isInvestor) {
    if (roleType === "entrepreneur") {
      // In singleMode, switch to "Join Also as Investor"
      if (singleMode) {
        return (
          <Link
            href={alternateHref || "/signup/investor"}
            className={alternateClassName || className}
          >
            {alternateLabel || "Join Also as Investor"}
          </Link>
        );
      }
      // In paired layout, hide "Join as Entrepreneur"
      return null;
    }

    // roleType === "investor": user is an Entrepreneur wanting to join as an investor
    return (
      <Link
        href={href || "/signup/investor"}
        className={className}
      >
        {"Join Also as Investor"}
      </Link>
    );
  }

  // 4. Logged-in Investor (not entrepreneur)
  // RULE: NEVER show “Join as Investor” or “Join Also as Investor”; only show “Join Also as Entrepreneur”.
  if (isInvestor && !isEntrepreneur) {
    if (roleType === "investor") {
      // In singleMode, switch to "Join Also as Entrepreneur"
      if (singleMode) {
        return (
          <Link
            href={alternateHref || "/signup/entrepreneur"}
            className={alternateClassName || className}
          >
            {alternateLabel || "Join Also as Entrepreneur"}
          </Link>
        );
      }
      // In paired layout, hide "Join as Investor"
      return null;
    }

    // roleType === "entrepreneur": user is an Investor wanting to join as an entrepreneur
    return (
      <Link
        href={href || "/signup/entrepreneur"}
        className={className}
      >
        {"Join Also as Entrepreneur"}
      </Link>
    );
  }

  // 5. Authenticated user without designated role
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
  className = "flex flex-wrap justify-center gap-4",
  investorClassName = "bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg transition-all",
  entrepreneurClassName = "bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm sm:text-base px-8 py-4 rounded-xl backdrop-blur-sm transition-all",
  exploreClassName = "bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg transition-all",
}: {
  className?: string;
  investorClassName?: string;
  entrepreneurClassName?: string;
  exploreClassName?: string;
}) {
  const { isAuthenticated, isEntrepreneur, isInvestor, hasBothRoles, loading } = useAuth();
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

  // If user has both roles: NEVER show Join CTAs
  if (hasBothRoles) {
    return (
      <div className={className}>
        <Link href="/opportunities" className={exploreClassName}>
          Explore Wenture India
        </Link>
        <Link
          href="/profile"
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm sm:text-base px-8 py-4 rounded-xl backdrop-blur-sm transition-all"
        >
          My Profile
        </Link>
      </div>
    );
  }

  // Logged-in Entrepreneur: ONLY show "Join Also as Investor" + "Explore Opportunities"
  // (NEVER show "Join as Entrepreneur" or "Join Also as Entrepreneur")
  if (isEntrepreneur && !isInvestor) {
    return (
      <div className={className}>
        <Link href="/signup/investor" className={investorClassName}>
          Join Also as Investor
        </Link>
        <Link href="/opportunities" className={entrepreneurClassName}>
          Explore Opportunities
        </Link>
      </div>
    );
  }

  // Logged-in Investor: ONLY show "Join Also as Entrepreneur" + "Explore Opportunities"
  // (NEVER show "Join as Investor" or "Join Also as Investor")
  if (isInvestor && !isEntrepreneur) {
    return (
      <div className={className}>
        <Link href="/signup/entrepreneur" className={investorClassName}>
          Join Also as Entrepreneur
        </Link>
        <Link href="/opportunities" className={entrepreneurClassName}>
          Explore Opportunities
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
 * Role-aware Dual/Single Gateway Cards for the How-It-Works page.
 * - Logged-out: Shows both "For Entrepreneurs & Businesses" ("Join as Entrepreneur") and "For Investors & Partners" ("Join as Investor").
 * - Logged-in Entrepreneur: Shows ONLY ONE card — "For Investors & Partners" with "Join Also as Investor".
 * - Logged-in Investor: Shows ONLY ONE card — "For Entrepreneurs & Businesses" with "Join Also as Entrepreneur".
 * - Both roles joined: Shows a single card to "Explore Opportunities".
 */
export function HowItWorksGatewayCards() {
  const { isAuthenticated, isEntrepreneur, isInvestor, hasBothRoles, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const entrepreneurCard = (isOppositeRole: boolean = false) => (
    <div className="bg-white rounded-2xl p-8 border border-[#DCECF2] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="w-12 h-12 rounded-xl bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
        </div>
        <h3 className="text-xl font-bold text-[#0A192A] mb-3">
          For Entrepreneurs &amp; Businesses
        </h3>
        <p className="text-xs sm:text-sm text-[#5F7180] leading-relaxed mb-6">
          Present your business, startup, franchise, or trade concept to an active network of investors, franchisees, and commercial partners.
        </p>
      </div>
      <Link
        href="/signup/entrepreneur"
        className="w-full py-3.5 text-center bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-sm rounded-xl transition-colors shadow-sm block"
      >
        {isOppositeRole ? "Join Also as Entrepreneur" : "Join as Entrepreneur"}
      </Link>
    </div>
  );

  const investorCard = (isOppositeRole: boolean = false) => (
    <div className="bg-white rounded-2xl p-8 border border-[#DCECF2] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="w-12 h-12 rounded-xl bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-[28px]">account_balance</span>
        </div>
        <h3 className="text-xl font-bold text-[#0A192A] mb-3">
          For Investors &amp; Partners
        </h3>
        <p className="text-xs sm:text-sm text-[#5F7180] leading-relaxed mb-6">
          Explore high-potential opportunities across diverse sectors, review business details, express interest, and connect directly.
        </p>
      </div>
      <Link
        href="/signup/investor"
        className={cn(
          "w-full py-3.5 text-center font-bold text-sm rounded-xl transition-colors shadow-sm block",
          isOppositeRole
            ? "bg-[#00A6E8] hover:bg-[#0093CE] text-white"
            : "bg-[#0A192A] hover:bg-[#1E293B] text-white"
        )}
      >
        {isOppositeRole ? "Join Also as Investor" : "Join as Investor"}
      </Link>
    </div>
  );

  // 1. SSR & Loading & Logged-out state: show both cards
  if (!mounted || loading || !isAuthenticated) {
    return (
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {entrepreneurCard(false)}
        {investorCard(false)}
      </div>
    );
  }

  // 2. User has both roles: show unified Explore card
  if (hasBothRoles) {
    return (
      <div className="mt-20 max-w-xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-[#DCECF2] shadow-sm flex flex-col justify-between text-center hover:shadow-md transition-shadow">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center mb-5 mx-auto">
              <span className="material-symbols-outlined text-[28px]">explore</span>
            </div>
            <h3 className="text-xl font-bold text-[#0A192A] mb-3">
              Explore Opportunities &amp; Businesses
            </h3>
            <p className="text-xs sm:text-sm text-[#5F7180] leading-relaxed mb-6">
              You have active access as both an Entrepreneur and an Investor. Explore the curated opportunities catalog or manage your profiles.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/opportunities"
              className="flex-1 py-3.5 text-center bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-sm rounded-xl transition-colors shadow-sm block"
            >
              Explore Opportunities
            </Link>
            <Link
              href="/profile"
              className="py-3.5 px-6 text-center bg-white border border-[#DCECF2] hover:bg-[#F4FAFD] text-[#0A192A] font-bold text-sm rounded-xl transition-colors block"
            >
              My Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Logged-in Entrepreneur (not investor): show ONLY the opposite card (Investor) with "Join Also as Investor"
  if (isEntrepreneur && !isInvestor) {
    return (
      <div className="mt-20 max-w-xl mx-auto">
        {investorCard(true)}
      </div>
    );
  }

  // 4. Logged-in Investor (not entrepreneur): show ONLY the opposite card (Entrepreneur) with "Join Also as Entrepreneur"
  if (isInvestor && !isEntrepreneur) {
    return (
      <div className="mt-20 max-w-xl mx-auto">
        {entrepreneurCard(true)}
      </div>
    );
  }

  // 5. Authenticated user without specific role set
  return (
    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {entrepreneurCard(false)}
      {investorCard(false)}
    </div>
  );
}
