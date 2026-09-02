"use client";

import React, { useState, useEffect } from "react";
import {
  getAllOpportunityEnquiries,
  getAllContactInquiries,
  updateEnquiryStatus,
  OpportunityEnquiry,
  ContactSubmission,
  EnquiryStatus,
} from "@/lib/firebase/firestore";

type EnquiryTab = "opportunity" | "contact";

export default function AdminEnquiriesPage() {
  const [activeTab, setActiveTab] = useState<EnquiryTab>("opportunity");
  const [oppEnquiries, setOppEnquiries] = useState<OpportunityEnquiry[]>([]);
  const [contactInquiries, setContactInquiries] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filter States for Opportunity Enquiries
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedOwner, setSelectedOwner] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [dateSort, setDateSort] = useState<"newest" | "oldest">("newest");

  const loadEnquiries = async () => {
    setLoading(true);
    const oppRes = await getAllOpportunityEnquiries();
    if (!oppRes.error) {
      setOppEnquiries(oppRes.enquiries);
    }
    const contactRes = await getAllContactInquiries();
    if (!contactRes.error) {
      setContactInquiries(contactRes.inquiries);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatusChange = async (
    collection: "opportunity_enquiries" | "contact_inquiries",
    id?: string,
    newStatus?: EnquiryStatus
  ) => {
    if (!id || !newStatus) return;
    setUpdatingId(id);
    await updateEnquiryStatus(collection, id, newStatus);
    setUpdatingId(null);
    await loadEnquiries();
  };

  const formatDate = (createdAt: unknown) => {
    if (!createdAt) return "—";
    if (typeof createdAt === "object" && "seconds" in (createdAt as { seconds: number })) {
      return new Date((createdAt as { seconds: number }).seconds * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return "—";
  };

  // Derive unique options for filters
  const uniqueOpportunities = Array.from(
    new Set(oppEnquiries.map((e) => e.opportunityTitle).filter(Boolean))
  );

  const uniqueOwners = Array.from(
    new Set(
      oppEnquiries
        .map((e) => e.opportunityOwnerName || e.opportunityOwnerId || "Platform")
        .filter(Boolean)
    )
  );

  const filteredOppEnquiries = oppEnquiries
    .filter((enq) => {
      if (selectedOpportunity !== "all" && enq.opportunityTitle !== selectedOpportunity) {
        return false;
      }
      if (selectedRole !== "all") {
        const enqRole = (enq.senderRole || enq.role || "").toLowerCase();
        if (enqRole !== selectedRole.toLowerCase()) {
          return false;
        }
      }
      if (selectedOwner !== "all") {
        const ownerVal = enq.opportunityOwnerName || enq.opportunityOwnerId || "Platform";
        if (ownerVal !== selectedOwner) {
          return false;
        }
      }
      if (selectedStatus !== "all") {
        const enqStatus = (enq.status || "new").toLowerCase();
        if (enqStatus !== selectedStatus.toLowerCase()) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const timeA = (a.createdAt as { seconds?: number })?.seconds || 0;
      const timeB = (b.createdAt as { seconds?: number })?.seconds || 0;
      return dateSort === "newest" ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
            Inbound Communications
          </span>
          <h1 className="text-3xl font-extrabold text-[#0A192A] tracking-tight font-heading">
            Enquiry Management
          </h1>
          <p className="text-sm text-[#5F7180] mt-1">
            Monitor decentralized investor-to-entrepreneur interest routing and general platform contacts.
          </p>
        </div>

        <button
          type="button"
          onClick={loadEnquiries}
          className="px-4 py-2 bg-white border border-[#DCECF2] hover:bg-slate-50 text-[#0A192A] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px] text-[#00A6E8]">refresh</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-[#DCECF2] rounded-2xl overflow-x-auto shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("opportunity")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "opportunity"
              ? "bg-[#00A6E8] text-white shadow-sm"
              : "text-[#5F7180] hover:text-[#0A192A] hover:bg-[#F6FAFF]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">handshake</span>
          <span>Opportunity Enquiries ({oppEnquiries.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "contact"
              ? "bg-[#00A6E8] text-white shadow-sm"
              : "text-[#5F7180] hover:text-[#0A192A] hover:bg-[#F6FAFF]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">mail</span>
          <span>General Contact ({contactInquiries.length})</span>
        </button>
      </div>

      {/* Multi-Criteria Filters for Opportunity Enquiries */}
      {activeTab === "opportunity" && !loading && oppEnquiries.length > 0 && (
        <div className="bg-white border border-[#DCECF2] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A192A] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#00A6E8]">tune</span>
              <span>Filter Enquiries ({filteredOppEnquiries.length} shown)</span>
            </span>

            {(selectedOpportunity !== "all" ||
              selectedRole !== "all" ||
              selectedOwner !== "all" ||
              selectedStatus !== "all" ||
              dateSort !== "newest") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedOpportunity("all");
                  setSelectedRole("all");
                  setSelectedOwner("all");
                  setSelectedStatus("all");
                  setDateSort("newest");
                }}
                className="text-xs text-[#00A6E8] hover:underline font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Filter by Opportunity */}
            <div>
              <label className="block text-[11px] font-bold text-[#5F7180] mb-1">Opportunity</label>
              <select
                value={selectedOpportunity}
                onChange={(e) => setSelectedOpportunity(e.target.value)}
                className="w-full text-xs font-medium border border-[#DCECF2] rounded-xl px-2.5 py-2 bg-white text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
              >
                <option value="all">All Opportunities</option>
                {uniqueOpportunities.map((op, idx) => (
                  <option key={idx} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Sender Role */}
            <div>
              <label className="block text-[11px] font-bold text-[#5F7180] mb-1">Sender Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full text-xs font-medium border border-[#DCECF2] rounded-xl px-2.5 py-2 bg-white text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
              >
                <option value="all">All Roles</option>
                <option value="investor">Investor</option>
                <option value="entrepreneur">Entrepreneur</option>
              </select>
            </div>

            {/* Filter by Entrepreneur / Owner */}
            <div>
              <label className="block text-[11px] font-bold text-[#5F7180] mb-1">Opportunity Owner</label>
              <select
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
                className="w-full text-xs font-medium border border-[#DCECF2] rounded-xl px-2.5 py-2 bg-white text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
              >
                <option value="all">All Owners</option>
                {uniqueOwners.map((own, idx) => (
                  <option key={idx} value={own}>
                    {own}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div>
              <label className="block text-[11px] font-bold text-[#5F7180] mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs font-medium border border-[#DCECF2] rounded-xl px-2.5 py-2 bg-white text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="in discussion">In Discussion</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Sort by Date */}
            <div>
              <label className="block text-[11px] font-bold text-[#5F7180] mb-1">Date Order</label>
              <select
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value as "newest" | "oldest")}
                className="w-full text-xs font-medium border border-[#DCECF2] rounded-xl px-2.5 py-2 bg-white text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Enquiries Container */}
      <div className="bg-white border border-[#DCECF2] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-[#00A6E8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold">Loading submissions...</p>
          </div>
        ) : activeTab === "opportunity" ? (
          filteredOppEnquiries.length === 0 ? (
            <div className="p-12 text-center text-[#5F7180]">
              <span className="material-symbols-outlined text-[36px] text-slate-300 mb-2">inbox</span>
              <p className="text-sm font-bold text-[#0A192A]">
                {oppEnquiries.length === 0 ? "No opportunity enquiries recorded yet." : "No enquiries match your filter criteria."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4FAFD] border-b border-[#DCECF2] text-[#5F7180] uppercase tracking-wider font-extrabold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Opportunity &amp; Owner</th>
                    <th className="py-3.5 px-4">Sender</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Capacity / Location</th>
                    <th className="py-3.5 px-4">Message</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 sm:px-6">Status / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#0A192A]">
                  {filteredOppEnquiries.map((enq) => {
                    const normStatus = (enq.status || "New").toLowerCase();
                    const statusVal =
                      normStatus === "contacted"
                        ? "Contacted"
                        : normStatus === "in discussion"
                        ? "In Discussion"
                        : normStatus === "closed"
                        ? "Closed"
                        : "New";

                    let statusClass = "bg-blue-50 text-blue-700 border-blue-200";
                    if (statusVal === "Contacted") statusClass = "bg-amber-50 text-amber-700 border-amber-200";
                    if (statusVal === "In Discussion") statusClass = "bg-purple-50 text-purple-700 border-purple-200";
                    if (statusVal === "Closed") statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200";

                    return (
                      <tr key={enq.id} className="hover:bg-[#F6FAFF]/60 transition-colors">
                        <td className="py-4 px-4 sm:px-6 font-bold max-w-xs">
                          <span className="text-sm text-[#0A192A] block">{enq.opportunityTitle}</span>
                          <span className="text-[11px] text-[#00658F] font-medium block mt-0.5">
                            Owner: {enq.opportunityOwnerName || enq.opportunityOwnerId || "Platform Desk"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-[#0A192A] block">{enq.senderName || enq.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded inline-block mt-0.5">
                            {enq.senderRole || enq.role || "Investor"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-[#5F7180]">
                          <div className="font-medium text-[#0A192A]">{enq.senderEmail || enq.email}</div>
                          <div>{enq.senderPhone || enq.phone}</div>
                        </td>
                        <td className="py-4 px-4 text-[#5F7180]">
                          <div className="font-semibold text-[#00658F]">
                            {enq.investmentRange || enq.investmentCapacity || "Flexible"}
                          </div>
                          <div className="text-[11px]">{enq.senderLocation || enq.senderType || "India"}</div>
                        </td>
                        <td className="py-4 px-4 max-w-xs text-[#5F7180]">
                          <p className="line-clamp-2 leading-relaxed">{enq.message}</p>
                        </td>
                        <td className="py-4 px-4 text-[#5F7180] whitespace-nowrap">
                          {formatDate(enq.createdAt)}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <select
                            value={statusVal}
                            disabled={updatingId === enq.id}
                            onChange={(e) =>
                              handleStatusChange(
                                "opportunity_enquiries",
                                enq.id,
                                e.target.value as EnquiryStatus
                              )
                            }
                            className={`px-2.5 py-1.5 text-xs font-bold rounded-xl border focus:outline-none cursor-pointer ${statusClass}`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          contactInquiries.length === 0 ? (
            <div className="p-12 text-center text-[#5F7180]">
              <span className="material-symbols-outlined text-[36px] text-slate-300 mb-2">inbox</span>
              <p className="text-sm font-bold text-[#0A192A]">No general contact messages recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4FAFD] border-b border-[#DCECF2] text-[#5F7180] uppercase tracking-wider font-extrabold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Sender</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Message</th>
                    <th className="py-3.5 px-4 sm:px-6">Status / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#0A192A]">
                  {contactInquiries.map((ci) => {
                    const status = ci.status || "new";
                    return (
                      <tr key={ci.id} className="hover:bg-[#F6FAFF]/60 transition-colors">
                        <td className="py-4 px-4 sm:px-6 font-bold">{ci.fullName}</td>
                        <td className="py-4 px-4 text-[#5F7180]">
                          <div>{ci.email}</div>
                          <div>{ci.phone}</div>
                        </td>
                        <td className="py-4 px-4 uppercase text-[11px] font-semibold text-[#00658F]">
                          {ci.userRole}
                        </td>
                        <td className="py-4 px-4 font-semibold text-[#0A192A]">{ci.subject}</td>
                        <td className="py-4 px-4 max-w-xs text-[#5F7180]">
                          <p className="line-clamp-2 leading-relaxed">{ci.message}</p>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <select
                            value={status}
                            disabled={updatingId === ci.id}
                            onChange={(e) =>
                              handleStatusChange(
                                "contact_inquiries",
                                ci.id,
                                e.target.value as "new" | "contacted" | "closed"
                              )
                            }
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border focus:outline-none ${
                              status === "new"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : status === "contacted"
                                ? "bg-sky-50 text-sky-800 border-sky-200"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
