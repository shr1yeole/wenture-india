"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  entrepreneurLoginSchema,
  entrepreneurSignupSchema,
  EntrepreneurLoginInput,
  EntrepreneurSignupInput,
} from "@/lib/validation/auth-schemas";
import { signInUser, signUpUser } from "@/lib/firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EntrepreneurAuthFormProps {
  mode: "login" | "signup";
}

export function EntrepreneurAuthForm({ mode }: EntrepreneurAuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login Hook
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
  } = useForm<EntrepreneurLoginInput>({
    resolver: zodResolver(entrepreneurLoginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  // Signup Hook
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup },
  } = useForm<EntrepreneurSignupInput>({
    resolver: zodResolver(entrepreneurSignupSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      location: "",
      sector: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onLoginSubmit = async (data: EntrepreneurLoginInput) => {
    setLoading(true);
    setServerError(null);
    setSuccessMessage(null);

    const res = await signInUser(data.email, data.password);
    setLoading(false);

    if (res.error) {
      setServerError(res.error);
    } else {
      setSuccessMessage("Authentication successful! Redirecting to founder dashboard...");
    }
  };

  const onSignupSubmit = async (data: EntrepreneurSignupInput) => {
    setLoading(true);
    setServerError(null);
    setSuccessMessage(null);

    const res = await signUpUser(data.email, data.password, {
      fullName: data.fullName,
      companyName: data.companyName,
      phone: data.phone,
      location: data.location,
      sector: data.sector,
      role: "entrepreneur",
    });
    setLoading(false);

    if (res.error) {
      setServerError(res.error);
    } else {
      setSuccessMessage("Founder registration received! Welcome to Wenturex.");
    }
  };

  if (mode === "login") {
    return (
      <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3.5 rounded-lg bg-error-container text-on-error-container text-sm font-body-md">
            {serverError}
          </div>
        )}
        {successMessage && (
          <div className="p-3.5 rounded-lg bg-surface-container-low text-primary text-sm font-body-md">
            {successMessage}
          </div>
        )}

        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          icon="mail"
          error={errorsLogin.email?.message}
          {...registerLogin("email")}
        />

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="block font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
            >
              Password
            </label>
            <a
              href="#"
              className="text-xs text-primary-container hover:text-primary font-semibold transition-colors"
            >
              Forgot Password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            icon="lock"
            error={errorsLogin.password?.message}
            {...registerLogin("password")}
          />
        </div>

        <div className="flex items-center pt-1">
          <input
            id="rememberMe"
            type="checkbox"
            className="h-4 w-4 rounded border-border-subtle text-primary-container focus:ring-primary-container"
            {...registerLogin("rememberMe")}
          />
          <label htmlFor="rememberMe" className="ml-2 block font-body-md text-xs text-on-surface-variant">
            Keep me logged in
          </label>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Login as Entrepreneur"}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Button>
        </div>

        <div className="text-center pt-3 border-t border-border-subtle mt-4">
          <p className="font-body-md text-sm text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup/entrepreneur"
              className="text-primary-container font-semibold hover:underline"
            >
              Apply to join
            </Link>
          </p>
        </div>

        <div className="text-center pt-1">
          <Link
            href="/login/investor"
            className="inline-flex items-center gap-1 font-label-caps text-xs text-secondary hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
            Switch to Investor Login
          </Link>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmitSignup(onSignupSubmit)} className="space-y-4">
      {serverError && (
        <div className="p-3.5 rounded-lg bg-error-container text-on-error-container text-sm font-body-md">
          {serverError}
        </div>
      )}
      {successMessage && (
        <div className="p-3.5 rounded-lg bg-surface-container-low text-primary text-sm font-body-md">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="fullName"
          label="Full Name"
          placeholder="Jane Doe"
          error={errorsSignup.fullName?.message}
          {...registerSignup("fullName")}
        />

        <Input
          id="companyName"
          label="Business / Company Name"
          placeholder="Acme Enterprises"
          error={errorsSignup.companyName?.message}
          {...registerSignup("companyName")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="email"
          label="Work Email"
          type="email"
          placeholder="jane@company.com"
          error={errorsSignup.email?.message}
          {...registerSignup("email")}
        />

        <Input
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="+91 95407 21008"
          error={errorsSignup.phone?.message}
          {...registerSignup("phone")}
        />
      </div>

      <Input
        id="location"
        label="Location"
        placeholder="New Delhi, India"
        icon="location_on"
        error={errorsSignup.location?.message}
        {...registerSignup("location")}
      />

      <div className="space-y-1.5">
        <label
          htmlFor="sector"
          className="block font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
        >
          Business Sector
        </label>
        <select
          id="sector"
          className="w-full bg-surface-pure border border-border-subtle rounded-lg px-4 py-3 text-on-surface font-body-md text-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
          {...registerSignup("sector")}
        >
          <option value="">Select your primary sector</option>
          <option value="FinTech">FinTech</option>
          <option value="HealthTech">HealthTech</option>
          <option value="Enterprise SaaS">Enterprise SaaS</option>
          <option value="CleanTech">CleanTech</option>
          <option value="Logistics">Logistics & Supply Chain</option>
          <option value="Real Estate">Real Estate & Infrastructure</option>
          <option value="Manufacturing">Advanced Manufacturing</option>
          <option value="Food & Beverage">Food & Beverage / Franchise</option>
          <option value="EXIM">Export & Import (EXIM)</option>
          <option value="Other">Other</option>
        </select>
        {errorsSignup.sector && (
          <p className="text-xs text-error">{errorsSignup.sector.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          icon="lock"
          error={errorsSignup.password?.message}
          {...registerSignup("password")}
        />

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          icon="lock"
          error={errorsSignup.confirmPassword?.message}
          {...registerSignup("confirmPassword")}
        />
      </div>

      <div className="flex items-start gap-2 pt-2">
        <input
          id="terms"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-border-subtle text-primary-container focus:ring-primary-container"
          {...registerSignup("terms")}
        />
        <label htmlFor="terms" className="font-body-md text-xs text-on-surface-variant">
          I agree to the{" "}
          <span className="text-primary-container hover:underline cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-primary-container hover:underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </label>
      </div>
      {errorsSignup.terms && (
        <p className="text-xs text-error">{errorsSignup.terms.message}</p>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5"
        >
          {loading ? "Registering..." : "Join as Entrepreneur"}
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Button>
      </div>

      <div className="text-center pt-2">
        <p className="font-body-md text-sm text-secondary">
          Already have an account?{" "}
          <Link
            href="/login/entrepreneur"
            className="text-primary-container font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}
