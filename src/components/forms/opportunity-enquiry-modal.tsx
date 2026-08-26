"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquiryModalSchema, EnquiryModalInput } from "@/lib/validation/auth-schemas";
import { submitOpportunityEnquiry } from "@/lib/firebase/firestore";
import { Opportunity } from "@/lib/constants/opportunities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

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
  } = useForm<EnquiryModalInput>({
    resolver: zodResolver(enquiryModalSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      investmentCapacity: "$1M - $5M",
      message: "I am interested in learning more about this opportunity.",
    },
  });

  const onSubmit = async (data: EnquiryModalInput) => {
    if (!opportunity) return;
    setLoading(true);
    setErrorMsg(null);

    const res = await submitOpportunityEnquiry({
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      name: data.name,
      email: data.email,
      phone: data.phone,
      investmentCapacity: data.investmentCapacity,
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-on-surface/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-surface-pure border border-border-subtle rounded-2xl shadow-2xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-border-subtle flex justify-between items-start bg-surface-container-low/50">
            <div>
              <span className="font-label-caps text-[11px] text-primary uppercase tracking-wider">
                Direct Deal Inquiry
              </span>
              <h3 className="font-headline-md text-xl font-bold text-on-surface mt-1">
                {opportunity.title}
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                Target: {opportunity.targetRaise} • {opportunity.location}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-surface-container-high text-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[28px]">check_circle</span>
                </div>
                <h4 className="font-headline-md text-xl font-bold text-on-surface mb-2">
                  Enquiry Submitted
                </h4>
                <p className="font-body-md text-sm text-on-surface-variant mb-6">
                  Your interest in <strong className="text-on-surface">{opportunity.title}</strong> has been logged. The deal coordinator will connect with you via email.
                </p>
                <Button onClick={handleClose} className="w-full">
                  Close Window
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-error-container text-on-error-container text-xs">
                    {errorMsg}
                  </div>
                )}

                <Input
                  id="modal-name"
                  label="Your Full Name"
                  placeholder="e.g. Anand Mahindra"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="modal-email"
                    label="Corporate Email"
                    type="email"
                    placeholder="name@fund.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />

                  <Input
                    id="modal-phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="+91 95407 21008"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="modal-capacity"
                    className="block font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
                  >
                    Investment Range / Allocation
                  </label>
                  <select
                    id="modal-capacity"
                    className="w-full bg-surface-pure border border-border-subtle rounded-lg px-4 py-2.5 text-on-surface font-body-md text-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                    {...register("investmentCapacity")}
                  >
                    <option value="Under $1M">Under $1M (₹8 Cr)</option>
                    <option value="$1M - $5M">$1M - $5M (₹8 - 40 Cr)</option>
                    <option value="$5M - $20M">$5M - $20M (₹40 - 160 Cr)</option>
                    <option value="$20M+">$20M+ (₹160+ Cr)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="modal-msg"
                    className="block font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
                  >
                    Note / Questions
                  </label>
                  <textarea
                    id="modal-msg"
                    rows={3}
                    className="w-full bg-surface-pure border border-border-subtle rounded-lg px-4 py-2 text-on-surface font-body-md text-sm placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-xs text-error">{errors.message.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {loading ? "Transmitting..." : "Express Interest"}
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
