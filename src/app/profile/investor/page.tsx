"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  InvestorProfile,
  InvestorType,
  INVESTOR_TYPES,
  INVESTMENT_STAGES,
  INVESTOR_RANGES,
  getMyInvestorProfile,
  saveInvestorProfile,
} from "@/lib/firebase/investors";
import { SECTORS } from "@/lib/constants/sectors";
import { motion } from "framer-motion";

export default function ProfileInvestorPage() {
  const router = useRouter();
  const {
    user,
    profile,
    role,
    isEntrepreneur,
    isInvestor,
    hasBothRoles,
    isAdmin,
    loading: authLoading,
    isAuthenticated,
    refreshProfile,
  } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingProfile, setExistingProfile] = useState<InvestorProfile | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [investorName, setInvestorName] = useState("");
  const [investorType, setInvestorType] = useState<InvestorType>("Angel Investor");
  const [location, setLocation] = useState("");
  const [investmentRange, setInvestmentRange] = useState(INVESTOR_RANGES[1]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([
    SECTORS[0]?.name || "Technology",
    SECTORS[1]?.name || "Food & Beverage",
  ]);
  const [investmentStage, setInvestmentStage] = useState(INVESTMENT_STAGES[1]);
  const [areasOfExpertise, setAreasOfExpertise] = useState("Strategy, Capital Allocation, Market Expansion");
  const [shortIntroduction, setShortIntroduction] = useState("");
  const [experience, setExperience] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const isPendingReview = existingProfile?.status === "pending";

  // User is restricted if their role is Entrepreneur (and not dual-role) OR if they are not an investor and not admin
  const isEntrepreneurOnly =
    (role === "entrepreneur" && !hasBothRoles) ||
    (isEntrepreneur && !isInvestor && !hasBothRoles) ||
    (profile?.role === "entrepreneur" && !hasBothRoles);

  const isRestricted =
    !authLoading &&
    isAuthenticated &&
    (isEntrepreneurOnly || (!isInvestor && role !== "investor" && !isAdmin));

  // Route protection
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/profile/investor");
      }
    }
  }, [authLoading, isAuthenticated, router]);

  // Load existing profile from Firestore
  useEffect(() => {
    if (isRestricted) return;
    async function load() {
      if (!user) return;
      setLoading(true);
      const res = await getMyInvestorProfile(user.uid);
      if (res.profile) {
        setExistingProfile(res.profile);
        setInvestorName(res.profile.investorName);
        setInvestorType(res.profile.investorType);
        setLocation(res.profile.location);
        setInvestmentRange(res.profile.investmentRange);
        setSelectedSectors(res.profile.preferredSectors || []);
        setInvestmentStage(res.profile.investmentStage);
        setAreasOfExpertise(res.profile.areasOfExpertise?.join(", ") || "");
        setShortIntroduction(res.profile.shortIntroduction);
        setExperience(res.profile.experience);
        setProfileImage(res.profile.profileImage || "");
      } else {
        // Pre-populate with defaults from basic user profile
        setInvestorName(profile?.fullName || profile?.name || "");
        setLocation(profile?.location || "Mumbai, India");
      }
      setLoading(false);
    }

    if (user) {
      load();
    }
  }, [user, profile, isRestricted]);

  const toggleSector = (secName: string) => {
    if (isPendingReview) return;
    if (selectedSectors.includes(secName)) {
      setSelectedSectors(selectedSectors.filter((s) => s !== secName));
    } else {
      setSelectedSectors([...selectedSectors, secName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (isPendingReview) {
      setErrorMsg("Your investor profile is currently under administrative review.");
      return;
    }

    if (!investorName.trim()) {
      setErrorMsg("Please provide your investor name.");
      return;
    }
    if (!location.trim()) {
      setErrorMsg("Please specify your location.");
      return;
    }
    if (selectedSectors.length === 0) {
      setErrorMsg("Please select at least one preferred sector.");
      return;
    }
    if (!shortIntroduction.trim() || shortIntroduction.trim().length < 20) {
      setErrorMsg("Please provide a short introduction of at least 20 characters.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const expertiseList = areasOfExpertise
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await saveInvestorProfile(user.uid, {
      investorName: investorName.trim(),
      investorType,
      location: location.trim(),
      investmentRange,
      preferredSectors: selectedSectors,
      investmentStage,
      areasOfExpertise: expertiseList,
      shortIntroduction: shortIntroduction.trim(),
      experience: experience.trim() || shortIntroduction.trim(),
      profileImage: profileImage.trim() || undefined,
    });

    setSaving(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg("Your investor profile has been submitted and is now under administrative review.");
      await refreshProfile();
      // Reload profile to reflect pending state
      const updated = await getMyInvestorProfile(user.uid);
      if (updated.profile) {
        setExistingProfile(updated.profile);
      }
    }
  };

  // If user is signed in as an Entrepreneur (or non-investor), block access and prompt to sign up/in as Investor
  if (isRestricted) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6FAFF]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-16 px-5 sm:px-8">
          <div className="max-w-lg w-full bg-white border border-[#DCECF2] rounded-3xl p-8 sm:p-10 shadow-[0_16px_40px_rgba(10,25,42,0.06)] text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#00A6E8]/20">
              <span className="material-symbols-outlined text-[32px]">badge</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold mb-3">
              <span className="material-symbols-outlined text-[15px] text-amber-600">lock</span>
              <span>Investor Account Required</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A192A] mb-3 font-heading tracking-tight">
              Investor Profile Access Restricted
            </h1>

            <p className="text-sm text-[#5F7180] leading-relaxed mb-8">
              You are currently signed in as an <strong>Entrepreneur</strong>. Creating a public investor profile is reserved exclusively for registered Investors. To create an investor profile and let entrepreneurs discover your capital criteria, please sign up or sign in with an Investor account.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/signup/investor"
                className="w-full py-3.5 px-6 rounded-xl bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>Sign Up as Investor</span>
              </Link>

              <Link
                href="/login/investor"
                className="w-full py-3 px-6 rounded-xl bg-white border border-[#DCECF2] hover:bg-[#F4FAFD] text-[#00658F] font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                <span>Sign In with Existing Investor Account</span>
              </Link>

              <Link
                href="/profile"
                className="w-full py-2.5 text-xs font-semibold text-[#5F7180] hover:text-[#0A192A] transition-colors"
              >
                ← Return to Profile
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6FAFF]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-[#00A6E8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-[#5F7180]">Loading investor profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F6FAFF] selection:bg-[#00A6E8] selection:text-white">
      <Navbar />

      <main className="flex-grow py-12 sm:py-16">
        <div className="w-full max-w-[960px] mx-auto px-5 sm:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-[#5F7180]">
            <Link href="/profile" className="hover:text-[#00A6E8] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              <span>Account Profile</span>
            </Link>
            <span>/</span>
            <span className="text-[#0A192A] font-semibold">My Investor Profile</span>
          </nav>

          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-[#DCECF2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
                  Directory Listing Management
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A192A] tracking-tight font-heading">
                  My Investor Profile
                </h1>
                <p className="text-xs sm:text-sm text-[#5F7180] mt-1.5 leading-relaxed max-w-2xl">
                  Create and manage the investor profile that entrepreneurs can discover on Wenturex. Add your investment interests, experience, preferred sectors and other details to help entrepreneurs understand your profile.
                </p>
              </div>

              {/* Status Badge & Explanation */}
              <div className="self-start sm:self-auto shrink-0">
                {existingProfile?.status === "published" ? (
                  <div className="sm:text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      PUBLISHED
                    </span>
                    <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                      Entrepreneurs can now discover your investor profile.
                    </p>
                  </div>
                ) : existingProfile?.status === "rejected" ? (
                  <div className="sm:text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      REJECTED
                    </span>
                    <p className="text-[11px] text-rose-700 mt-1 font-medium">
                      Review the admin feedback, update your profile and resubmit.
                    </p>
                  </div>
                ) : isPendingReview ? (
                  <div className="sm:text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      UNDER REVIEW
                    </span>
                    <p className="text-[11px] text-amber-700 mt-1 font-medium">
                      Your profile is awaiting admin approval.
                    </p>
                  </div>
                ) : (
                  <div className="sm:text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
                      NOT YET CREATED
                    </span>
                    <p className="text-[11px] text-[#5F7180] mt-1 font-medium">
                      Your profile becomes visible to entrepreneurs after admin approval.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pending Administrative Review Notification Banner */}
            {isPendingReview && (
              <div className="mt-5 p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3.5">
                <span className="material-symbols-outlined text-[24px] text-amber-600 shrink-0 mt-0.5">
                  pending_actions
                </span>
                <div>
                  <h2 className="font-bold text-sm sm:text-base text-amber-950">
                    Under Review — Your profile is awaiting admin approval.
                  </h2>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Our administration team is reviewing your profile criteria and credentials. While your submission is under review, edits and re-submissions are paused to ensure data consistency. Your profile becomes visible to entrepreneurs after admin approval.
                  </p>
                </div>
              </div>
            )}

            {/* Published Banner if published */}
            {existingProfile?.status === "published" && (
              <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-emerald-600 shrink-0">
                  check_circle
                </span>
                <div>
                  <strong className="block font-bold">Published — Entrepreneurs can now discover your investor profile.</strong>
                  <p className="mt-0.5 text-emerald-800">Your profile is actively published and visible to entrepreneurs across the platform.</p>
                </div>
              </div>
            )}

            {/* Rejection Alert if applicable */}
            {existingProfile?.status === "rejected" && (
              <div className="mt-5 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-rose-600 shrink-0">
                  feedback
                </span>
                <div>
                  <strong className="block font-bold">Rejected — Review the admin feedback, update your profile and resubmit.</strong>
                  {existingProfile.rejectionReason && (
                    <p className="mt-1.5 p-2.5 bg-white/70 rounded-lg border border-rose-200 text-rose-900 font-medium">
                      {existingProfile.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Feedback Messages */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
              <span>{successMsg}</span>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px] text-rose-600">error</span>
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Main Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white border border-[#DCECF2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#0A192A] mb-1.5">
                    Investor / Entity Name *
                  </label>
                  <input
                    type="text"
                    value={investorName}
                    onChange={(e) => setInvestorName(e.target.value)}
                    required
                    disabled={isPendingReview || saving}
                    placeholder="e.g. Rajesh Singhania"
                    className="w-full px-4 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A192A] mb-1.5">
                    Investor Type *
                  </label>
                  <select
                    value={investorType}
                    onChange={(e) => setInvestorType(e.target.value as InvestorType)}
                    disabled={isPendingReview || saving}
                    className="w-full px-4 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                  >
                    {INVESTOR_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#0A192A] mb-1.5">
                    Location / Headquarters *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    disabled={isPendingReview || saving}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full px-4 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A192A] mb-1">
                    Target Investment Range *
                  </label>
                  <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                    Tell entrepreneurs the typical investment amount you are looking to invest.
                  </p>
                  <select
                    value={investmentRange}
                    onChange={(e) => setInvestmentRange(e.target.value)}
                    disabled={isPendingReview || saving}
                    className="w-full px-4 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                  >
                    {INVESTOR_RANGES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#0A192A] mb-1">
                    Preferred Investment Stage *
                  </label>
                  <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                    Choose the business stages you prefer, such as startup, growth or established businesses.
                  </p>
                  <select
                    value={investmentStage}
                    onChange={(e) => setInvestmentStage(e.target.value)}
                    disabled={isPendingReview || saving}
                    className="w-full px-4 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                  >
                    {INVESTMENT_STAGES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A192A] mb-1">
                    Profile Image URL (Optional)
                  </label>
                  <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                    Provide a direct link to your professional headshot or company logo.
                  </p>
                  <input
                    type="url"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    disabled={isPendingReview || saving}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Preferred Sectors */}
              <div>
                <label className="block text-xs font-bold text-[#0A192A] mb-1">
                  Preferred Sectors * {isPendingReview ? "(Locked during review)" : "(Click to select)"}
                </label>
                <p className="text-[11px] text-[#5F7180] mb-2 leading-snug">
                  Select the industries you are interested in investing in.
                </p>
                <div className="flex flex-wrap gap-2 p-3 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl max-h-48 overflow-y-auto">
                  {SECTORS.map((sec) => {
                    const isSelected = selectedSectors.includes(sec.name);
                    return (
                      <button
                        type="button"
                        key={sec.id}
                        onClick={() => toggleSector(sec.name)}
                        disabled={isPendingReview || saving}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-[#00A6E8] text-white shadow-sm"
                            : "bg-white border border-[#DCECF2] text-[#5F7180] hover:text-[#0A192A]"
                        } ${
                          isPendingReview ? "opacity-75 cursor-not-allowed hover:text-[#5F7180]" : ""
                        }`}
                      >
                        {isSelected && "✓ "}
                        {sec.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Areas of Expertise */}
              <div>
                <label className="block text-xs font-bold text-[#0A192A] mb-1">
                  Areas of Expertise
                </label>
                <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                  Highlight the industries, skills or business areas where you have experience.
                </p>
                <input
                  type="text"
                  value={areasOfExpertise}
                  onChange={(e) => setAreasOfExpertise(e.target.value)}
                  disabled={isPendingReview || saving}
                  placeholder="e.g. Market Expansion, Growth Strategy, Tech Architecture, Fundraising"
                  className="w-full px-4 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* Short Introduction */}
              <div>
                <label className="block text-xs font-bold text-[#0A192A] mb-1">
                  Short Introduction *
                </label>
                <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                  Briefly introduce yourself and your investment interests.
                </p>
                <textarea
                  rows={3}
                  value={shortIntroduction}
                  onChange={(e) => setShortIntroduction(e.target.value)}
                  required
                  disabled={isPendingReview || saving}
                  placeholder="Briefly state your core focus, criteria, and what you look for in potential founders..."
                  className="w-full px-4 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* Detailed Experience */}
              <div>
                <label className="block text-xs font-bold text-[#0A192A] mb-1">
                  Experience
                </label>
                <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                  Share relevant investment, business or industry experience.
                </p>
                <textarea
                  rows={4}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  disabled={isPendingReview || saving}
                  placeholder="Elaborate on your career background, past investments, operational experience, or strategic networks..."
                  className="w-full px-4 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* Submit Row */}
              <div className="pt-4 border-t border-[#DCECF2] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#5F7180]">
                  <span className="material-symbols-outlined text-[18px] text-[#00A6E8]">visibility</span>
                  <span><strong>Profile Visibility:</strong> Your profile becomes visible to entrepreneurs after admin approval.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    href="/profile"
                    className="flex-1 sm:flex-none px-5 py-2.5 border border-[#DCECF2] hover:bg-slate-50 text-[#0A192A] text-xs font-bold rounded-xl transition-colors text-center"
                  >
                    Back to Profile
                  </Link>

                  {!isPendingReview ? (
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-[#00A6E8] hover:bg-[#0093CE] text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {saving ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>
                          {existingProfile?.status === "published"
                            ? "Save & Update Profile"
                            : existingProfile?.status === "rejected"
                            ? "Update & Resubmit for Review"
                            : "Save & Submit for Admin Review"}
                        </span>
                      )}
                    </button>
                  ) : (
                    <div className="flex-1 sm:flex-none px-5 py-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed select-none">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span>Under Administrative Review</span>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
