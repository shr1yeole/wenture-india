"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ExpressInterestModal } from "@/components/forms/express-interest-modal";
import {
  InvestorProfile,
  getPublishedInvestorById,
} from "@/lib/firebase/investors";
import { motion } from "framer-motion";

export default function InvestorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [investor, setInvestor] = useState<InvestorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interestModalOpen, setInterestModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const res = await getPublishedInvestorById(id);
      if (res.error || !res.investor) {
        setError(res.error || "Investor profile not found.");
      } else {
        setInvestor(res.investor);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6FAFF]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-9 h-9 border-3 border-[#00A6E8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#5F7180]">Loading investor profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !investor) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6FAFF]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-24 px-5">
          <div className="max-w-md w-full bg-white border border-[#DCECF2] rounded-2xl p-8 text-center shadow-sm">
            <span className="material-symbols-outlined text-[48px] text-slate-300 mb-3">
              person_off
            </span>
            <h2 className="text-xl font-bold text-[#0A192A] mb-2 font-heading">
              Profile Unavailable
            </h2>
            <p className="text-xs sm:text-sm text-[#5F7180] mb-6 leading-relaxed">
              {error || "The requested investor profile is either inactive or currently undergoing admin review."}
            </p>
            <Link
              href="/investors"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#00A6E8] hover:bg-[#0093CE] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Investors Directory</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const initial = investor.investorName?.charAt(0).toUpperCase() || "I";

  return (
    <div className="flex flex-col min-h-screen bg-[#F6FAFF] selection:bg-[#00A6E8] selection:text-white">
      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="w-full max-w-[1140px] mx-auto px-5 sm:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-[#5F7180]">
            <Link href="/investors" className="hover:text-[#00A6E8] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              <span>Investors Directory</span>
            </Link>
            <span>/</span>
            <span className="text-[#0A192A] font-semibold truncate">{investor.investorName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Main Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#DCECF2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6">
                  <div className="flex items-center gap-4">
                    {investor.profileImage ? (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden relative border border-[#DCECF2] shrink-0 bg-slate-100">
                        <Image
                          src={investor.profileImage}
                          alt={investor.investorName}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#EBF6FC] border border-[#DCECF2] text-[#00658F] font-extrabold text-2xl flex items-center justify-center shrink-0">
                        {initial}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A192A] font-heading">
                          {investor.investorName}
                        </h1>
                        {investor.isDemo ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-[#5F7180] border border-slate-200">
                            Sample Showcase
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                            Verified Directory Member
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#5F7180] mt-1.5 flex-wrap">
                        <span className="font-bold text-[#00658F]">{investor.investorType}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-[#00A6E8]">
                            location_on
                          </span>
                          {investor.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Introduction Section */}
                <div className="pt-6 border-t border-[#DCECF2]">
                  <h2 className="text-xs font-bold text-[#00658F] uppercase tracking-wider mb-2">
                    Executive Introduction
                  </h2>
                  <p className="text-sm sm:text-base text-[#0A192A] leading-relaxed whitespace-pre-line">
                    {investor.shortIntroduction}
                  </p>
                </div>
              </motion.div>

              {/* Experience & Track Record */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white border border-[#DCECF2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
              >
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#0A192A] font-heading mb-3">
                    Investment Experience &amp; Background
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5F7180] leading-relaxed whitespace-pre-line">
                    {investor.experience || investor.shortIntroduction}
                  </p>
                </div>

                {/* Areas of Expertise Tags */}
                <div className="pt-6 border-t border-[#DCECF2]">
                  <h3 className="text-xs font-bold text-[#00658F] uppercase tracking-wider mb-3">
                    Areas of Expertise &amp; Value Addition
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {investor.areasOfExpertise.map((area) => (
                      <span
                        key={area}
                        className="px-3 py-1 bg-[#F4FAFD] border border-[#DCECF2] text-[#0A192A] text-xs font-semibold rounded-lg"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferred Sectors Tags */}
                <div className="pt-6 border-t border-[#DCECF2]">
                  <h3 className="text-xs font-bold text-[#00658F] uppercase tracking-wider mb-3">
                    Target Industry Sectors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {investor.preferredSectors.map((sec) => (
                      <span
                        key={sec}
                        className="px-3 py-1 bg-[#EBF6FC] border border-[#DCECF2] text-[#00658F] text-xs font-bold rounded-lg"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Key Criteria & CTA Card */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="bg-white border border-[#DCECF2] rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-sm sticky top-24 space-y-6"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00658F] block mb-1">
                    Investment Criteria
                  </span>
                  <h2 className="text-xl font-bold text-[#0A192A] font-heading">
                    Deal Parameters
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-3.5 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl">
                    <span className="text-[#5F7180] block text-[10px] uppercase font-bold mb-0.5">
                      Investment Ticket Range
                    </span>
                    <span className="text-base font-extrabold text-[#00658F]">
                      {investor.investmentRange}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl">
                    <span className="text-[#5F7180] block text-[10px] uppercase font-bold mb-0.5">
                      Preferred Stage
                    </span>
                    <span className="text-sm font-bold text-[#0A192A]">
                      {investor.investmentStage}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl">
                    <span className="text-[#5F7180] block text-[10px] uppercase font-bold mb-0.5">
                      Geographic Base
                    </span>
                    <span className="text-sm font-bold text-[#0A192A]">
                      {investor.location}
                    </span>
                  </div>
                </div>

                {/* Primary CTA: Express Interest */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setInterestModalOpen(true)}
                    className="w-full py-3.5 bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>Express Interest</span>
                  </button>
                  <p className="text-[11px] text-[#5F7180] text-center mt-2.5 leading-tight">
                    Submit your venture deck or introduction for review by this capital partner.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Express Interest Modal */}
      <ExpressInterestModal
        investor={investor}
        isOpen={interestModalOpen}
        onClose={() => setInterestModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
