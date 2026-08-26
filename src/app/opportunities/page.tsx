"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { OpportunityCard } from "@/components/cards/opportunity-card";
import { OPPORTUNITIES } from "@/lib/constants/opportunities";
import { AnimatePresence, motion } from "framer-motion";

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("All Sectors");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Investment", "Franchise", "EXIM", "M&A"]);
  const [selectedRange, setSelectedRange] = useState<string>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSector("All Sectors");
    setSelectedTypes(["Investment", "Franchise", "EXIM", "M&A"]);
    setSelectedRange("all");
  };

  // Filter and sort opportunities
  const filteredOpps = useMemo(() => {
    return OPPORTUNITIES.filter((opp) => {
      // Search match
      if (
        searchQuery &&
        !opp.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !opp.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !opp.sector.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !opp.location.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Sector match
      if (selectedSector !== "All Sectors" && opp.sector !== selectedSector) {
        return false;
      }

      // Type match
      if (selectedTypes.length > 0 && !selectedTypes.includes(opp.category)) {
        return false;
      }

      // Investment Range match
      if (selectedRange === "under-1m" && opp.targetAmountNum >= 1000000) {
        return false;
      }
      if (
        selectedRange === "1m-5m" &&
        (opp.targetAmountNum < 1000000 || opp.targetAmountNum > 5000000)
      ) {
        return false;
      }
      if (
        selectedRange === "5m-20m" &&
        (opp.targetAmountNum < 5000000 || opp.targetAmountNum > 20000000)
      ) {
        return false;
      }
      if (selectedRange === "20m+" && opp.targetAmountNum < 20000000) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedSector, selectedTypes, selectedRange]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6FAFF] selection:bg-primary-container selection:text-white">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        {/* ============================================================ */}
        {/* SEARCH, SECTOR & FILTERS CONTROL BAR (MATCHING USER IMAGE)   */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCECF2] shadow-[0px_4px_25px_rgba(10,25,42,0.04)] mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input with Magnifier */}
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5F7180] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company, sector, or keyword..."
                className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-[#DCECF2] bg-white text-[#0A192A] text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#00A6E8] focus:ring-1 focus:ring-[#00A6E8]/20 transition-all"
              />
            </div>

            {/* Sector Dropdown */}
            <div className="sm:w-56 shrink-0">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full rounded-lg border border-[#DCECF2] bg-white text-[#0A192A] py-2.5 px-4 text-sm font-medium focus:outline-none focus:border-[#00A6E8] focus:ring-1 focus:ring-[#00A6E8]/20 transition-all cursor-pointer"
              >
                <option value="All Sectors">All Sectors</option>
                <option value="FinTech">FinTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="Automation">Automation</option>
                <option value="CleanTech">CleanTech</option>
                <option value="Logistics">Logistics</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Agriculture">Agriculture & EXIM</option>
              </select>
            </div>

            {/* Filters Toggle Button */}
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer select-none ${
                filtersOpen
                  ? "bg-[#00A6E8] text-white border-[#00A6E8]"
                  : "bg-white text-[#0A192A] border-[#DCECF2] hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                tune
              </span>
              <span>Filters</span>
            </button>
          </div>

          {/* Expandable Secondary Filter Panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="pt-5 mt-4 border-t border-[#DCECF2] overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Opportunity Type */}
                  <div>
                    <h4 className="text-xs font-bold text-[#0A192A] uppercase tracking-wider mb-2.5">
                      Opportunity Type
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["Investment", "Franchise", "EXIM", "M&A"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleTypeToggle(type)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                            selectedTypes.includes(type)
                              ? "bg-[#EBF6FC] text-[#00A6E8] border-[#00A6E8]"
                              : "bg-white text-[#5F7180] border-[#DCECF2] hover:border-slate-300"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Investment Range */}
                  <div>
                    <h4 className="text-xs font-bold text-[#0A192A] uppercase tracking-wider mb-2.5">
                      Investment Range
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "all", label: "All" },
                        { id: "under-1m", label: "< $1M" },
                        { id: "1m-5m", label: "$1M - $5M" },
                        { id: "5m-20m", label: "$5M - $20M" },
                        { id: "20m+", label: "$20M+" },
                      ].map((range) => (
                        <button
                          key={range.id}
                          type="button"
                          onClick={() => setSelectedRange(range.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                            selectedRange === range.id
                              ? "bg-[#EBF6FC] text-[#00A6E8] border-[#00A6E8]"
                              : "bg-white text-[#5F7180] border-[#DCECF2] hover:border-slate-300"
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Action */}
                  <div className="flex items-end justify-start sm:justify-end">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs font-bold text-[#00A6E8] hover:text-[#00658F] hover:underline"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredOpps.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#DCECF2] shadow-sm max-w-lg mx-auto">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-500">
              <span className="material-symbols-outlined text-[24px]">filter_alt_off</span>
            </div>
            <h3 className="text-lg font-bold text-[#0A192A] mb-1">
              No matching opportunities found
            </h3>
            <p className="text-xs text-[#5F7180] mb-5">
              Try adjusting your search terms or clearing active filters.
            </p>
            <button
              onClick={resetFilters}
              className="bg-[#00A6E8] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#0093CE]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Opportunities Card Grid */}
        {filteredOpps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredOpps.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
