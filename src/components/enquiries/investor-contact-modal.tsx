"use client";

import React, { useState } from "react";
import { OpportunityEnquiry, EnquiryStatus } from "@/lib/firebase/firestore";
import { formatWhatsAppNumber } from "@/lib/constants/opportunities";
import { AnimatePresence, motion } from "framer-motion";

export function formatEnquiryWhatsAppText(enq: OpportunityEnquiry): string {
  const name = enq.senderName || enq.name || "Investor";
  const opp = enq.opportunityTitle || "your opportunity";
  const range = enq.investmentRange || enq.investmentCapacity || "Flexible";
  const loc = enq.senderLocation || "India";
  const role = enq.senderType || enq.senderRole || "Verified Investor";
  const msg = enq.message ? `"${enq.message}"` : "Expressed interest";

  return `Hello ${name},

Thank you for your interest in "${opp}" on Wenturex.

*Inquiry Details:*
• Investor Name: ${name} (${role})
• Investment Range: ${range}
• Location: ${loc}
• Message: ${msg}

I would be glad to share further details and discuss this opportunity with you.`;
}

export function formatEnquiryEmailSubject(enq: OpportunityEnquiry): string {
  return `Re: Interest in "${enq.opportunityTitle || "Business Opportunity"}" on Wenturex`;
}

export function formatEnquiryEmailBody(enq: OpportunityEnquiry, entrepreneurName?: string): string {
  const name = enq.senderName || enq.name || "Investor";
  const opp = enq.opportunityTitle || "Business Opportunity";
  const range = enq.investmentRange || enq.investmentCapacity || "Flexible";
  const loc = enq.senderLocation || "India";
  const role = enq.senderType || enq.senderRole || "Verified Investor";
  const msg = enq.message || "Expressed interest in your opportunity.";

  return `Dear ${name},

Thank you for expressing interest in "${opp}" on Wenturex.

--- Enquiry Summary ---
• Investor Name: ${name}
• Investor Role/Type: ${role}
• Investment Range: ${range}
• Location: ${loc}
• Inquiry Message: "${msg}"
-----------------------

I would be delighted to share our presentation, financial summary, and discuss potential collaboration with you.

Looking forward to connecting with you.

Best regards,
${entrepreneurName || "Entrepreneur"}`;
}

interface InvestorContactModalProps {
  enquiry: OpportunityEnquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (enquiryId: string, status: EnquiryStatus) => void;
  entrepreneurName?: string;
  initialAction?: "whatsapp" | "email" | "call" | null;
}

export function InvestorContactModal({
  enquiry,
  isOpen,
  onClose,
  onStatusUpdate,
  entrepreneurName,
}: InvestorContactModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !enquiry) return null;

  const investorName = enquiry.senderName || enquiry.name || "Investor";
  const investorPhone = enquiry.senderPhone || enquiry.phone || "";
  const investorEmail = enquiry.senderEmail || enquiry.email || "";
  const investorRole = enquiry.senderRole || enquiry.role || "Investor";
  const investorType = enquiry.senderType || "Verified Investor";
  const investorLocation = enquiry.senderLocation || "India";
  const investmentRange = enquiry.investmentRange || enquiry.investmentCapacity || "Flexible";

  const waUrl = investorPhone
    ? `https://wa.me/${formatWhatsAppNumber(investorPhone)}?text=${encodeURIComponent(
        formatEnquiryWhatsAppText(enquiry)
      )}`
    : "";

  const mailtoUrl = investorEmail
    ? `mailto:${investorEmail}?subject=${encodeURIComponent(
        formatEnquiryEmailSubject(enquiry)
      )}&body=${encodeURIComponent(formatEnquiryEmailBody(enquiry, entrepreneurName))}`
    : "";

  const handleCopy = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getInitials = (nameStr: string) => {
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#DCECF2] overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#00658F] to-[#0A192A] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-[24px] text-white">person</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold">Investor Contact Details</h3>
                <p className="text-xs text-blue-100">
                  Direct connection info for this enquiry
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-[#0A192A]">
            {/* Opportunity Reference Badge */}
            <div className="p-3.5 bg-[#F0F8FD] border border-[#00A6E8]/20 rounded-xl flex items-center justify-between gap-3 flex-wrap">
              <div>
                <span className="text-[11px] font-semibold text-[#5F7180] block">
                  Opportunity Inquired:
                </span>
                <span className="text-sm font-bold text-[#00658F]">
                  {enquiry.opportunityTitle || "Business Opportunity"}
                </span>
              </div>

              {onStatusUpdate && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#5F7180]">Status:</span>
                  <select
                    value={enquiry.status || "New"}
                    onChange={(e) =>
                      onStatusUpdate(enquiry.id || "", e.target.value as EnquiryStatus)
                    }
                    className="text-xs font-bold border border-[#DCECF2] rounded-lg px-2.5 py-1 bg-white text-[#0A192A] focus:outline-none focus:border-[#00A6E8] cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Discussion">In Discussion</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              )}
            </div>

            {/* Investor Identity Card */}
            <div className="flex items-center gap-4 p-4 bg-white border border-[#DCECF2] rounded-xl shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00A6E8] to-[#00658F] text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                {getInitials(investorName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-[#0A192A] truncate">{investorName}</h4>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {investorType}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#5F7180] mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#00A6E8]">
                      location_on
                    </span>
                    {investorLocation}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <span className="material-symbols-outlined text-[14px]">payments</span>
                    {investmentRange}
                  </span>
                  <span>•</span>
                  <span>Role: {investorRole}</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-[#5F7180] uppercase tracking-wider">
                Direct Contact Options
              </h5>

              {/* 1. Phone / Call */}
              <div className="p-3.5 bg-[#F8FAFC] border border-[#DCECF2] rounded-xl flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-[180px]">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#00658F] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#5F7180] block">Phone Number</span>
                    <span className="text-sm font-bold text-[#0A192A]">
                      {investorPhone || "Not provided"}
                    </span>
                  </div>
                </div>

                {investorPhone && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(investorPhone, "phone")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#DCECF2] hover:bg-slate-50 text-[#0A192A] transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedField === "phone" ? "check" : "content_copy"}
                      </span>
                      <span>{copiedField === "phone" ? "Copied!" : "Copy"}</span>
                    </button>

                    <a
                      href={`tel:${investorPhone}`}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#00658F] hover:bg-[#005072] text-white transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      <span>Call Now</span>
                    </a>
                  </div>
                )}
              </div>

              {/* 2. Email */}
              <div className="p-3.5 bg-[#F8FAFC] border border-[#DCECF2] rounded-xl flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-[180px] max-w-full">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#00658F] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] font-semibold text-[#5F7180] block">Email Address</span>
                    <span className="text-sm font-bold text-[#0A192A] truncate block" title={investorEmail}>
                      {investorEmail || "Not provided"}
                    </span>
                  </div>
                </div>

                {investorEmail && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(investorEmail, "email")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#DCECF2] hover:bg-slate-50 text-[#0A192A] transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedField === "email" ? "check" : "content_copy"}
                      </span>
                      <span>{copiedField === "email" ? "Copied!" : "Copy"}</span>
                    </button>

                    <a
                      href={mailtoUrl}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#00A6E8] hover:bg-[#0092cd] text-white transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[14px]">send</span>
                      <span>Send Email</span>
                    </a>
                  </div>
                )}
              </div>

              {/* 3. WhatsApp Direct */}
              {investorPhone && (
                <div className="p-3.5 bg-[#F0FDF4] border border-emerald-200 rounded-xl flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[20px]">chat</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 block">WhatsApp Chat</span>
                      <span className="text-xs text-emerald-700 font-medium">
                        Opens with pre-filled enquiry &amp; investor summary
                      </span>
                    </div>
                  </div>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>

            {/* Investor's Note / Message */}
            <div>
              <span className="text-xs font-bold text-[#5F7180] block mb-1.5 uppercase tracking-wider">
                Inquiry Message from Investor:
              </span>
              <div className="p-4 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] leading-relaxed whitespace-pre-wrap shadow-2xs">
                {enquiry.message || "I am interested in learning more about this opportunity."}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#F8FAFC] border-t border-[#DCECF2] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-[#5F7180] hover:text-[#0A192A] bg-white border border-[#DCECF2] rounded-xl transition-colors shadow-2xs"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
