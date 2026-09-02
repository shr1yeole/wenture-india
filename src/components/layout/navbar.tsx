"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/lib/firebase/auth-context";

interface NavbarProps {
  className?: string;
  hideAuth?: boolean;
}

export function Navbar({ className, hideAuth = false }: NavbarProps) {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [investorDropdownOpen, setInvestorDropdownOpen] = useState(false);
  const [entrepreneurDropdownOpen, setEntrepreneurDropdownOpen] = useState(false);
  const investorTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const entrepreneurTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setInvestorDropdownOpen(false);
    setEntrepreneurDropdownOpen(false);
  }, [pathname]);

  const handleInvestorDropdownEnter = () => {
    if (investorTimeoutRef.current) clearTimeout(investorTimeoutRef.current);
    setInvestorDropdownOpen(true);
    setEntrepreneurDropdownOpen(false);
  };

  const handleInvestorDropdownLeave = () => {
    investorTimeoutRef.current = setTimeout(() => {
      setInvestorDropdownOpen(false);
    }, 180);
  };

  const handleEntrepreneurDropdownEnter = () => {
    if (entrepreneurTimeoutRef.current) clearTimeout(entrepreneurTimeoutRef.current);
    setEntrepreneurDropdownOpen(true);
    setInvestorDropdownOpen(false);
  };

  const handleEntrepreneurDropdownLeave = () => {
    entrepreneurTimeoutRef.current = setTimeout(() => {
      setEntrepreneurDropdownOpen(false);
    }, 180);
  };

  const navLinks = [
    { name: "Discover", href: "/" },
    { name: "For Entrepreneurs", href: "/for-entrepreneurs" },
    { name: "For Investors", href: "/for-investors" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "/discover";
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 w-full z-50 transition-all duration-200 bg-[#F4FAFD]/95 backdrop-blur-md border-b border-[#DCECF2]",
        scrolled ? "shadow-sm" : "",
        className
      )}
    >
      <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
        {/* Official Brand Logo */}
        <Link href="/" className="flex items-center group transition-opacity hover:opacity-90">
          <BrandLogo size="md" showTagline={false} />
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            if (link.href === "/for-entrepreneurs") {
              return (
                <div
                  key={link.name}
                  className="relative group py-1"
                  onMouseEnter={handleEntrepreneurDropdownEnter}
                  onMouseLeave={handleEntrepreneurDropdownLeave}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "text-[14.5px] transition-colors py-1 relative font-normal select-none inline-flex items-center gap-1",
                      active
                        ? "text-[#00658F] font-bold"
                        : "text-[#5F7180] hover:text-[#0A192A]"
                    )}
                  >
                    <span>{link.name}</span>
                    <span
                      className={cn(
                        "material-symbols-outlined text-[16px] transition-transform duration-200",
                        entrepreneurDropdownOpen ? "rotate-180 text-[#00658F]" : "text-[#5F7180] group-hover:text-[#0A192A]"
                      )}
                    >
                      expand_more
                    </span>
                    {active && (
                      <motion.div
                        layoutId="headerUnderline"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#00658F] rounded-full"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {entrepreneurDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[380px]"
                      >
                        <div className="bg-white/95 backdrop-blur-xl border border-[#DCECF2] rounded-2xl p-2.5 shadow-[0_16px_40px_rgba(10,25,42,0.12)] space-y-1">
                          {/* 1. Find Investors */}
                          <Link
                            href="/investors"
                            onClick={() => setEntrepreneurDropdownOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4FAFD] transition-colors group/item"
                          >
                            <div className="w-9 h-9 rounded-xl bg-[#EBF6FC] text-[#00A6E8] group-hover/item:bg-[#00A6E8] group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                              <span className="material-symbols-outlined text-[20px]">person_search</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-[#0A192A] group-hover/item:text-[#00658F] transition-colors">
                                Find Investors
                              </div>
                              <p className="text-xs text-[#5F7180] leading-snug mt-0.5">
                                Search and connect with verified angel investors, venture funds &amp; capital partners.
                              </p>
                            </div>
                          </Link>

                          {/* 2. List Your Venture */}
                          <Link
                            href="/profile/listings"
                            onClick={() => setEntrepreneurDropdownOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4FAFD] transition-colors group/item"
                          >
                            <div className="w-9 h-9 rounded-xl bg-[#EBF6FC] text-[#00A6E8] group-hover/item:bg-[#00A6E8] group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-[#0A192A] group-hover/item:text-[#00658F] transition-colors">
                                List Your Venture
                              </div>
                              <p className="text-xs text-[#5F7180] leading-snug mt-0.5">
                                Publish business, franchise or funding opportunities to reach accredited investors.
                              </p>
                            </div>
                          </Link>

                          {/* 3. How It Works */}
                          <Link
                            href="/how-it-works"
                            onClick={() => setEntrepreneurDropdownOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4FAFD] transition-colors group/item"
                          >
                            <div className="w-9 h-9 rounded-xl bg-[#EBF6FC] text-[#00A6E8] group-hover/item:bg-[#00A6E8] group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                              <span className="material-symbols-outlined text-[20px]">help_outline</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-[#0A192A] group-hover/item:text-[#00658F] transition-colors">
                                How It Works
                              </div>
                              <p className="text-xs text-[#5F7180] leading-snug mt-0.5">
                                Discover our verification, deal review, and investor introduction workflow.
                              </p>
                            </div>
                          </Link>

                          {/* Bottom overview link */}
                          <div className="pt-2 mt-1 border-t border-[#DCECF2] px-2.5 pb-1 flex items-center justify-between">
                            <Link
                              href="/for-entrepreneurs"
                              onClick={() => setEntrepreneurDropdownOpen(false)}
                              className="text-xs font-bold text-[#00658F] hover:text-[#00A6E8] transition-colors flex items-center gap-1"
                            >
                              <span>For Entrepreneurs Overview</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </Link>
                            <Link
                              href="/opportunities"
                              onClick={() => setEntrepreneurDropdownOpen(false)}
                              className="text-[11px] font-semibold text-[#5F7180] hover:text-[#0A192A] transition-colors"
                            >
                              Browse Opportunities
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            if (link.href === "/for-investors") {
              return (
                <div
                  key={link.name}
                  className="relative group py-1"
                  onMouseEnter={handleInvestorDropdownEnter}
                  onMouseLeave={handleInvestorDropdownLeave}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "text-[14.5px] transition-colors py-1 relative font-normal select-none inline-flex items-center gap-1",
                      active
                        ? "text-[#00658F] font-bold"
                        : "text-[#5F7180] hover:text-[#0A192A]"
                    )}
                  >
                    <span>{link.name}</span>
                    <span
                      className={cn(
                        "material-symbols-outlined text-[16px] transition-transform duration-200",
                        investorDropdownOpen ? "rotate-180 text-[#00658F]" : "text-[#5F7180] group-hover:text-[#0A192A]"
                      )}
                    >
                      expand_more
                    </span>
                    {active && (
                      <motion.div
                        layoutId="headerUnderline"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#00658F] rounded-full"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {investorDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[380px]"
                      >
                        <div className="bg-white/95 backdrop-blur-xl border border-[#DCECF2] rounded-2xl p-2.5 shadow-[0_16px_40px_rgba(10,25,42,0.12)] space-y-1">
                          {/* 1. Explore Opportunities */}
                          <Link
                            href="/opportunities"
                            onClick={() => setInvestorDropdownOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4FAFD] transition-colors group/item"
                          >
                            <div className="w-9 h-9 rounded-xl bg-[#EBF6FC] text-[#00A6E8] group-hover/item:bg-[#00A6E8] group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                              <span className="material-symbols-outlined text-[20px]">domain</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-[#0A192A] group-hover/item:text-[#00658F] transition-colors">
                                Explore Opportunities
                              </div>
                              <p className="text-xs text-[#5F7180] leading-snug mt-0.5">
                                Browse curated businesses, startups & investment ventures seeking capital.
                              </p>
                            </div>
                          </Link>

                          {/* 2. Create Investor Profile */}
                          <Link
                            href="/profile/investor"
                            onClick={() => setInvestorDropdownOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4FAFD] transition-colors group/item"
                          >
                            <div className="w-9 h-9 rounded-xl bg-[#EBF6FC] text-[#00A6E8] group-hover/item:bg-[#00A6E8] group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                              <span className="material-symbols-outlined text-[20px]">badge</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-[#0A192A] group-hover/item:text-[#00658F] transition-colors">
                                My Investor Profile
                              </div>
                              <p className="text-xs text-[#5F7180] leading-snug mt-0.5">
                                Create and manage the investor profile that entrepreneurs can discover on Wenturex. Add your investment interests, experience, preferred sectors and other details.
                              </p>
                            </div>
                          </Link>

                          {/* 3. How It Works */}
                          <Link
                            href="/how-it-works"
                            onClick={() => setInvestorDropdownOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4FAFD] transition-colors group/item"
                          >
                            <div className="w-9 h-9 rounded-xl bg-[#EBF6FC] text-[#00A6E8] group-hover/item:bg-[#00A6E8] group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                              <span className="material-symbols-outlined text-[20px]">help_outline</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-[#0A192A] group-hover/item:text-[#00658F] transition-colors">
                                How It Works
                              </div>
                              <p className="text-xs text-[#5F7180] leading-snug mt-0.5">
                                Learn about the verified investor process, discovery, and deal review.
                              </p>
                            </div>
                          </Link>

                          {/* Bottom overview link */}
                          <div className="pt-2 mt-1 border-t border-[#DCECF2] px-2.5 pb-1 flex items-center justify-between">
                            <Link
                              href="/for-investors"
                              onClick={() => setInvestorDropdownOpen(false)}
                              className="text-xs font-bold text-[#00658F] hover:text-[#00A6E8] transition-colors flex items-center gap-1"
                            >
                              <span>For Investors Overview</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </Link>
                            <Link
                              href="/investors"
                              onClick={() => setInvestorDropdownOpen(false)}
                              className="text-[11px] font-semibold text-[#5F7180] hover:text-[#0A192A] transition-colors"
                            >
                              Investor Directory
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[14.5px] transition-colors py-1 relative font-normal select-none",
                  active
                    ? "text-[#00658F] font-bold"
                    : "text-[#5F7180] hover:text-[#0A192A]"
                )}
              >
                {link.name}
                {active && (
                  <motion.div
                    layoutId="headerUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#00658F] rounded-full"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        {!hideAuth && (
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 rounded-md text-xs font-bold text-[#00658F] bg-[#F4FAFD] border border-[#DCECF2] hover:bg-[#EBF6FC] flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">shield_person</span>
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  href="/profile"
                  className="px-3.5 py-1.5 rounded-md text-xs font-bold text-[#0A192A] hover:text-[#00A6E8] flex items-center gap-1.5 transition-colors border border-transparent hover:border-[#DCECF2]"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#00A6E8]">
                    person
                  </span>
                  <span>Profile</span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="bg-white border border-[#DCECF2] hover:border-red-300 hover:text-red-600 text-[#0A192A] px-3.5 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/signup"
                className="bg-[#00A6E8] hover:bg-[#0093CE] text-white px-5 py-2 rounded-md text-sm font-bold tracking-normal transition-all duration-200 shadow-sm shadow-[#00A6E8]/20 hover:shadow"
              >
                Join Wenturex
              </Link>
            )}
          </div>
        )}

        {/* Mobile Hamburger / Quick CTA */}
        <div className="flex lg:hidden items-center gap-2">
          {!hideAuth && (
            isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="bg-[#F4FAFD] border border-[#DCECF2] text-xs font-bold text-[#00658F] px-2.5 py-1.5 rounded-md flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">shield_person</span>
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="bg-white border border-[#DCECF2] text-xs font-bold text-[#0A192A] px-2.5 py-1.5 rounded-md flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#00A6E8]">
                    person
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                href="/signup"
                className="bg-[#00A6E8] text-white px-3 py-1.5 rounded-md text-xs font-bold"
              >
                Join
              </Link>
            )
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#0A192A] hover:text-[#00A6E8] rounded-md focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-[26px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-b border-[#DCECF2] overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col space-y-3">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <React.Fragment key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-sm py-2 border-b border-slate-100 transition-colors",
                        active
                          ? "text-[#00658F] font-bold"
                          : "text-[#5F7180] hover:text-[#0A192A]"
                      )}
                    >
                      {link.name}
                    </Link>

                    {/* Sub-items under For Entrepreneurs */}
                    {link.href === "/for-entrepreneurs" && (
                      <div className="pl-3 pb-2 pt-1 border-b border-slate-100 flex flex-col gap-2">
                        {/* 1. Find Investors */}
                        <Link
                          href="/investors"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "text-xs py-2 px-3 rounded-xl flex items-start gap-2.5 transition-colors",
                            pathname.startsWith("/investors")
                              ? "bg-[#EBF6FC] text-[#00658F] font-bold border border-[#00A6E8]/30"
                              : "text-[#5F7180] bg-[#F4FAFD] border border-[#DCECF2] hover:text-[#0A192A]"
                          )}
                        >
                          <div className="w-6 h-6 rounded-md bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[15px]">person_search</span>
                          </div>
                          <div>
                            <div className="font-bold text-[#0A192A]">Find Investors</div>
                            <div className="text-[11px] text-[#5F7180] leading-snug mt-0.5">
                              Search and connect with verified angel investors, VC funds &amp; capital partners.
                            </div>
                          </div>
                        </Link>

                        {/* 2. List Your Venture */}
                        <Link
                          href="/profile/listings"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "text-xs py-2 px-3 rounded-xl flex items-start gap-2.5 transition-colors",
                            pathname.startsWith("/profile/listings")
                              ? "bg-[#EBF6FC] text-[#00658F] font-bold border border-[#00A6E8]/30"
                              : "text-[#5F7180] bg-[#F4FAFD] border border-[#DCECF2] hover:text-[#0A192A]"
                          )}
                        >
                          <div className="w-6 h-6 rounded-md bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[15px]">rocket_launch</span>
                          </div>
                          <div>
                            <div className="font-bold text-[#0A192A]">List Your Venture</div>
                            <div className="text-[11px] text-[#5F7180] leading-snug">Publish opportunities to reach accredited investors</div>
                          </div>
                        </Link>

                        {/* 3. How It Works */}
                        <Link
                          href="/how-it-works"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "text-xs py-2 px-3 rounded-xl flex items-start gap-2.5 transition-colors",
                            pathname.startsWith("/how-it-works")
                              ? "bg-[#EBF6FC] text-[#00658F] font-bold border border-[#00A6E8]/30"
                              : "text-[#5F7180] bg-[#F4FAFD] border border-[#DCECF2] hover:text-[#0A192A]"
                          )}
                        >
                          <div className="w-6 h-6 rounded-md bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[15px]">help_outline</span>
                          </div>
                          <div>
                            <div className="font-bold text-[#0A192A]">How It Works</div>
                            <div className="text-[11px] text-[#5F7180] leading-snug">Learn about review, listing, and introduction process</div>
                          </div>
                        </Link>
                      </div>
                    )}

                    {/* Sub-items under For Investors */}
                    {link.href === "/for-investors" && (
                      <div className="pl-3 pb-2 pt-1 border-b border-slate-100 flex flex-col gap-2">
                        {/* 1. Explore Opportunities */}
                        <Link
                          href="/opportunities"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "text-xs py-2 px-3 rounded-xl flex items-start gap-2.5 transition-colors",
                            pathname.startsWith("/opportunities")
                              ? "bg-[#EBF6FC] text-[#00658F] font-bold border border-[#00A6E8]/30"
                              : "text-[#5F7180] bg-[#F4FAFD] border border-[#DCECF2] hover:text-[#0A192A]"
                          )}
                        >
                          <div className="w-6 h-6 rounded-md bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[15px]">domain</span>
                          </div>
                          <div>
                            <div className="font-bold text-[#0A192A]">Explore Opportunities</div>
                            <div className="text-[11px] text-[#5F7180] leading-snug">Browse vetted businesses & investment ventures</div>
                          </div>
                        </Link>

                        {/* 2. Create Investor Profile */}
                        <Link
                          href="/profile/investor"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "text-xs py-2 px-3 rounded-xl flex items-start gap-2.5 transition-colors",
                            pathname.startsWith("/profile/investor")
                              ? "bg-[#EBF6FC] text-[#00658F] font-bold border border-[#00A6E8]/30"
                              : "text-[#5F7180] bg-[#F4FAFD] border border-[#DCECF2] hover:text-[#0A192A]"
                          )}
                        >
                          <div className="w-6 h-6 rounded-md bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[15px]">badge</span>
                          </div>
                          <div>
                            <div className="font-bold text-[#0A192A]">My Investor Profile</div>
                            <div className="text-[11px] text-[#5F7180] leading-snug mt-0.5">
                              Create and manage the investor profile that entrepreneurs can discover on Wenturex.
                            </div>
                          </div>
                        </Link>

                        {/* 3. How It Works */}
                        <Link
                          href="/how-it-works"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "text-xs py-2 px-3 rounded-xl flex items-start gap-2.5 transition-colors",
                            pathname.startsWith("/how-it-works")
                              ? "bg-[#EBF6FC] text-[#00658F] font-bold border border-[#00A6E8]/30"
                              : "text-[#5F7180] bg-[#F4FAFD] border border-[#DCECF2] hover:text-[#0A192A]"
                          )}
                        >
                          <div className="w-6 h-6 rounded-md bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[15px]">help_outline</span>
                          </div>
                          <div>
                            <div className="font-bold text-[#0A192A]">How It Works</div>
                            <div className="text-[11px] text-[#5F7180] leading-snug">Understand our review and introduction process</div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {!hideAuth && (
                <div className="pt-2 flex flex-col gap-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-2.5 rounded-md border border-[#DCECF2] text-[#0A192A] font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#00A6E8]">
                          person
                        </span>
                        <span>My Profile</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-center py-2.5 rounded-md bg-red-50 text-red-700 font-bold text-xs border border-red-200"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-2.5 rounded-md bg-[#00A6E8] text-white font-bold text-xs hover:bg-[#0093CE] transition-colors"
                      >
                        Join Wenturex
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-2 rounded-md border border-[#DCECF2] text-[#5F7180] font-semibold text-xs hover:text-[#0A192A] hover:bg-slate-50 transition-colors"
                      >
                        Already have an account? Sign In
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
