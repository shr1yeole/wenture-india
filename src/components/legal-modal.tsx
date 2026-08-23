"use client";

import React from "react";
import { X, ShieldCheck, FileText } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "privacy" | "terms";
}

export function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  if (!isOpen) return null;

  const isPrivacy = type === "privacy";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wenture-dark/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            {isPrivacy ? (
              <ShieldCheck className="w-5 h-5 text-wenture-blue" />
            ) : (
              <FileText className="w-5 h-5 text-wenture-blue" />
            )}
            <h3 id="legal-modal-title" className="text-lg font-bold text-wenture-dark">
              {isPrivacy ? "Privacy Policy (Preliminary)" : "Terms & Conditions (Preliminary)"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-wenture-dark hover:bg-slate-200/60 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
          {isPrivacy ? (
            <>
              <p className="font-semibold text-wenture-dark">
                Wenturex India International is committed to protecting your privacy.
              </p>
              <p>
                This website is currently serving as an official preliminary Coming Soon landing page for Wenturex India International (
                <span className="font-medium text-wenture-dark">https://wentureindia.com/</span>).
              </p>
              <h4 className="text-sm font-bold text-wenture-dark pt-2">Information We Collect</h4>
              <p>
                When you initiate contact via email (<code>wentureindia@gmail.com</code> / <code>info@wentureindia.com</code>) or WhatsApp (<code>+91 98418 81008</code>), we collect your contact information solely for the purpose of communicating regarding inquiries, business discussions, and early platform updates.
              </p>
              <h4 className="text-sm font-bold text-wenture-dark pt-2">Data Protection</h4>
              <p>
                We do not sell, rent, or trade your personal or business data to third parties. All communications are held in strict confidence in accordance with applicable data protection standards.
              </p>
              <h4 className="text-sm font-bold text-wenture-dark pt-2">Full Policy Release</h4>
              <p>
                A comprehensive Privacy Policy will be published upon the official commercial rollout of the full Wenturex platform.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-wenture-dark">
                Terms of Use for Wenturex India International Preliminary Portal.
              </p>
              <p>
                By accessing this website (
                <span className="font-medium text-wenture-dark">https://wentureindia.com/</span>), you agree to these preliminary terms of use.
              </p>
              <h4 className="text-sm font-bold text-wenture-dark pt-2">No Financial Guarantees</h4>
              <p>
                Information presented on this landing page is for introductory and informational purposes only. Wenturex India International does not offer guaranteed investment returns or solicit unregulated securities through this coming-soon landing page.
              </p>
              <h4 className="text-sm font-bold text-wenture-dark pt-2">Intellectual Property</h4>
              <p>
                All trademarks, brand assets, logos, and materials appearing on this site are the property of Wenturex India International. Unauthorized reproduction or distribution is strictly prohibited.
              </p>
              <h4 className="text-sm font-bold text-wenture-dark pt-2">Future Platform Agreement</h4>
              <p>
                Participation in any marketplace, investment, or founder programs will be subject to definitive legal agreements executed at the time of official platform onboarding.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-wenture-dark text-white text-xs font-semibold hover:bg-wenture-navy transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
