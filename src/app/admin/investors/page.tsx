"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  getAllInvestorsAdmin,
  approveInvestor,
  rejectInvestor,
  updateInvestorAdmin,
  deleteInvestor,
  InvestorProfile,
  InvestorStatus,
  InvestorType,
  INVESTOR_TYPES,
  INVESTOR_RANGES,
  INVESTMENT_STAGES,
} from "@/lib/firebase/investors";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminInvestorsPage() {
  const [investors, setInvestors] = useState<InvestorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<InvestorStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modals state
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorProfile | null>(null);
  const [rejectingInvestor, setRejectingInvestor] = useState<InvestorProfile | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [editingInvestor, setEditingInvestor] = useState<InvestorProfile | null>(null);

  const loadInvestors = async () => {
    setLoading(true);
    const res = await getAllInvestorsAdmin();
    if (!res.error) {
      setInvestors(res.investors);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInvestors();
  }, []);

  const handleApprove = async (uid: string) => {
    setActionLoading(uid);
    await approveInvestor(uid);
    setActionLoading(null);
    await loadInvestors();
    if (selectedInvestor?.id === uid) setSelectedInvestor(null);
  };

  const handleConfirmReject = async () => {
    if (!rejectingInvestor || !rejectReason.trim()) return;
    setActionLoading(rejectingInvestor.id);
    await rejectInvestor(rejectingInvestor.id, rejectReason.trim());
    setActionLoading(null);
    setRejectingInvestor(null);
    setRejectReason("");
    await loadInvestors();
    if (selectedInvestor?.id === rejectingInvestor.id) setSelectedInvestor(null);
  };

  const handleDelete = async (uid: string) => {
    if (!confirm("Are you sure you want to permanently delete this investor directory profile?")) return;
    setActionLoading(uid);
    await deleteInvestor(uid);
    setActionLoading(null);
    await loadInvestors();
    if (selectedInvestor?.id === uid) setSelectedInvestor(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvestor) return;

    setActionLoading(editingInvestor.id);
    await updateInvestorAdmin(editingInvestor.id, {
      investorName: editingInvestor.investorName,
      investorType: editingInvestor.investorType,
      location: editingInvestor.location,
      investmentRange: editingInvestor.investmentRange,
      investmentStage: editingInvestor.investmentStage,
      shortIntroduction: editingInvestor.shortIntroduction,
      experience: editingInvestor.experience,
    });
    setActionLoading(null);
    setEditingInvestor(null);
    await loadInvestors();
  };

  const filteredInvestors = useMemo(() => {
    return investors.filter((inv) => {
      if (statusFilter !== "all" && inv.status !== statusFilter) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = inv.investorName?.toLowerCase().includes(q);
        const matchType = inv.investorType?.toLowerCase().includes(q);
        const matchLoc = inv.location?.toLowerCase().includes(q);
        const matchSec = inv.preferredSectors?.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchType && !matchLoc && !matchSec) {
          return false;
        }
      }
      return true;
    });
  }, [investors, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
            Directory Moderation
          </span>
          <h1 className="text-3xl font-extrabold text-[#0A192A] tracking-tight font-heading">
            Investor Profiles
          </h1>
          <p className="text-sm text-[#5F7180] mt-1">
            Review, verify, edit, and approve capital partner profiles submitted to the public directory.
          </p>
        </div>

        <button
          type="button"
          onClick={loadInvestors}
          className="px-4 py-2 bg-white border border-[#DCECF2] hover:bg-slate-50 text-[#0A192A] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px] text-[#00A6E8]">refresh</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-[#DCECF2] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl w-full sm:w-auto overflow-x-auto">
          {(["all", "pending", "published", "rejected"] as const).map((tab) => {
            const active = statusFilter === tab;
            const count =
              tab === "all"
                ? investors.length
                : investors.filter((i) => i.status === tab).length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  active
                    ? "bg-[#00A6E8] text-white shadow-sm"
                    : "text-[#5F7180] hover:text-[#0A192A]"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, sector, location..."
            className="w-full pl-9 pr-4 py-2 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl text-xs text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#DCECF2] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-[#00A6E8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold">Loading investor directory queue...</p>
          </div>
        ) : filteredInvestors.length === 0 ? (
          <div className="p-12 text-center text-[#5F7180]">
            <span className="material-symbols-outlined text-[36px] text-slate-300 mb-2">inbox</span>
            <p className="text-sm font-bold text-[#0A192A]">No investor profiles found.</p>
            <p className="text-xs text-slate-400 mt-1">No profiles match the selected status filter or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4FAFD] border-b border-[#DCECF2] text-[#5F7180] uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Investor Name &amp; Location</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Investment Range</th>
                  <th className="py-3.5 px-4">Sectors &amp; Stage</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#0A192A]">
                {filteredInvestors.map((inv) => {
                  let badge = "bg-amber-50 text-amber-800 border-amber-200";
                  if (inv.status === "published") badge = "bg-emerald-50 text-emerald-800 border-emerald-200";
                  if (inv.status === "rejected") badge = "bg-rose-50 text-rose-800 border-rose-200";

                  return (
                    <tr key={inv.id} className="hover:bg-[#F6FAFF]/60 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-bold">
                        <div className="text-sm text-[#0A192A]">{inv.investorName}</div>
                        <div className="text-[11px] text-[#5F7180] font-normal flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[13px] text-[#00A6E8]">location_on</span>
                          <span>{inv.location}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                          {inv.investorType}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-semibold text-[#00658F]">
                        {inv.investmentRange}
                      </td>

                      <td className="py-4 px-4 text-[#5F7180]">
                        <div className="text-[11px] truncate max-w-xs font-medium text-[#0A192A]">
                          {inv.preferredSectors.join(", ")}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{inv.investmentStage}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${badge}`}>
                          {inv.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => setSelectedInvestor(inv)}
                            className="p-1.5 text-slate-500 hover:text-[#00A6E8] hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Full Profile"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => setEditingInvestor(inv)}
                            className="p-1.5 text-slate-500 hover:text-[#00A6E8] hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Investor Profile"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>

                          {/* Approve button */}
                          {inv.status !== "published" && (
                            <button
                              type="button"
                              disabled={actionLoading === inv.id}
                              onClick={() => handleApprove(inv.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">check</span>
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Reject button */}
                          {inv.status !== "rejected" && (
                            <button
                              type="button"
                              disabled={actionLoading === inv.id}
                              onClick={() => {
                                setRejectingInvestor(inv);
                                setRejectReason("");
                              }}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                              <span>Reject</span>
                            </button>
                          )}

                          {/* Delete button */}
                          <button
                            type="button"
                            disabled={actionLoading === inv.id}
                            onClick={() => handleDelete(inv.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Profile"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      <AnimatePresence>
        {selectedInvestor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvestor(null)}
              className="fixed inset-0 bg-[#0A192A]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl border border-[#DCECF2] shadow-2xl w-full max-w-2xl overflow-hidden z-10 my-8 p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-[#DCECF2]">
                <div>
                  <h2 className="text-xl font-bold text-[#0A192A] font-heading">
                    {selectedInvestor.investorName}
                  </h2>
                  <p className="text-xs text-[#5F7180] mt-0.5">
                    {selectedInvestor.investorType} • {selectedInvestor.location}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInvestor(null)}
                  className="p-1.5 text-slate-400 hover:text-[#0A192A] rounded-lg"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F4FAFD] rounded-xl border border-[#DCECF2]">
                  <div>
                    <span className="text-[#5F7180] block text-[10px] uppercase font-bold">Investment Range</span>
                    <span className="font-bold text-[#00658F] text-sm">{selectedInvestor.investmentRange}</span>
                  </div>
                  <div>
                    <span className="text-[#5F7180] block text-[10px] uppercase font-bold">Stage</span>
                    <span className="font-bold text-[#0A192A] text-sm">{selectedInvestor.investmentStage}</span>
                  </div>
                </div>

                <div>
                  <strong className="block text-[11px] uppercase font-bold text-[#5F7180] mb-1">Target Sectors:</strong>
                  <div className="flex flex-wrap gap-1">
                    {selectedInvestor.preferredSectors.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-slate-100 rounded text-[#0A192A] font-medium">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <strong className="block text-[11px] uppercase font-bold text-[#5F7180] mb-1">Areas of Expertise:</strong>
                  <div className="flex flex-wrap gap-1">
                    {selectedInvestor.areasOfExpertise.map((e) => (
                      <span key={e} className="px-2 py-0.5 bg-sky-50 text-sky-800 rounded font-medium">{e}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <strong className="block text-[11px] uppercase font-bold text-[#5F7180] mb-1">Introduction / Thesis:</strong>
                  <p className="text-[#0A192A] leading-relaxed whitespace-pre-line p-3 bg-slate-50 rounded-xl">
                    {selectedInvestor.shortIntroduction}
                  </p>
                </div>

                <div>
                  <strong className="block text-[11px] uppercase font-bold text-[#5F7180] mb-1">Detailed Experience:</strong>
                  <p className="text-[#0A192A] leading-relaxed whitespace-pre-line p-3 bg-slate-50 rounded-xl">
                    {selectedInvestor.experience || "None provided"}
                  </p>
                </div>

                {selectedInvestor.rejectionReason && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl">
                    <strong className="block text-[10px] uppercase font-bold">Rejection Reason:</strong>
                    <p className="mt-0.5">{selectedInvestor.rejectionReason}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#DCECF2] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvestor(null)}
                  className="px-4 py-2 border border-[#DCECF2] text-xs font-bold rounded-xl"
                >
                  Close
                </button>
                {selectedInvestor.status !== "published" && (
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedInvestor.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  >
                    Approve &amp; Publish
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectingInvestor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectingInvestor(null)}
              className="fixed inset-0 bg-[#0A192A]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl border border-[#DCECF2] shadow-2xl w-full max-w-md p-6 z-10"
            >
              <h3 className="text-lg font-bold text-[#0A192A] mb-2 font-heading">
                Reject Investor Profile
              </h3>
              <p className="text-xs text-[#5F7180] mb-4">
                Please provide a mandatory reason for rejecting this profile. The investor will see this feedback in their dashboard to make required edits.
              </p>

              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Please provide a more detailed professional introduction and specify your target sectors."
                className="w-full p-3 border border-[#DCECF2] rounded-xl text-xs focus:outline-none focus:border-[#00A6E8] resize-none mb-4"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingInvestor(null)}
                  className="px-4 py-2 border border-[#DCECF2] text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!rejectReason.trim()}
                  onClick={handleConfirmReject}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingInvestor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingInvestor(null)}
              className="fixed inset-0 bg-[#0A192A]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl border border-[#DCECF2] shadow-2xl w-full max-w-xl p-6 sm:p-8 z-10 my-8"
            >
              <h3 className="text-xl font-bold text-[#0A192A] mb-4 font-heading">
                Admin Edit: {editingInvestor.investorName}
              </h3>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#0A192A] mb-1">Investor Name</label>
                  <input
                    type="text"
                    value={editingInvestor.investorName}
                    onChange={(e) =>
                      setEditingInvestor({ ...editingInvestor, investorName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#DCECF2] rounded-xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#0A192A] mb-1">Investor Type</label>
                    <select
                      value={editingInvestor.investorType}
                      onChange={(e) =>
                        setEditingInvestor({
                          ...editingInvestor,
                          investorType: e.target.value as InvestorType,
                        })
                      }
                      className="w-full px-3 py-2 border border-[#DCECF2] rounded-xl"
                    >
                      {INVESTOR_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#0A192A] mb-1">Location</label>
                    <input
                      type="text"
                      value={editingInvestor.location}
                      onChange={(e) =>
                        setEditingInvestor({ ...editingInvestor, location: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#DCECF2] rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#0A192A] mb-1">Range</label>
                    <select
                      value={editingInvestor.investmentRange}
                      onChange={(e) =>
                        setEditingInvestor({ ...editingInvestor, investmentRange: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#DCECF2] rounded-xl"
                    >
                      {INVESTOR_RANGES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#0A192A] mb-1">Stage</label>
                    <select
                      value={editingInvestor.investmentStage}
                      onChange={(e) =>
                        setEditingInvestor({ ...editingInvestor, investmentStage: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#DCECF2] rounded-xl"
                    >
                      {INVESTMENT_STAGES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#0A192A] mb-1">Short Introduction</label>
                  <textarea
                    rows={3}
                    value={editingInvestor.shortIntroduction}
                    onChange={(e) =>
                      setEditingInvestor({ ...editingInvestor, shortIntroduction: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#DCECF2] rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCECF2]">
                  <button
                    type="button"
                    onClick={() => setEditingInvestor(null)}
                    className="px-4 py-2 border border-[#DCECF2] text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00A6E8] hover:bg-[#0093CE] text-white text-xs font-bold rounded-xl"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
