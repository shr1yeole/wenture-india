"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Opportunity, formatWhatsAppNumber } from "@/lib/constants/opportunities";
import { OpportunityEnquiryModal } from "@/components/forms/opportunity-enquiry-modal";
import { useAuth } from "@/lib/firebase/auth-context";
import { COMPANY } from "@/lib/constants/company";

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";

export function OpportunityDetailView({
  opportunity: opp,
}: OpportunityDetailViewProps) {
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(opp.imageUrl || DEFAULT_IMAGE);

  // Extract this particular opportunity's contact phone number
  const oppPhone =
    opp.contactPhone ||
    opp.whatsappNumber ||
    opp.keyInformation?.find((k) => k.label.toLowerCase().includes("phone"))?.value ||
    "";

  const targetWaNumber = formatWhatsAppNumber(oppPhone, "919841881008");
  const displayPhone = oppPhone || COMPANY.contact.phone;

  const whatsappUrl = `https://wa.me/${targetWaNumber}?text=${encodeURIComponent(
    `Hello, I am interested in: ${opp.title} (${opp.category} - ${opp.sector}) listed on Wenturex. Please share further details.`
  )}`;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-[#5F7180] mb-6">
        <Link href="/opportunities" className="hover:text-[#00A6E8] transition-colors">
          Opportunities
        </Link>
        <span>/</span>
        <span className="text-[#00A6E8] font-bold">{opp.category}</span>
        <span>/</span>
        <span className="text-[#0A192A] font-semibold">{opp.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* ============================================================ */}
        {/* LEFT COLUMN: Opportunity Profile & Content */}
        {/* ============================================================ */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Hero Header Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCECF2] shadow-sm">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-[#EBF6FC] text-[#00A6E8] font-bold text-xs px-3 py-1 rounded">
                {opp.category}
              </span>
              <span className="bg-slate-100 text-[#5F7180] font-semibold text-xs px-3 py-1 rounded">
                {opp.sector}
              </span>
              {opp.isDemo ? (
                <span className="bg-slate-100 text-[#5F7180] font-bold text-xs px-3 py-1 rounded border border-slate-200 uppercase tracking-wider">
                  Sample Showcase
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 font-extrabold text-xs px-3 py-1 rounded border border-emerald-200 flex items-center gap-1 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Live Published Listing
                </span>
              )}
              {opp.stageBadge && (
                <span className="bg-[#EBF6FC] text-[#00658F] font-bold text-xs px-3 py-1 rounded border border-[#DCECF2]">
                  {opp.stageBadge}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192A] tracking-tight font-heading mb-3">
              {opp.title}
            </h1>

            <p className="text-sm sm:text-base text-[#5F7180] leading-relaxed mb-6">
              {opp.shortDescription}
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[#DCECF2]">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5F7180]">
                  Location
                </span>
                <span className="text-sm sm:text-base font-bold text-[#0A192A] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] text-[#00A6E8]">
                    location_on
                  </span>
                  {opp.location}
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5F7180]">
                  Investment Range
                </span>
                <span className="text-sm sm:text-base font-bold text-[#00658F] mt-0.5 block">
                  {opp.investmentRange}
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5F7180]">
                  Target Requirement
                </span>
                <span className="text-sm sm:text-base font-bold text-[#0A192A] mt-0.5 block">
                  {opp.targetRaise}
                </span>
              </div>
            </div>
          </div>

          {/* Cover Media */}
          <div className="h-64 sm:h-96 w-full relative rounded-2xl overflow-hidden border border-[#DCECF2] bg-slate-100 shadow-sm">
            <Image
              src={imgSrc}
              alt={opp.title || "Opportunity"}
              fill
              unoptimized
              className="object-cover"
              onError={() => setImgSrc(DEFAULT_IMAGE)}
            />
          </div>

          {/* Overview & Narrative */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCECF2] shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0A192A] mb-3 font-heading">
                Overview
              </h2>
              <p className="text-sm sm:text-base text-[#5F7180] leading-relaxed">
                {opp.overview}
              </p>
            </div>

            <div className="pt-4 border-t border-[#DCECF2]">
              <h2 className="text-xl font-bold text-[#0A192A] mb-3 font-heading">
                Business Description
              </h2>
              <p className="text-sm sm:text-base text-[#5F7180] leading-relaxed">
                {opp.businessDescription}
              </p>
            </div>

            {/* Opportunity Details */}
            {opp.opportunityDetails && opp.opportunityDetails.length > 0 && (
              <div className="pt-4 border-t border-[#DCECF2]">
                <h2 className="text-xl font-bold text-[#0A192A] mb-3 font-heading">
                  Opportunity Highlights
                </h2>
                <ul className="space-y-2.5">
                  {opp.opportunityDetails.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#5F7180]">
                      <span className="w-5 h-5 rounded-full bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Key Information & Action Sidebar */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Box */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCECF2] shadow-sm sticky top-28">
            <h3 className="text-lg font-bold text-[#0A192A] mb-2 font-heading">
              Express Interest
            </h3>
            <p className="text-xs sm:text-sm text-[#5F7180] mb-6 leading-relaxed">
              Connect directly with Wenturex to receive further information or discuss terms.
            </p>

            <div className="space-y-3">
              {/* Primary CTA */}
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full py-3.5 bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>I&apos;m Interested</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              {/* Secondary Contact CTA */}
              <Link
                href="/contact"
                className="w-full py-3 bg-[#F6FAFF] hover:bg-white border border-[#DCECF2] hover:border-[#00A6E8] text-[#0A192A] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>Contact Wenturex</span>
              </Link>

              {/* WhatsApp CTA */}
              {isAuthenticated ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Chat on WhatsApp ({displayPhone})</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Chat on WhatsApp</span>
                </button>
              )}
            </div>

            {/* Key Information Table */}
            <div className="mt-8 pt-6 border-t border-[#DCECF2] space-y-3">
              <h4 className="text-xs font-bold text-[#0A192A] uppercase tracking-wider">
                Key Opportunity Details
              </h4>
              {opp.keyInformation
                .filter((info) => {
                  if (!isAuthenticated) {
                    const lower = info.label.toLowerCase();
                    if (lower.includes("phone") || lower.includes("email") || lower.includes("contact")) {
                      return false;
                    }
                  }
                  return true;
                })
                .map((info, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                    <span className="text-[#5F7180]">{info.label}:</span>
                    <span className="font-semibold text-[#0A192A] text-right">{info.value}</span>
                  </div>
                ))}
            </div>

            {/* Direct Contact Info */}
            <div className="mt-6 pt-4 border-t border-[#DCECF2] text-xs text-[#5F7180] space-y-2">
              {isAuthenticated ? (
                <>
                  <p>
                    <strong>Direct Contact:</strong> {displayPhone}
                  </p>
                  {opp.contactEmail && (
                    <p>
                      <strong>Listing Email:</strong> {opp.contactEmail}
                    </p>
                  )}
                  <p>
                    <strong>Wenturex Desk:</strong> {COMPANY.contact.generalEmail}
                  </p>
                </>
              ) : (
                <>
                  <div className="p-3 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#00A6E8] shrink-0 mt-0.5">lock</span>
                    <div>
                      <p className="font-bold text-[#0A192A] text-xs">Direct Contact Protected</p>
                      <p className="text-[11px] text-[#5F7180] leading-snug mt-0.5">
                        Private contact details are reserved for verified users. Sign in and express interest to connect directly.
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#5F7180]">
                    <strong>Platform Desk:</strong> {COMPANY.contact.generalEmail}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <OpportunityEnquiryModal
        opportunity={opp}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
