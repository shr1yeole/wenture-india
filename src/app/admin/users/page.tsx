"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getAllUsers, UserProfile, UserRole } from "@/lib/firebase/auth";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    const res = await getAllUsers();
    if (!res.error) {
      setUsers(res.users);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter === "admin") {
        if (!u.isAdmin && u.role !== "admin") return false;
      } else if (roleFilter !== "all" && u.role !== roleFilter) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = u.fullName?.toLowerCase().includes(query) || u.name?.toLowerCase().includes(query);
        const matchEmail = u.email?.toLowerCase().includes(query);
        const matchCompany = u.companyName?.toLowerCase().includes(query);
        const matchLocation = u.location?.toLowerCase().includes(query);
        if (!matchName && !matchEmail && !matchCompany && !matchLocation) {
          return false;
        }
      }
      return true;
    });
  }, [users, roleFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
            Directory
          </span>
          <h1 className="text-3xl font-extrabold text-[#0A192A] tracking-tight font-heading">
            User Management
          </h1>
          <p className="text-sm text-[#5F7180] mt-1">
            Institutional directory of registered investors, entrepreneurs, and platform administrators.
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          className="px-4 py-2 bg-white border border-[#DCECF2] hover:bg-slate-50 text-[#0A192A] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px] text-[#00A6E8]">refresh</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-[#DCECF2] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl w-full sm:w-auto overflow-x-auto">
          {(["all", "entrepreneur", "investor", "admin"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                roleFilter === r
                  ? "bg-[#00A6E8] text-white shadow-sm"
                  : "text-[#5F7180] hover:text-[#0A192A]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, company..."
            className="w-full pl-9 pr-4 py-2 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl text-xs text-[#0A192A] focus:outline-none focus:border-[#00A6E8]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#DCECF2] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-[#00A6E8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold">Loading registered users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-[#5F7180]">
            <span className="material-symbols-outlined text-[36px] text-slate-300 mb-2">person_off</span>
            <p className="text-sm font-bold text-[#0A192A]">No users found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4FAFD] border-b border-[#DCECF2] text-[#5F7180] uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 sm:px-6">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#0A192A]">
                {filteredUsers.map((u) => {
                  return (
                    <tr key={u.uid} className="hover:bg-[#F6FAFF]/60 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-bold">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center font-bold text-xs">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm text-[#0A192A] block">{u.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-normal">UID: {u.uid.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-medium text-[#5F7180]">
                        {u.email}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                              u.role === "investor"
                                ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                                : "bg-sky-50 text-sky-800 border-sky-200"
                            }`}
                          >
                            {u.role}
                          </span>
                          {u.isAdmin && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border bg-purple-50 text-purple-800 border-purple-200 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">shield_person</span>
                              <span>Admin</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-[#5F7180]">
                        {u.companyName || "—"}
                      </td>

                      <td className="py-4 px-4 text-[#5F7180]">
                        {u.location || "India"}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-[#5F7180]">
                        {u.phone || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
