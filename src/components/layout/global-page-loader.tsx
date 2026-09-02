"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { WentureEmblem } from "@/components/wenture-emblem";

// Helper hook to check prefers-reduced-motion
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return prefersReducedMotion;
}

// Inner route watcher that listens to pathname and searchParams
function RouteChangeListener({ onComplete }: { onComplete: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    onComplete();
  }, [pathname, searchParams, onComplete]);

  return null;
}

export function GlobalPageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const showTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shownAtRef = useRef<number | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Threshold delay: only show loader if navigation takes longer than 180ms
  const DELAY_THRESHOLD_MS = 180;
  // Minimum time loader stays visible once shown (to avoid jarring micro-flashes)
  const MIN_DISPLAY_TIME_MS = 350;

  const startLoader = () => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);

    showTimerRef.current = setTimeout(() => {
      shownAtRef.current = Date.now();
      setIsLoading(true);

      // Safety timeout: auto-hide after 6 seconds maximum in case of stalled navigation
      safetyTimerRef.current = setTimeout(() => {
        setIsLoading(false);
        shownAtRef.current = null;
      }, 6000);
    }, DELAY_THRESHOLD_MS);
  };

  const stopLoader = React.useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    if (shownAtRef.current) {
      const elapsed = Date.now() - shownAtRef.current;
      if (elapsed < MIN_DISPLAY_TIME_MS) {
        setTimeout(() => {
          setIsLoading(false);
          shownAtRef.current = null;
        }, MIN_DISPLAY_TIME_MS - elapsed);
        return;
      }
    }

    setIsLoading(false);
    shownAtRef.current = null;
  }, [MIN_DISPLAY_TIME_MS]);

  useEffect(() => {
    // Intercept internal link clicks to trigger loading state with debounce
    const handleDocumentClick = (e: MouseEvent) => {
      // Only handle left clicks without modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.defaultPrevented) return;

      const target = (e.target as HTMLElement).closest("a");
      if (!target || !target.href) return;

      // Ignore links with target="_blank", download, or non-http protocols
      if (target.target && target.target !== "_self") return;
      if (target.hasAttribute("download")) return;

      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("javascript:")) {
        return;
      }

      try {
        const targetUrl = new URL(target.href, window.location.origin);
        // Ignore external navigation
        if (targetUrl.origin !== window.location.origin) return;

        // Ignore clicks to the exact same route and parameters
        if (
          targetUrl.pathname === window.location.pathname &&
          targetUrl.search === window.location.search &&
          !targetUrl.hash
        ) {
          return;
        }

        // Start the debounced loader
        startLoader();
      } catch {
        // Ignore invalid URLs
      }
    };

    // Handle browser back/forward buttons
    const handlePopState = () => {
      startLoader();
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, []);

  return (
    <>
      {/* Route change watcher wrapped in Suspense */}
      <Suspense fallback={null}>
        <RouteChangeListener onComplete={stopLoader} />
      </Suspense>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="wenturex-page-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F4FAFD]/92 backdrop-blur-md selection:bg-transparent"
            aria-live="polite"
            aria-busy="true"
            role="status"
          >
            {/* Center Animation Container */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative flex flex-col items-center select-none p-8"
            >
              {/* Central Logo & Energy Ring Zone */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* 1. Subtle Radial Ambient Glow */}
                <div className="absolute w-52 h-52 bg-[#00A6E8]/15 rounded-full blur-3xl pointer-events-none" />

                {/* 2. Pulsing Outer Energy Wave */}
                {!prefersReducedMotion && (
                  <motion.div
                    className="absolute w-36 h-36 rounded-full border border-[#00A6E8]/25 pointer-events-none"
                    animate={{
                      scale: [1, 1.22, 1],
                      opacity: [0.3, 0.65, 0.3],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.2,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* 3. Primary Rotating Blue Energy Ring */}
                {!prefersReducedMotion ? (
                  <motion.svg
                    className="absolute w-36 h-36 pointer-events-none"
                    viewBox="0 0 160 160"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3.6, ease: "linear" }}
                  >
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="url(#energyGradient)"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeDasharray="160 280"
                    />
                    <defs>
                      <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00A6E8" stopOpacity="1" />
                        <stop offset="60%" stopColor="#00658F" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#00A6E8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                ) : (
                  <div className="absolute w-36 h-36 rounded-full border-2 border-[#00A6E8]/40" />
                )}

                {/* 4. Counter-rotating Accent Spark Ring */}
                {!prefersReducedMotion && (
                  <motion.svg
                    className="absolute w-40 h-40 pointer-events-none"
                    viewBox="0 0 160 160"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 5.5, ease: "linear" }}
                  >
                    <circle
                      cx="80"
                      cy="80"
                      r="75"
                      fill="none"
                      stroke="#00A6E8"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeDasharray="70 400"
                      opacity="0.5"
                    />
                  </motion.svg>
                )}

                {/* 5. Subtle Floating Particles */}
                {!prefersReducedMotion && (
                  <>
                    <motion.div
                      className="absolute w-1.5 h-1.5 rounded-full bg-[#00A6E8] shadow-[0_0_8px_#00A6E8]"
                      animate={{
                        x: [0, 24, -18, 0],
                        y: [-22, 12, 18, -22],
                        opacity: [0.4, 0.9, 0.4],
                      }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute w-1 h-1 rounded-full bg-[#00658F] shadow-[0_0_6px_#00658F]"
                      animate={{
                        x: [-18, 20, 10, -18],
                        y: [16, -14, -20, 16],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
                    />
                  </>
                )}

                {/* 6. Centered Official Wenture Emblem */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative z-10 flex items-center justify-center p-2"
                >
                  <WentureEmblem size={58} />
                </motion.div>
              </div>

              {/* Brand Typography */}
              <div className="mt-3 text-center">
                <div className="flex items-center justify-center gap-1 font-heading text-xl sm:text-2xl font-extrabold text-[#0A192A] tracking-tight">
                  <span>Wenture</span>
                  <span className="text-[#00A6E8]">.</span>
                </div>
                <p className="text-[10px] font-extrabold text-[#5F7180] tracking-[0.25em] uppercase mt-0.5">
                  India International
                </p>
              </div>

              {/* Elegant Micro Progress Beam */}
              <div className="mt-5 w-24 h-0.5 bg-[#DCECF2] rounded-full overflow-hidden relative">
                {!prefersReducedMotion ? (
                  <motion.div
                    className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-[#00A6E8] to-transparent rounded-full"
                    animate={{ x: [-48, 96] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#00A6E8]" />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
