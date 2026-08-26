"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface NavbarProps {
  className?: string;
  hideAuth?: boolean;
}

export function Navbar({ className, hideAuth = false }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
        {/* Brand Logo: Clean "Wenturex" matching header design */}
        <Link href="/" className="flex items-center group">
          <span className="text-2xl sm:text-[26px] font-extrabold text-[#0A192A] tracking-tight font-heading">
            Wenturex
          </span>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {navLinks.map((link) => {
            const active = isActive(link.href);
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

        {/* Right CTA: "Join Wenturex" solid button */}
        {!hideAuth && (
          <div className="hidden lg:flex items-center">
            <Link
              href="/signup"
              className="bg-[#00A6E8] hover:bg-[#0093CE] text-white px-5 py-2 rounded-md text-sm font-bold tracking-normal transition-all duration-200 shadow-sm shadow-[#00A6E8]/20 hover:shadow"
            >
              Join Wenturex
            </Link>
          </div>
        )}

        {/* Mobile Hamburger / Quick CTA */}
        <div className="flex lg:hidden items-center gap-3">
          {!hideAuth && (
            <Link
              href="/signup"
              className="bg-[#00A6E8] text-white px-3.5 py-1.5 rounded-md text-xs font-bold"
            >
              Join Wenturex
            </Link>
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
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-sm py-2 border-b border-slate-100 transition-colors",
                      active
                        ? "text-[#00658F] font-bold"
                        : "text-[#5F7180] hover:text-[#0A192A]"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {!hideAuth && (
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="w-full text-center py-2.5 rounded-md border border-[#DCECF2] text-[#0A192A] font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full text-center py-2.5 rounded-md bg-[#00A6E8] text-white font-bold text-xs hover:bg-[#0093CE] transition-colors"
                  >
                    Join Wenturex
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
