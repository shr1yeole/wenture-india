"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Opportunity } from "@/lib/constants/opportunities";
import { submitOpportunityEnquiry } from "@/lib/firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { COMPANY } from "@/lib/constants/company";

const enquiryFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  role: z.enum(["Investor", "Entrepreneur"]),
  message: z.string().min(5, "Please enter a brief message or question"),
});

type EnquiryFormData = z.infer<typeof enquiryFormSchema>;

interface OpportunityEnquiryModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OpportunityEnquiryModal({
  opportunity,
  isOpen,
  onClose,
}: OpportunityEnquiryModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "Investor",
      message: "I am interested in learning more about this opportunity.",
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    if (!opportunity) return;
    setLoading(true);
    setErrorMsg(null);

    const res = await submitOpportunityEnquiry({
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      name: data.name,
      email: data.email,
      phone: data.phone,
      investmentCapacity: data.role,
      message: data.message,
    });
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSubmitted(true);
      reset();
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrorMsg(null);
    onClose();
  };

  if (!isOpen || !opportunity) return null;

  const whatsappUrl = `https://wa.me/91984181008?text=${encodeURIComponent(
    `Hello Wenturex Team, I am interested in learning more about: ${opportunity.title} (${opportunity.category} - ${opportunity.sector}).`
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#0A192A]/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white border border-[#DCECF2] rounded-2xl shadow-2xl z-10 overflow-hidden my-auto"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-[#DCECF2] flex justify-between items-start bg-[#F6FAFF]">
            <div>
              <span className="text-[11px] text-[#00A6E8] font-bold uppercase tracking-wider block mb-1">
                Opportunity Enquiry
              </span>
              <h3 className="text-xl font-bold text-[#0A192A] leading-tight">
                {opportunity.title}
              </h3>
              <p className="text-xs text-[#5F7180] mt-1 flex items-center gap-2">
                <span>{opportunity.category}</span>
                <span>•</span>
                <span>{opportunity.sector}</span>
                <span>•</span>
                <span>{opportunity.location}</span>
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-[#5F7180] hover:text-[#0A192A] p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              aria-label="Close Modal"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-[#EBF6FC] text-[#00A6E8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[30px]">check_circle</span>
                </div>
                <h4 className="text-2xl font-bold text-[#0A192A] mb-2">
                  Enquiry Received
                </h4>
                <p className="text-sm text-[#5F7180] max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you. Your enquiry has been received. The Wenturex team will get in touch with you.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-sm rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                    {errorMsg}
                  </div>
                )}

                {/* Pre-populated Opportunity Banner */}
                <div className="p-3 bg-[#F6FAFF] rounded-lg border border-[#DCECF2] flex items-center justify-between text-xs">
                  <span className="text-[#5F7180]">Selected Opportunity:</span>
                  <span className="font-bold text-[#0A192A]">{opportunity.title}</span>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#0A192A] mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    {...register("name")}
                    className="w-full px-4 py-2.5 bg-white border border-[#DCECF2] rounded-lg text-sm text-[#0A192A] placeholder:text-slate-400 focus:outline-none focus:border-[#00A6E8] focus:ring-1 focus:ring-[#00A6E8]/20"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#0A192A] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@email.com"
                      {...register("email")}
                      className="w-full px-4 py-2.5 bg-white border border-[#DCECF2] rounded-lg text-sm text-[#0A192A] placeholder:text-slate-400 focus:outline-none focus:border-[#00A6E8] focus:ring-1 focus:ring-[#00A6E8]/20"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0A192A] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 95407 21008"
                      {...register("phone")}
                      className="w-full px-4 py-2.5 bg-white border border-[#DCECF2] rounded-lg text-sm text-[#0A192A] placeholder:text-slate-400 focus:outline-none focus:border-[#00A6E8] focus:ring-1 focus:ring-[#00A6E8]/20"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Role Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-[#0A192A] mb-1.5">
                    I am an:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-[#DCECF2] bg-[#F6FAFF] cursor-pointer hover:bg-white text-xs font-semibold text-[#0A192A]">
                      <input
                        type="radio"
                        value="Investor"
                        {...register("role")}
                        className="text-[#00A6E8] focus:ring-[#00A6E8]"
                      />
                      <span>Investor</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-[#DCECF2] bg-[#F6FAFF] cursor-pointer hover:bg-white text-xs font-semibold text-[#0A192A]">
                      <input
                        type="radio"
                        value="Entrepreneur"
                        {...register("role")}
                        className="text-[#00A6E8] focus:ring-[#00A6E8]"
                      />
                      <span>Entrepreneur</span>
                    </label>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-[#0A192A] mb-1">
                    Message / Questions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what information you are seeking..."
                    {...register("message")}
                    className="w-full px-4 py-2 bg-white border border-[#DCECF2] rounded-lg text-sm text-[#0A192A] placeholder:text-slate-400 focus:outline-none focus:border-[#00A6E8] focus:ring-1 focus:ring-[#00A6E8]/20"
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <span>{loading ? "Submitting..." : "Submit Enquiry"}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>

                  {/* Direct WhatsApp Option */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs rounded-lg transition-colors border border-emerald-200 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Chat on WhatsApp ({COMPANY.contact.whatsapp})</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
