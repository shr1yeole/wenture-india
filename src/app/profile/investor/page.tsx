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
  uploadInvestorProfileImage,
} from "@/lib/firebase/investors";
import { SECTORS } from "@/lib/constants/sectors";
import { motion } from "framer-motion";
import { FileUploadField, UploadStatus } from "@/components/ui/file-upload-field";

export default function ProfileInvestorPage() {
  const router = useRouter();
  const {
    user,
    profile,
    role,
    isInvestor,
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
  // Section 1: Basic Information
  const [investorName, setInvestorName] = useState("");
  const [investorType, setInvestorType] = useState<InvestorType>("Angel Investor");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactLinkedin, setContactLinkedin] = useState("");

  // Section 2: Investment Preferences
  const [investmentRange, setInvestmentRange] = useState(INVESTOR_RANGES[1]);
  const [typicalInvestmentSize, setTypicalInvestmentSize] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([
    SECTORS[0]?.name || "Technology",
    SECTORS[1]?.name || "Food & Beverage",
  ]);
  const [investmentStage, setInvestmentStage] = useState(INVESTMENT_STAGES[1]);
  const [preferredLocationsText, setPreferredLocationsText] = useState("");

  // Section 3: Investment Background
  const [investmentExperience, setInvestmentExperience] = useState("");
  const [previousInvestments, setPreviousInvestments] = useState("");
  const [areasOfExpertise, setAreasOfExpertise] = useState("Strategy, Capital Allocation, Market Expansion");
  const [professionalBackground, setProfessionalBackground] = useState("");
  const [shortIntroduction, setShortIntroduction] = useState("");
  const [profileImage, setProfileImage] = useState("");

  // Avatar File Upload State
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploadStatus, setAvatarUploadStatus] = useState<UploadStatus>("idle");
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const isPendingReview = existingProfile?.status === "pending";

  // User is restricted if their role is not investor and not admin
  const isRestricted =
    !authLoading &&
    isAuthenticated &&
    (!isInvestor && role !== "investor" && !isAdmin);

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
        setInvestorName(res.profile.investorName || "");
        setInvestorType(res.profile.investorType || "Angel Investor");
        setLocation(res.profile.location || "");
        setContactEmail(res.profile.contactEmail || user.email || "");
        setContactPhone(res.profile.contactPhone || "");
        setContactLinkedin(res.profile.contactLinkedin || "");
        setInvestmentRange(res.profile.investmentRange || INVESTOR_RANGES[1]);
        setTypicalInvestmentSize(res.profile.typicalInvestmentSize || "");
        setSelectedSectors(res.profile.preferredSectors || []);
        setInvestmentStage(res.profile.investmentStage || INVESTMENT_STAGES[1]);
        setPreferredLocationsText(res.profile.preferredLocations?.join(", ") || "");
        setAreasOfExpertise(res.profile.areasOfExpertise?.join(", ") || "");
        setInvestmentExperience(res.profile.investmentExperience || res.profile.experience || "");
        setPreviousInvestments(res.profile.previousInvestments || "");
        setProfessionalBackground(res.profile.professionalBackground || "");
        setShortIntroduction(res.profile.shortIntroduction || "");
        setProfileImage(res.profile.profileImage || "");
      } else {
        // Pre-populate with defaults from basic user profile
        setInvestorName(profile?.fullName || profile?.name || "");
        setLocation(profile?.location || "Mumbai, India");
        setContactEmail(user.email || profile?.email || "");
        setContactPhone(profile?.phone || "");
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

  // Calculate Profile Completeness
  const calculateCompleteness = () => {
    const items = [
      Boolean(investorName.trim()),
      Boolean(investorType),
      Boolean(location.trim()),
      Boolean(contactEmail.trim()),
      Boolean(investmentRange),
      Boolean(typicalInvestmentSize.trim()),
      selectedSectors.length > 0,
      Boolean(investmentStage),
      Boolean(shortIntroduction.trim() && shortIntroduction.trim().length >= 20),
      Boolean(investmentExperience.trim()),
      Boolean(previousInvestments.trim()),
      Boolean(professionalBackground.trim()),
      Boolean(areasOfExpertise.trim()),
    ];
    const completedCount = items.filter(Boolean).length;
    return Math.round((completedCount / items.length) * 100);
  };

  const completenessPercentage = calculateCompleteness();

  const scrollToTarget = (targetId: string) => {
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        if ("focus" in el && typeof (el as HTMLElement).focus === "function") {
          (el as HTMLElement).focus();
        }
      } else {
        const banner = document.getElementById("investor-feedback-banner");
        if (banner) {
          banner.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (isPendingReview) {
      setErrorMsg("Your investor profile is currently under administrative review.");
      scrollToTarget("investor-feedback-banner");
      return;
    }

    if (!investorName.trim()) {
      setErrorMsg("Please provide your full name / investor entity name.");
      scrollToTarget("field-investor-name");
      return;
    }
    if (!location.trim()) {
      setErrorMsg("Please specify your location.");
      scrollToTarget("field-location");
      return;
    }
    if (selectedSectors.length === 0) {
      setErrorMsg("Please select at least one preferred sector.");
      scrollToTarget("field-preferred-sectors");
      return;
    }
    if (!shortIntroduction.trim() || shortIntroduction.trim().length < 20) {
      setErrorMsg("Please provide a short introduction of at least 20 characters.");
      scrollToTarget("field-short-introduction");
      return;
    }

    // Optional email validation
    if (contactEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      setErrorMsg("Please enter a valid contact email address.");
      scrollToTarget("field-contact-email");
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    let finalProfileImage = profileImage.trim() || undefined;

    // Handle profile avatar upload if a new file is selected
    if (avatarFile && avatarUploadStatus !== "success") {
      setAvatarUploadStatus("uploading");
      setAvatarError(null);
      const uploadRes = await uploadInvestorProfileImage(avatarFile, user.uid);

      if (uploadRes.error) {
        setAvatarUploadStatus("error");
        setAvatarError(uploadRes.error);
        setSaving(false);
        setErrorMsg(uploadRes.error);
        scrollToTarget("field-profile-avatar-container");
        return;
      }

      setAvatarUploadStatus("success");
      if (uploadRes.url) {
        finalProfileImage = uploadRes.url;
        setProfileImage(uploadRes.url);
      }
    }

    const expertiseList = areasOfExpertise
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const locationsList = preferredLocationsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await saveInvestorProfile(user.uid, {
      investorName: investorName.trim(),
      investorType,
      location: location.trim(),
      contactEmail: contactEmail.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      contactLinkedin: contactLinkedin.trim() || undefined,
      investmentRange,
      typicalInvestmentSize: typicalInvestmentSize.trim() || undefined,
      preferredSectors: selectedSectors,
      investmentStage,
      preferredLocations: locationsList.length > 0 ? locationsList : undefined,
      areasOfExpertise: expertiseList,
      investmentExperience: investmentExperience.trim() || undefined,
      previousInvestments: previousInvestments.trim() || undefined,
      professionalBackground: professionalBackground.trim() || undefined,
      shortIntroduction: shortIntroduction.trim(),
      experience: investmentExperience.trim() || shortIntroduction.trim(),
      profileImage: finalProfileImage,
    });

    setSaving(false);

    if (res.error) {
      setErrorMsg(res.error);
      scrollToTarget("investor-feedback-banner");
    } else {
      setSuccessMsg("Your investor profile has been submitted and is now under administrative review.");
      scrollToTarget("investor-feedback-banner");
      await refreshProfile();
      // Reload profile to reflect pending state
      const updated = await getMyInvestorProfile(user.uid);
      if (updated.profile) {
        setExistingProfile(updated.profile);
      }
    }
  };

  const handleRetryAvatar = async () => {
    if (!avatarFile || !user) return;
    setAvatarUploadStatus("uploading");
    setAvatarError(null);
    const res = await uploadInvestorProfileImage(avatarFile, user.uid);
    if (res.error) {
      setAvatarUploadStatus("error");
      setAvatarError(res.error);
    } else {
      setAvatarUploadStatus("success");
      if (res.url) {
        setProfileImage(res.url);
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

      <main className="flex-grow py-8 sm:py-14">
        <div className="w-full max-w-[960px] mx-auto px-3.5 sm:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-4 sm:mb-6 flex items-center gap-2 text-xs text-[#5F7180]">
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
            className="bg-white border border-[#DCECF2] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] sm:text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
                  Directory Listing Management
                </span>
                <h1 className="text-xl sm:text-3xl font-extrabold text-[#0A192A] tracking-tight font-heading">
                  My Investor Profile
                </h1>
                <p className="text-xs sm:text-sm text-[#5F7180] mt-1.5 leading-relaxed max-w-2xl">
                  Create and manage the investor profile that entrepreneurs can discover on Wenture India. Add your investment interests, experience, preferred sectors and other details to help entrepreneurs understand your profile.
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

            {/* Profile Completion Indicator */}
            <div className="mt-5 pt-5 border-t border-[#DCECF2]">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#00A6E8]">
                    donut_large
                  </span>
                  <span className="text-xs font-bold text-[#0A192A]">
                    Profile Completeness
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#00658F]">
                  {completenessPercentage}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    completenessPercentage >= 80
                      ? "bg-emerald-500"
                      : completenessPercentage >= 50
                      ? "bg-[#00A6E8]"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${completenessPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-[#5F7180] mt-1.5">
                {completenessPercentage >= 80
                  ? "✓ Great job! Your comprehensive profile provides entrepreneurs with clear investment criteria."
                  : "💡 Add your previous investments, background, and typical ticket size to increase relevance for entrepreneurs."}
              </p>
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
          <div id="investor-feedback-banner">
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
                <span className="font-semibold">{errorMsg}</span>
              </motion.div>
            )}
          </div>

          {/* Main Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white border border-[#DCECF2] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* ========================================================= */}
              {/* SECTION 1: BASIC INFORMATION */}
              {/* ========================================================= */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#DCECF2]">
                  <div className="w-7 h-7 rounded-lg bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#0A192A]">
                      Basic Information
                    </h2>
                    <p className="text-[11px] text-[#5F7180]">
                      Your identity and primary point of contact on Wenture India.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Full Name / Entity Name *
                    </label>
                    <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                      Your personal name or legal investment firm name.
                    </p>
                    <input
                      id="field-investor-name"
                      type="text"
                      value={investorName}
                      onChange={(e) => setInvestorName(e.target.value)}
                      required
                      disabled={isPendingReview || saving}
                      placeholder="e.g. Rajesh Singhania / Singhania Capital"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Investor Type *
                    </label>
                    <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                      Categorize your investment vehicle or participation role.
                    </p>
                    <select
                      id="field-investor-type"
                      value={investorType}
                      onChange={(e) => setInvestorType(e.target.value as InvestorType)}
                      disabled={isPendingReview || saving}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                      {INVESTOR_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Base Location *
                    </label>
                    <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                      City, State, and Country where you are primarily based.
                    </p>
                    <input
                      id="field-location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      disabled={isPendingReview || saving}
                      placeholder="e.g. Mumbai, Maharashtra, India"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Contact Email
                    </label>
                    <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                      Direct contact email for platform communication &amp; notifications.
                    </p>
                    <input
                      id="field-contact-email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      disabled={isPendingReview || saving}
                      placeholder="e.g. rajesh@singhaniacapital.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Contact Phone (Optional)
                    </label>
                    <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                      Private phone for verified administrative communications.
                    </p>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      disabled={isPendingReview || saving}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      LinkedIn / Website (Optional)
                    </label>
                    <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                      Professional profile link or official fund website.
                    </p>
                    <input
                      type="url"
                      value={contactLinkedin}
                      onChange={(e) => setContactLinkedin(e.target.value)}
                      disabled={isPendingReview || saving}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECTION 2: INVESTMENT PREFERENCES */}
              {/* ========================================================= */}
              <div className="space-y-4 pt-4 border-t border-[#DCECF2]">
                <div className="flex items-center gap-2 pb-2 border-b border-[#DCECF2]">
                  <div className="w-7 h-7 rounded-lg bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#0A192A]">
                      Investment Preferences
                    </h2>
                    <p className="text-[11px] text-[#5F7180]">
                      Specify your deal parameters, ticket sizes and geographic focus.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Target Investment Range *
                    </label>
                    <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                      Overall ticket bracket you are actively deploying.
                    </p>
                    <select
                      value={investmentRange}
                      onChange={(e) => setInvestmentRange(e.target.value)}
                      disabled={isPendingReview || saving}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                      {INVESTOR_RANGES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Typical Investment Size (Optional)
                    </label>
                    <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                      Specific sweet-spot cheque size per business or syndicate.
                    </p>
                    <input
                      type="text"
                      value={typicalInvestmentSize}
                      onChange={(e) => setTypicalInvestmentSize(e.target.value)}
                      disabled={isPendingReview || saving}
                      placeholder="e.g. ₹25L – ₹40L per round"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Preferred Investment Stage *
                    </label>
                    <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                      Business lifecycle stages you prioritize.
                    </p>
                    <select
                      value={investmentStage}
                      onChange={(e) => setInvestmentStage(e.target.value)}
                      disabled={isPendingReview || saving}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
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
                      Preferred Locations / Regions (Optional)
                    </label>
                    <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                      Target cities, states, or Pan-India focus (comma-separated).
                    </p>
                    <input
                      type="text"
                      value={preferredLocationsText}
                      onChange={(e) => setPreferredLocationsText(e.target.value)}
                      disabled={isPendingReview || saving}
                      placeholder="e.g. Pan India, Maharashtra, Karnataka, NCR"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Preferred Sectors */}
                <div id="field-preferred-sectors">
                  <label className="block text-xs font-bold text-[#0A192A] mb-1">
                    Preferred Industry Sectors * {isPendingReview ? "(Locked during review)" : "(Click to select/deselect)"}
                  </label>
                  <p className="text-[11px] text-[#5F7180] mb-2 leading-snug">
                    Select the key industries where you look for opportunities.
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 p-3 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl max-h-48 overflow-y-auto">
                    {SECTORS.map((sec) => {
                      const isSelected = selectedSectors.includes(sec.name);
                      return (
                        <button
                          type="button"
                          key={sec.id}
                          onClick={() => toggleSector(sec.name)}
                          disabled={isPendingReview || saving}
                          className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all ${
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
              </div>

              {/* ========================================================= */}
              {/* SECTION 3: INVESTMENT BACKGROUND & PORTFOLIO */}
              {/* ========================================================= */}
              <div className="space-y-4 pt-4 border-t border-[#DCECF2]">
                <div className="flex items-center gap-2 pb-2 border-b border-[#DCECF2]">
                  <div className="w-7 h-7 rounded-lg bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#0A192A]">
                      Investment Background &amp; Portfolio
                    </h2>
                    <p className="text-[11px] text-[#5F7180]">
                      Highlight your track record, past investments and expertise.
                    </p>
                  </div>
                </div>

                {/* Short Introduction */}
                <div>
                  <label className="block text-xs font-bold text-[#0A192A] mb-1">
                    Short Introduction / Executive Summary *
                  </label>
                  <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                    Briefly state your core focus, criteria, and what you look for in potential founders.
                  </p>
                  <textarea
                    id="field-short-introduction"
                    rows={3}
                    value={shortIntroduction}
                    onChange={(e) => setShortIntroduction(e.target.value)}
                    required
                    disabled={isPendingReview || saving}
                    placeholder="e.g. Active angel investor with 10+ years backing B2B SaaS, D2C and healthcare ventures across India..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                  <div className="flex items-center justify-between text-[11px] mt-1 text-[#5F7180]">
                    <span>Minimum 20 characters required</span>
                    <span className={shortIntroduction.trim().length < 20 ? "text-amber-600 font-semibold" : "text-emerald-600 font-semibold"}>
                      {shortIntroduction.trim().length}/20 chars
                    </span>
                  </div>
                </div>

                {/* Investment Experience */}
                <div>
                  <label className="block text-xs font-bold text-[#0A192A] mb-1">
                    Investment Experience &amp; Track Record
                  </label>
                  <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                    Detail your experience in equity investment, syndicates, franchise funding, or angel networks.
                  </p>
                  <textarea
                    rows={3}
                    value={investmentExperience}
                    onChange={(e) => setInvestmentExperience(e.target.value)}
                    disabled={isPendingReview || saving}
                    placeholder="e.g. Participated in 12+ early-stage rounds; board observer in 3 scaling retail brands..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Previous Investments / Portfolio */}
                <div>
                  <label className="block text-xs font-bold text-[#0A192A] mb-1">
                    Previous Investments / Portfolio (Optional)
                  </label>
                  <p className="text-[11px] text-[#00658F] font-medium mb-1.5 leading-snug">
                    Optionally mention notable investments or sectors you have previously invested in. Please do not share confidential information.
                  </p>
                  <textarea
                    rows={3}
                    value={previousInvestments}
                    onChange={(e) => setPreviousInvestments(e.target.value)}
                    disabled={isPendingReview || saving}
                    placeholder="e.g. Seed investor in FinTech payment gateway (exited 2023), Series A co-investor in clean energy brand..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Professional / Business Background */}
                <div>
                  <label className="block text-xs font-bold text-[#0A192A] mb-1">
                    Professional / Business Background
                  </label>
                  <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                    Your executive, entrepreneurial or corporate leadership history.
                  </p>
                  <textarea
                    rows={3}
                    value={professionalBackground}
                    onChange={(e) => setProfessionalBackground(e.target.value)}
                    disabled={isPendingReview || saving}
                    placeholder="e.g. Former VP of Engineering at top tech firm, founder of healthcare logistics company..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Areas of Expertise */}
                <div>
                  <label className="block text-xs font-bold text-[#0A192A] mb-1">
                    Areas of Expertise &amp; Value Addition
                  </label>
                  <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                    Key domains where you add strategic value beyond capital (comma-separated).
                  </p>
                  <input
                    type="text"
                    value={areasOfExpertise}
                    onChange={(e) => setAreasOfExpertise(e.target.value)}
                    disabled={isPendingReview || saving}
                    placeholder="e.g. Market Expansion, Growth Strategy, Tech Architecture, Fundraising"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Profile Image / Avatar Section */}
                <div id="field-profile-avatar-container" className="space-y-3">
                  <FileUploadField
                    id="investor-profile-avatar"
                    label="Profile Avatar Image (Optional)"
                    description="Upload your personal or company avatar image (JPG, PNG, WebP up to 5MB)."
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    fileTypeLabel="Image"
                    icon="account_circle"
                    currentFile={avatarFile}
                    currentUrl={profileImage.startsWith("http") ? profileImage : undefined}
                    currentFileName={avatarFile?.name}
                    uploadStatus={avatarUploadStatus}
                    uploadProgressText="Uploading Avatar..."
                    errorMessage={avatarError}
                    onFileSelect={(file) => {
                      setAvatarFile(file);
                      setAvatarUploadStatus("selected");
                      setAvatarError(null);
                    }}
                    onUploadRetry={handleRetryAvatar}
                    onRemove={() => {
                      setAvatarFile(null);
                      setProfileImage("");
                      setAvatarUploadStatus("idle");
                      setAvatarError(null);
                    }}
                    onValidationError={(err) => {
                      setAvatarUploadStatus("error");
                      setAvatarError(err);
                    }}
                    disabled={isPendingReview || saving}
                  />

                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Or Direct Image URL (Optional)
                    </label>
                    <p className="text-[11px] text-[#5F7180] mb-1.5 leading-snug">
                      Alternative public image link for your directory avatar card.
                    </p>
                    <input
                      type="url"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      disabled={isPendingReview || saving}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] focus:outline-none focus:border-[#00A6E8] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Row */}
              <div className="pt-5 border-t border-[#DCECF2] space-y-4">
                {errorMsg && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">error</span>
                    <span className="font-semibold">{errorMsg}</span>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-[#5F7180] max-w-xl">
                    <span className="material-symbols-outlined text-[18px] text-[#00A6E8] shrink-0">visibility</span>
                    <span><strong>Profile Moderation:</strong> Your profile is reviewed by our administration team before publishing.</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                    <Link
                      href="/profile"
                      className="w-full sm:w-auto px-5 py-2.5 border border-[#DCECF2] hover:bg-slate-50 text-[#0A192A] text-xs font-bold rounded-xl transition-colors text-center"
                    >
                      Back to Profile
                    </Link>

                  {!isPendingReview ? (
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#00A6E8] hover:bg-[#0093CE] text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
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
                    <div className="w-full sm:w-auto px-5 py-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed select-none">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span>Under Administrative Review</span>
                    </div>
                  )}
                  </div>
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
