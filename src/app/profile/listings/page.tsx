"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  createListing,
  getUserListings,
  deleteListing,
  uploadListingImage,
  BusinessListing,
  ListingType,
} from "@/lib/firebase/listings";
import {
  OpportunityEnquiry,
  getEnquiriesForEntrepreneur,
  updateEnquiryStatus,
  EnquiryStatus,
} from "@/lib/firebase/firestore";
import { formatWhatsAppNumber } from "@/lib/constants/opportunities";
import { SECTORS } from "@/lib/constants/sectors";
import { motion, AnimatePresence } from "framer-motion";
import {
  InvestorContactModal,
  formatEnquiryWhatsAppText,
  formatEnquiryEmailSubject,
  formatEnquiryEmailBody,
} from "@/components/enquiries/investor-contact-modal";

const LISTING_TYPES: ListingType[] = [
  "Investment",
  "Business",
  "Franchise",
  "Dealership",
  "Partnership",
  "International",
  "EXIM",
];

const INVESTMENT_RANGES = [
  "₹1L – ₹5L",
  "₹5L – ₹10L",
  "₹10L – ₹25L",
  "₹25L – ₹50L",
  "₹50L – ₹1Cr",
  "₹1Cr+",
];

export default function EntrepreneurListingsPage() {
  const router = useRouter();
  const {
    user,
    profile,
    role,
    isEntrepreneur,
    isInvestor,
    hasBothRoles,
    isAdmin,
    loading,
    isAuthenticated,
  } = useAuth();

  const [listings, setListings] = useState<BusinessListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Tab & Enquiries state
  const [activeTab, setActiveTab] = useState<"listings" | "enquiries">("listings");
  const [enquiries, setEnquiries] = useState<OpportunityEnquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [updatingEnquiryId, setUpdatingEnquiryId] = useState<string | null>(null);
  const [selectedContactEnquiry, setSelectedContactEnquiry] = useState<OpportunityEnquiry | null>(null);

  // Form inputs
  const [title, setTitle] = useState("");
  const [listingType, setListingType] = useState<ListingType>("Investment");
  const [category, setCategory] = useState("Direct Business Opportunity");
  const [sector, setSector] = useState(SECTORS[0]?.name || "Technology & AI");
  const [location, setLocation] = useState("");
  const [investmentRange, setInvestmentRange] = useState(INVESTMENT_RANGES[2]);
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch listings
  const loadUserListings = useCallback(async () => {
    setLoadingListings(true);
    const res = await getUserListings();
    if (!res.error) {
      setListings(res.listings);
    }
    setLoadingListings(false);
  }, []);

  // Fetch enquiries received for this entrepreneur's opportunities
  const loadEnquiries = useCallback(async () => {
    if (!user?.uid) return;
    setLoadingEnquiries(true);
    const res = await getEnquiriesForEntrepreneur(user.uid, user.email);
    if (!res.error) {
      setEnquiries(res.enquiries);
    }
    setLoadingEnquiries(false);
  }, [user?.uid, user?.email]);

  const handleEnquiryStatusUpdate = async (enquiryId?: string, newStatus?: EnquiryStatus) => {
    if (!enquiryId || !newStatus) return;
    setUpdatingEnquiryId(enquiryId);
    await updateEnquiryStatus("opportunity_enquiries", enquiryId, newStatus);
    setEnquiries((prev) =>
      prev.map((item) => (item.id === enquiryId ? { ...item, status: newStatus } : item))
    );
    setUpdatingEnquiryId(null);
  };

  const formatEnquiryDate = (createdAt: unknown) => {
    if (!createdAt) return "Recent";
    if (typeof createdAt === "object" && "seconds" in (createdAt as { seconds: number })) {
      return new Date((createdAt as { seconds: number }).seconds * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return "Recent";
  };

  // User is restricted if their role is Investor (and not dual-role) OR if they are not an entrepreneur and not admin
  const isInvestorOnly =
    (role === "investor" && !hasBothRoles) ||
    (isInvestor && !isEntrepreneur && !hasBothRoles) ||
    (profile?.role === "investor" && !hasBothRoles);

  const isRestricted =
    !loading &&
    isAuthenticated &&
    (isInvestorOnly || (!isEntrepreneur && role !== "entrepreneur" && !isAdmin));

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/profile/listings");
      } else if (!isRestricted && (isEntrepreneur || hasBothRoles || role === "entrepreneur" || isAdmin)) {
        loadUserListings();
        loadEnquiries();
        if (user?.email) {
          setContactEmail(user.email);
        }
      }
    }
  }, [
    loading,
    isAuthenticated,
    isRestricted,
    isEntrepreneur,
    hasBothRoles,
    role,
    isAdmin,
    router,
    user,
    loadUserListings,
    loadEnquiries,
  ]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!title.trim()) {
      setFormError("Business / Opportunity Name is required.");
      return;
    }
    if (!location.trim()) {
      setFormError("Location is required.");
      return;
    }
    if (!shortDescription.trim()) {
      setFormError("Short summary is required.");
      return;
    }
    if (!description.trim()) {
      setFormError("Full detailed description is required.");
      return;
    }
    if (!contactPhone.trim() || !contactEmail.trim()) {
      setFormError("Both contact phone and contact email are required.");
      return;
    }

    setSubmitting(true);

    let finalImages: string[] = [];
    if (imageUrl.trim()) {
      finalImages.push(imageUrl.trim());
    }

    if (imageFile) {
      setUploadingImage(true);
      const uploadRes = await uploadListingImage(imageFile, `temp_${Date.now()}`);
      setUploadingImage(false);
      if (uploadRes.url) {
        finalImages.unshift(uploadRes.url);
      }
    }

    if (finalImages.length === 0) {
      finalImages.push("/images/opp-default.jpg");
    }

    const res = await createListing({
      title: title.trim(),
      listingType,
      category: category.trim(),
      sector: sector.trim(),
      location: location.trim(),
      investmentRange,
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
      images: finalImages,
    });

    setSubmitting(false);

    if (res.error) {
      setFormError(res.error);
    } else {
      setFormSuccess("Opportunity submitted successfully! Status is Pending Admin Review.");
      // Reset form
      setTitle("");
      setShortDescription("");
      setDescription("");
      setLocation("");
      setImageUrl("");
      setImageFile(null);
      await loadUserListings();
      setTimeout(() => {
        setShowCreateModal(false);
        setFormSuccess(null);
      }, 1800);
    }
  };

  const handleDeleteListing = async (listingId?: string) => {
    if (!listingId) return;
    if (!confirm("Are you sure you want to remove this listing?")) return;
    const res = await deleteListing(listingId);
    if (!res.error) {
      loadUserListings();
    } else {
      alert("Failed to delete: " + res.error);
    }
  };

  // If user is signed in as an Investor (or non-entrepreneur), block access and prompt to sign up/in as Entrepreneur
  if (isRestricted) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6FAFF]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-16 px-5 sm:px-8">
          <div className="max-w-lg w-full bg-white border border-[#DCECF2] rounded-3xl p-8 sm:p-10 shadow-[0_16px_40px_rgba(10,25,42,0.06)] text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#00A6E8]/20">
              <span className="material-symbols-outlined text-[32px]">rocket_launch</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold mb-3">
              <span className="material-symbols-outlined text-[15px] text-amber-600">lock</span>
              <span>Entrepreneur Account Required</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A192A] mb-3 font-heading tracking-tight">
              List Your Venture Access Restricted
            </h1>

            <p className="text-sm text-[#5F7180] leading-relaxed mb-8">
              You are currently signed in as an <strong>Investor</strong>. Listing a business venture, franchise, or commercial opportunity to seek capital is reserved exclusively for registered Entrepreneurs. To list your venture and connect with investors, please sign up or sign in with an Entrepreneur account.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/signup/entrepreneur"
                className="w-full py-3.5 px-6 rounded-xl bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>Sign Up as Entrepreneur</span>
              </Link>

              <Link
                href="/login/entrepreneur"
                className="w-full py-3 px-6 rounded-xl bg-white border border-[#DCECF2] hover:bg-[#F4FAFD] text-[#00658F] font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                <span>Sign In with Existing Entrepreneur Account</span>
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

  if (loading || (!isAuthenticated && loadingListings)) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6FAFF]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#00A6E8] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#5F7180] font-medium">Loading listings dashboard...</p>
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
        <div className="w-full max-w-[1140px] mx-auto px-5 sm:px-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5F7180] mb-6">
            <Link href="/profile" className="hover:text-[#00A6E8] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Profile</span>
            </Link>
            <span>/</span>
            <span className="text-[#0A192A]">Business &amp; Opportunity Listings</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
                Entrepreneur Workspace
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A192A] tracking-tight font-heading">
                My Business Listings
              </h1>
              <p className="text-sm sm:text-base text-[#5F7180] mt-1">
                Manage your business opportunities and track their review status on Wenturex.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setFormError(null);
                setFormSuccess(null);
                setShowCreateModal(true);
              }}
              className="px-5 py-3 rounded-xl bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#00A6E8]/20 flex items-center gap-2 self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Create New Listing</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-white border border-[#DCECF2] rounded-2xl mb-8 shadow-sm overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("listings")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "listings"
                  ? "bg-[#00A6E8] text-white shadow-sm"
                  : "text-[#5F7180] hover:text-[#0A192A] hover:bg-[#F6FAFF]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span>My Listings ({listings.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("enquiries");
                loadEnquiries();
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "enquiries"
                  ? "bg-[#00A6E8] text-white shadow-sm"
                  : "text-[#5F7180] hover:text-[#0A192A] hover:bg-[#F6FAFF]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">mark_email_unread</span>
              <span>Interest Received ({enquiries.length})</span>
              {enquiries.filter((e) => (e.status || "").toLowerCase() === "new").length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>

          {activeTab === "enquiries" ? (
            <div>
              {/* Info banner */}
              <div className="bg-[#EBF6FC] border border-[#DCECF2] rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3 text-xs sm:text-sm text-[#00658F]">
                <span className="material-symbols-outlined text-[20px] text-[#00A6E8] shrink-0 mt-0.5">
                  forum
                </span>
                <div className="leading-relaxed">
                  <strong>Direct Inbound Channel:</strong> Below are all enquiries sent directly to you by verified investors and fellow entrepreneurs who clicked &ldquo;I&apos;m Interested&rdquo; on your opportunities. Connect directly with them without middlemen.
                </div>
              </div>

              {loadingEnquiries ? (
                <div className="bg-white border border-[#DCECF2] rounded-2xl p-12 text-center text-[#5F7180]">
                  <div className="w-8 h-8 border-3 border-[#00A6E8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm">Fetching enquiries received for your opportunities...</p>
                </div>
              ) : enquiries.length === 0 ? (
                <div className="bg-white border border-[#DCECF2] rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-[#F4FAFD] text-[#00A6E8] flex items-center justify-center mx-auto mb-4 border border-[#DCECF2]">
                    <span className="material-symbols-outlined text-[32px]">inbox</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0A192A] mb-2 font-heading">
                    No Enquiries Received Yet
                  </h3>
                  <p className="text-sm text-[#5F7180] max-w-md mx-auto leading-relaxed">
                    When investors or entrepreneurs click &ldquo;I&apos;m Interested&rdquo; on your opportunities, their profile details, message, and direct contact options will appear here immediately.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {enquiries.map((enq) => {
                    const normStatus = (enq.status || "New").toLowerCase();
                    let statusBg = "bg-blue-50 text-blue-700 border-blue-200";
                    if (normStatus === "contacted") {
                      statusBg = "bg-amber-50 text-amber-700 border-amber-200";
                    } else if (normStatus === "in discussion") {
                      statusBg = "bg-purple-50 text-purple-700 border-purple-200";
                    } else if (normStatus === "closed") {
                      statusBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
                    }

                    const senderPhone = enq.senderPhone || enq.phone || "";
                    const senderEmail = enq.senderEmail || enq.email || "";
                    const senderWaUrl = senderPhone
                      ? `https://wa.me/${formatWhatsAppNumber(senderPhone)}?text=${encodeURIComponent(
                          formatEnquiryWhatsAppText(enq)
                        )}`
                      : "";
                    const senderMailtoUrl = senderEmail
                      ? `mailto:${senderEmail}?subject=${encodeURIComponent(
                          formatEnquiryEmailSubject(enq)
                        )}&body=${encodeURIComponent(
                          formatEnquiryEmailBody(
                            enq,
                            profile?.fullName || profile?.name || user?.displayName || "Entrepreneur"
                          )
                        )}`
                      : "";

                    return (
                      <motion.div
                        key={enq.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-[#DCECF2] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(10,25,42,0.03)] hover:shadow-md transition-shadow"
                      >
                        {/* Header Row */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#DCECF2]">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className="px-2.5 py-1 bg-[#EBF6FC] text-[#00A6E8] text-[11px] font-bold rounded-md">
                                Opportunity: {enq.opportunityTitle}
                              </span>
                              <span
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold border uppercase tracking-wider ${statusBg}`}
                              >
                                {enq.status || "New"}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-[#0A192A] font-heading flex items-center gap-2">
                              <span>{enq.senderName || enq.name}</span>
                              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded">
                                {enq.senderRole || "Investor"}
                              </span>
                            </h3>
                          </div>

                          {/* Status Updater */}
                          <div className="flex items-center gap-3 self-start lg:self-auto">
                            <span className="text-xs font-semibold text-[#5F7180]">Enquiry Status:</span>
                            <select
                              value={
                                normStatus === "contacted"
                                  ? "Contacted"
                                  : normStatus === "in discussion"
                                  ? "In Discussion"
                                  : normStatus === "closed"
                                  ? "Closed"
                                  : "New"
                              }
                              disabled={updatingEnquiryId === enq.id}
                              onChange={(e) =>
                                handleEnquiryStatusUpdate(enq.id, e.target.value as EnquiryStatus)
                              }
                              className="text-xs font-bold border border-[#DCECF2] rounded-xl px-3 py-2 bg-white text-[#0A192A] focus:outline-none focus:border-[#00A6E8] cursor-pointer"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="In Discussion">In Discussion</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 border-b border-[#DCECF2] text-xs">
                          <div>
                            <span className="text-[#5F7180] block mb-0.5">Profile / Type:</span>
                            <span className="font-bold text-[#0A192A]">{enq.senderType || "Direct Investor"}</span>
                          </div>
                          <div>
                            <span className="text-[#5F7180] block mb-0.5">Phone Number:</span>
                            <span className="font-bold text-[#0A192A]">{senderPhone || "Not provided"}</span>
                          </div>
                          <div>
                            <span className="text-[#5F7180] block mb-0.5">Email Address:</span>
                            <span className="font-bold text-[#0A192A] truncate block" title={senderEmail}>
                              {senderEmail || "Not provided"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#5F7180] block mb-0.5">Location:</span>
                            <span className="font-bold text-[#0A192A]">{enq.senderLocation || "India"}</span>
                          </div>
                          <div>
                            <span className="text-[#5F7180] block mb-0.5">Investment Range:</span>
                            <span className="font-bold text-emerald-700">
                              {enq.investmentRange || enq.investmentCapacity || "Flexible"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#5F7180] block mb-0.5">Received Date:</span>
                            <span className="font-bold text-[#0A192A]">{formatEnquiryDate(enq.createdAt)}</span>
                          </div>
                        </div>

                        {/* Message */}
                        <div className="py-4">
                          <span className="text-xs font-bold text-[#5F7180] block mb-1.5 uppercase tracking-wider">
                            Enquiry Message:
                          </span>
                          <div className="p-3.5 bg-[#F8FAFD] border border-[#DCECF2] rounded-xl text-xs sm:text-sm text-[#0A192A] leading-relaxed">
                            {enq.message || "I am interested in learning more about this opportunity."}
                          </div>
                        </div>

                        {/* Direct Contact Actions */}
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          {/* View Full Investor Details Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedContactEnquiry(enq)}
                            className="px-4 py-2 bg-[#EBF6FC] hover:bg-[#DCECF2] text-[#00658F] font-bold text-xs rounded-xl border border-[#DCECF2] transition-colors flex items-center gap-1.5 shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-[16px]">badge</span>
                            <span>Investor Details</span>
                          </button>

                          {/* WhatsApp */}
                          {senderWaUrl ? (
                            <a
                              href={senderWaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                            >
                              <span className="material-symbols-outlined text-[16px]">chat</span>
                              <span>Chat on WhatsApp ({senderPhone})</span>
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedContactEnquiry(enq)}
                              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                            >
                              <span className="material-symbols-outlined text-[16px]">chat</span>
                              <span>WhatsApp</span>
                            </button>
                          )}

                          {/* Email */}
                          {senderMailtoUrl ? (
                            <a
                              href={senderMailtoUrl}
                              className="px-4 py-2 bg-[#F4FAFD] hover:bg-[#EBF6FC] text-[#00658F] font-bold text-xs rounded-xl border border-[#DCECF2] transition-colors flex items-center gap-1.5 shadow-2xs"
                            >
                              <span className="material-symbols-outlined text-[16px]">mail</span>
                              <span>Reply via Email ({senderEmail})</span>
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedContactEnquiry(enq)}
                              className="px-4 py-2 bg-[#F4FAFD] hover:bg-[#EBF6FC] text-[#00658F] font-bold text-xs rounded-xl border border-[#DCECF2] transition-colors flex items-center gap-1.5 shadow-2xs"
                            >
                              <span className="material-symbols-outlined text-[16px]">mail</span>
                              <span>Email</span>
                            </button>
                          )}

                          {/* Call */}
                          <button
                            type="button"
                            onClick={() => setSelectedContactEnquiry(enq)}
                            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-[16px]">call</span>
                            <span>Call {senderPhone ? `(${senderPhone})` : ""}</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Notice banner */}
              <div className="bg-[#EBF6FC] border border-[#DCECF2] rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3 text-xs sm:text-sm text-[#00658F]">
                <span className="material-symbols-outlined text-[20px] text-[#00A6E8] shrink-0 mt-0.5">
                  verified
                </span>
                <div className="leading-relaxed">
                  <strong>Quality &amp; Review Policy:</strong> All business opportunities submitted on Wenturex are verified by our institutional review team. New submissions start with a <span className="font-bold">Pending</span> status and become public immediately upon approval.
                </div>
              </div>

              {/* Listings Container */}
              {loadingListings ? (
                <div className="bg-white border border-[#DCECF2] rounded-2xl p-12 text-center text-[#5F7180]">
                  <div className="w-8 h-8 border-3 border-[#00A6E8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm">Fetching your listings from database...</p>
                </div>
              ) : listings.length === 0 ? (
                <div className="bg-white border border-[#DCECF2] rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-[#F4FAFD] text-[#00A6E8] flex items-center justify-center mx-auto mb-4 border border-[#DCECF2]">
                    <span className="material-symbols-outlined text-[32px]">storefront</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0A192A] mb-2 font-heading">
                    No Business Listings Found
                  </h3>
                  <p className="text-sm text-[#5F7180] max-w-md mx-auto mb-6 leading-relaxed">
                    You haven&apos;t published or submitted any business opportunities yet. Click below to introduce your venture to investors and partners.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 rounded-xl bg-[#00A6E8] hover:bg-[#0093CE] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#00A6E8]/20 inline-flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>Submit Your First Opportunity</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {listings.map((item) => {
                    let badgeColor = "bg-amber-50 text-amber-800 border-amber-200";
                    let statusLabel = "Pending Review";
                    if (item.status === "published") {
                      badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
                      statusLabel = "Published & Live";
                    } else if (item.status === "rejected") {
                      badgeColor = "bg-rose-50 text-rose-800 border-rose-200";
                      statusLabel = "Needs Revision";
                    }

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-[#DCECF2] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(10,25,42,0.03)] hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#DCECF2]">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider border ${badgeColor}`}>
                                {statusLabel}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#F4FAFD] text-[#00658F] border border-[#DCECF2]">
                                {item.listingType}
                              </span>
                              <span className="text-xs text-[#5F7180]">
                                Sector: <strong className="text-[#0A192A]">{item.sector}</strong>
                              </span>
                            </div>
                            <h2 className="text-xl font-bold text-[#0A192A] font-heading">
                              {item.title}
                            </h2>
                          </div>

                          <div className="flex items-center gap-3">
                            {item.status === "published" && item.id && (
                              <Link
                                href={`/opportunities/${item.id}`}
                                target="_blank"
                                className="px-4 py-2 rounded-xl bg-[#F4FAFD] hover:bg-[#EBF6FC] text-[#00658F] border border-[#DCECF2] text-xs font-bold transition-colors flex items-center gap-1.5"
                              >
                                <span>View Public Page</span>
                                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                              </Link>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteListing(item.id)}
                              className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>

                        <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          <div className="md:col-span-8">
                            <p className="text-xs sm:text-sm text-[#5F7180] leading-relaxed mb-4">
                              {item.shortDescription}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-[#5F7180]">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-[#00A6E8]">location_on</span>
                                {item.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-[#00A6E8]">payments</span>
                                {item.investmentRange}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-[#00A6E8]">phone</span>
                                {item.contactPhone}
                              </span>
                            </div>
                          </div>

                          {/* Rejection notice if applicable */}
                          {item.status === "rejected" && item.rejectionReason && (
                            <div className="md:col-span-12 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 mt-2">
                              <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">info</span>
                              <div>
                                <strong>Review Feedback:</strong> {item.rejectionReason}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ============================================================ */}
      {/* CREATE NEW LISTING MODAL */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-white border border-[#DCECF2] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#DCECF2] mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#0A192A] font-heading">
                    Create Business / Opportunity Listing
                  </h3>
                  <p className="text-xs text-[#5F7180] mt-0.5">
                    Submit your enterprise opportunity for review and public publication.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>

              {formError && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-red-500">error</span>
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="space-y-5">
                {/* 1. Name & Listing Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Business / Opportunity Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Apex EV Fast-Charging Hubs"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs text-[#0A192A] focus:outline-none focus:border-[#00A6E8] focus:ring-1 focus:ring-[#00A6E8]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Listing Type *
                    </label>
                    <select
                      value={listingType}
                      onChange={(e) => setListingType(e.target.value as ListingType)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
                    >
                      {LISTING_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Category & Sector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Business Category *
                    </label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. CleanTech & Energy Storage"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Sector *
                    </label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
                    >
                      {SECTORS.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Location & Investment Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Location / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Pune & Mumbai, Maharashtra"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Investment Range *
                    </label>
                    <select
                      value={investmentRange}
                      onChange={(e) => setInvestmentRange(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
                    >
                      {INVESTMENT_RANGES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Short Description */}
                <div>
                  <label className="block text-xs font-bold text-[#0A192A] mb-1">
                    Executive Summary / Short Description * (1-2 sentences)
                  </label>
                  <input
                    type="text"
                    required
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief 1-sentence teaser of this business opportunity"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
                  />
                </div>

                {/* 5. Full Description */}
                <div>
                  <label className="block text-xs font-bold text-[#0A192A] mb-1">
                    Full Description &amp; Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed explanation of the business model, current traction, expansion roadmap, and investment use of funds..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
                  />
                </div>

                {/* 6. Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98418 1008"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="business@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
                    />
                  </div>
                </div>

                {/* 7. Image Upload or Image URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Upload Image (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#DCECF2] rounded-xl text-xs text-[#5F7180] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#00A6E8] file:text-white hover:file:bg-[#0093CE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A192A] mb-1">
                      Or Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DCECF2] rounded-xl text-xs text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DCECF2]">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#DCECF2] text-xs font-bold text-[#5F7180] hover:text-[#0A192A] hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploadingImage}
                    className="px-6 py-2.5 rounded-xl bg-[#00A6E8] hover:bg-[#0093CE] text-white text-xs font-bold transition-all shadow-md shadow-[#00A6E8]/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting || uploadingImage ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting for Review...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">send</span>
                        <span>Submit Listing for Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Investor Contact & Details Modal */}
      <InvestorContactModal
        enquiry={selectedContactEnquiry}
        isOpen={!!selectedContactEnquiry}
        onClose={() => setSelectedContactEnquiry(null)}
        onStatusUpdate={handleEnquiryStatusUpdate}
        entrepreneurName={profile?.fullName || profile?.name || user?.displayName || "Entrepreneur"}
      />

      <Footer />
    </div>
  );
}
