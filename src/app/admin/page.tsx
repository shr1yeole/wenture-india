"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAdminDashboardStats, AdminDashboardStats } from "@/lib/firebase/firestore";
import { getAllListings, approveListing, rejectListing, BusinessListing } from "@/lib/firebase/listings";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    totalEntrepreneurs: 0,
    totalInvestors: 0,
    pendingListings: 0,
    publishedListings: 0,
    rejectedListings: 0,
    totalEnquiries: 0,
  });

  const [pendingListings, setPendingListings] = useState<BusinessListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    const statsData = await getAdminDashboardStats();
    setStats(statsData);

    const listingsRes = await getAllListings("pending");
    if (!listingsRes.error) {
      setPendingListings(listingsRes.listings);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApprove = async (id?: string) => {
    if (!id) return;
    setActionLoading(id);
    await approveListing(id);
    setActionLoading(null);
    await loadDashboardData();
  };

  const handleReject = async (id?: string) => {
    if (!id) return;
    const reason = prompt("Enter the reason for rejection (required):");
    if (!reason || !reason.trim()) return;

    setActionLoading(id);
    await rejectListing(id, reason.trim());
    setActionLoading(null);
    await loadDashboardData();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
          Executive Overview
        </span>
        <h1 className="text-3xl font-extrabold text-[#0A192A] tracking-tight font-heading">
          Admin Dashboard
        </h1>
        <p className="text-sm text-[#5F7180] mt-1">
          Real-time institutional platform telemetry, user metrics, and pending approval queues.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Users */}
        <div className="bg-white border border-[#DCECF2] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#5F7180] uppercase tracking-wider">Total Users</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">group</span>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0A192A] font-heading">{stats.totalUsers}</div>
          <div className="text-[11px] text-[#5F7180] mt-1 flex gap-2">
            <span>Entrepreneurs: <strong className="text-[#0A192A]">{stats.totalEntrepreneurs}</strong></span>
            <span>•</span>
            <span>Investors: <strong className="text-[#0A192A]">{stats.totalInvestors}</strong></span>
          </div>
        </div>

        {/* Pending Listings */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-900 font-heading">{stats.pendingListings}</div>
          <p className="text-[11px] text-amber-700 mt-1">Requires admin approval</p>
        </div>

        {/* Published Listings */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Live Listings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-900 font-heading">{stats.publishedListings}</div>
          <p className="text-[11px] text-emerald-700 mt-1">Live on public catalog</p>
        </div>

        {/* Total Enquiries */}
        <div className="bg-white border border-[#DCECF2] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#5F7180] uppercase tracking-wider">Total Enquiries</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0A192A] font-heading">{stats.totalEnquiries}</div>
          <p className="text-[11px] text-[#5F7180] mt-1">Opportunity &amp; contact leads</p>
        </div>
      </div>

      {/* Pending Listings Review Queue */}
      <div className="bg-white border border-[#DCECF2] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#DCECF2]">
          <div>
            <h2 className="text-lg font-bold text-[#0A192A] font-heading flex items-center gap-2">
              <span>Pending Review Queue</span>
              {pendingListings.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                  {pendingListings.length}
                </span>
              )}
            </h2>
            <p className="text-xs text-[#5F7180] mt-0.5">
              Review submissions by entrepreneurs before publishing to the public opportunity ecosystem.
            </p>
          </div>

          <Link
            href="/admin/listings"
            className="text-xs font-bold text-[#00A6E8] hover:underline flex items-center gap-1"
          >
            <span>View All Listings</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-[#00A6E8] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading queue...</p>
          </div>
        ) : pendingListings.length === 0 ? (
          <div className="py-12 text-center text-[#5F7180]">
            <span className="material-symbols-outlined text-[36px] text-emerald-500 mb-2">task_alt</span>
            <p className="text-sm font-bold text-[#0A192A]">Queue is clear!</p>
            <p className="text-xs text-slate-400 mt-1">No entrepreneur listings are currently awaiting review.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingListings.map((item) => (
              <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold uppercase rounded">
                      Pending
                    </span>
                    <span className="text-xs font-bold text-[#00A6E8]">{item.listingType}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-[#5F7180]">{item.sector}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#0A192A]">{item.title}</h3>
                  <p className="text-xs text-[#5F7180] line-clamp-1">{item.shortDescription}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                    <span>By: <strong className="text-[#0A192A]">{item.ownerName}</strong> ({item.ownerEmail})</span>
                    <span>•</span>
                    <span>Range: <strong className="text-[#0A192A]">{item.investmentRange}</strong></span>
                    <span>•</span>
                    <span>Location: <strong className="text-[#0A192A]">{item.location}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={actionLoading === item.id}
                    onClick={() => handleApprove(item.id)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading === item.id}
                    onClick={() => handleReject(item.id)}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
