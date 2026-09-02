"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth-context";

export interface JoinCtaProps {
  roleType: "entrepreneur" | "investor";
  href?: string;
  className?: string;
  children?: React.ReactNode;
  /**
   * If true, this CTA is a standalone hero button that shows the alternate
   * role if the user already has this role, or Explore Wenturex if both.
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
 * - Logged-in Entrepreneur: hide “Join as Entrepreneur” and show “Join Also as Investor”.
 * - Logged-in Investor: hide “Join as Investor” and show “Join Also as Entrepreneur”.
 * - Both roles joined: hide both join CTAs and show a suitable “Explore Wenturex” or profile action.
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

  // 2. Both roles already joined
  if (hasBothRoles) {
    if (showExploreWhenBoth || singleMode) {
      return (
        <Link
          href={bothRolesHref}
          className={bothRolesClassName || className}
        >
          {bothRolesLabel || "Explore Wenturex"}
        </Link>
      );
    }
    return null;
  }

  // 3. Logged-in Entrepreneur (not investor)
  if (isEntrepreneur && !isInvestor) {
    if (roleType === "entrepreneur") {
      if (singleMode) {
        // On an entrepreneur-focused page hero, an entrepreneur sees "Join Also as Investor"
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

    // roleType === "investor": show "Join Also as Investor"
    return (
      <Link
        href={alternateHref || "/signup/investor"}
        className={alternateClassName || className}
      >
        {alternateLabel || "Join Also as Investor"}
      </Link>
    );
  }

  // 4. Logged-in Investor (not entrepreneur)
  if (isInvestor && !isEntrepreneur) {
    if (roleType === "investor") {
      if (singleMode) {
        // On an investor-focused page hero, an investor sees "Join Also as Entrepreneur"
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

    // roleType === "entrepreneur": show "Join Also as Entrepreneur"
    return (
      <Link
        href={alternateHref || "/signup/entrepreneur"}
        className={alternateClassName || className}
      >
        {alternateLabel || "Join Also as Entrepreneur"}
      </Link>
    );
  }

  // Fallback
  return null;
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

  // Stable default render during SSR and loading
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

  // If user has both roles, hide both join CTAs and show Explore Wenturex + Profile
  if (hasBothRoles) {
    return (
      <div className={className}>
        <Link href="/opportunities" className={exploreClassName}>
          Explore Wenturex
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

  // Logged-in Entrepreneur: hide Join as Entrepreneur, show Join Also as Investor
  if (isEntrepreneur && !isInvestor) {
    return (
      <div className={className}>
        <Link href="/profile/investor" className={investorClassName}>
          Join Also as Investor
        </Link>
        <Link href="/opportunities" className={entrepreneurClassName}>
          Explore Opportunities
        </Link>
      </div>
    );
  }

  // Logged-in Investor: hide Join as Investor, show Join Also as Entrepreneur
  if (isInvestor && !isEntrepreneur) {
    return (
      <div className={className}>
        <Link href="/profile/listings" className={investorClassName}>
          Join Also as Entrepreneur
        </Link>
        <Link href="/opportunities" className={entrepreneurClassName}>
          Explore Opportunities
        </Link>
      </div>
    );
  }

  return null;
}
