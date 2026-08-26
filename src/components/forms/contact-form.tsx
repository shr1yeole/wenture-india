"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormInput } from "@/lib/validation/auth-schemas";
import { submitContactMessage } from "@/lib/firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      userRole: "entrepreneur",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormInput) => {
    setLoading(true);
    setErrorMsg(null);

    const res = await submitContactMessage(data);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSubmitted(true);
      reset();
    }
  };

  if (submitted) {
    return (
      <div className="bg-surface-pure border border-border-subtle rounded-xl p-8 text-center shadow-[0px_4px_20px_rgba(10,25,42,0.04)]">
        <div className="w-16 h-16 bg-surface-container-high text-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[32px]">check_circle</span>
        </div>
        <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-2">
          Message Received
        </h3>
        <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-6">
          Thank you for reaching out to Wenturex India International. Our institutional advisory team will review your inquiry and connect with you shortly.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-surface-pure border border-border-subtle rounded-xl p-8 shadow-[0px_4px_20px_rgba(10,25,42,0.04)] space-y-4"
    >
      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-error-container text-on-error-container text-sm font-body-md">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="fullName"
          label="Your Full Name"
          placeholder="e.g. Ramesh Kumar"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <Input
          id="email"
          label="Corporate / Work Email"
          type="email"
          placeholder="ramesh@company.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="+91 95407 21008"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <div className="space-y-1.5">
          <label
            htmlFor="userRole"
            className="block font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
          >
            I am an
          </label>
          <select
            id="userRole"
            className="w-full bg-surface-pure border border-border-subtle rounded-lg px-4 py-3 text-on-surface font-body-md text-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
            {...register("userRole")}
          >
            <option value="entrepreneur">Entrepreneur / Founder</option>
            <option value="investor">Institutional / Angel Investor</option>
            <option value="business_owner">Business Owner</option>
            <option value="franchise_seeker">Franchise Seeker</option>
            <option value="other">Other Inquiry</option>
          </select>
        </div>
      </div>

      <Input
        id="subject"
        label="Subject"
        placeholder="e.g. Opportunity Evaluation / Partnership Inquiry"
        error={errors.subject?.message}
        {...register("subject")}
      />

      <div className="space-y-1.5">
        <label
          htmlFor="message"
          className="block font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
        >
          Message / Requirement
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Please describe your business requirements, capital parameters, or inquiries in detail..."
          className="w-full bg-surface-pure border border-border-subtle rounded-lg px-4 py-3 text-on-surface font-body-md text-sm placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-error font-body-md">{errors.message.message}</p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5"
        >
          {loading ? "Transmitting..." : "Send Message to Advisory Team"}
          <span className="material-symbols-outlined text-[18px]">send</span>
        </Button>
      </div>
    </form>
  );
}
