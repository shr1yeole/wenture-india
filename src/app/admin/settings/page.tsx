"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/firebase/auth-context";

export default function AdminSettingsPage() {
  const { user, profile } = useAuth();
  const [copied, setCopied] = useState(false);

  const adminSetupJson = `{
  "email": "${user?.email || "admin@wentureindia.com"}",
  "role": "admin",
  "isAdmin": true,
  "createdAt": "serverTimestamp()"
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(adminSetupJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
          Configuration &amp; Security
        </span>
        <h1 className="text-3xl font-extrabold text-[#0A192A] tracking-tight font-heading">
          Admin Settings &amp; Architecture
        </h1>
        <p className="text-sm text-[#5F7180] mt-1">
          Platform telemetry, security policies, and administrator privilege provisioning guidance.
        </p>
      </div>

      {/* Admin Privilege Provisioning Guide */}
      <div className="bg-white border border-[#DCECF2] rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-[#DCECF2]">
          <div className="w-10 h-10 rounded-xl bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">shield_person</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0A192A] font-heading">
              Creating &amp; Managing Administrators
            </h2>
            <p className="text-xs text-[#5F7180]">
              To guarantee bulletproof security, administrators CANNOT be self-created from the frontend.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-[#5F7180] leading-relaxed">
          <p>
            Wenturex enforces a 3-tier administrator authorization security check across client and Firestore:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl">
              <span className="font-bold text-[#0A192A] block mb-1 text-xs">Method 1: Firestore admins Collection</span>
              <p className="text-[11px] text-[#5F7180]">
                In Firebase Console, create document <code className="font-mono text-[#00658F]">admins/&#123;uid&#125;</code>. Any authenticated user whose UID exists here has administrator access.
              </p>
            </div>

            <div className="p-3.5 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl">
              <span className="font-bold text-[#0A192A] block mb-1 text-xs">Method 2: User Role in users/&#123;uid&#125;</span>
              <p className="text-[11px] text-[#5F7180]">
                Set <code className="font-mono text-[#00658F]">role: &quot;admin&quot;</code> or <code className="font-mono text-[#00658F]">isAdmin: true</code> in <code className="font-mono text-[#00658F]">users/&#123;uid&#125;</code>.
              </p>
            </div>

            <div className="p-3.5 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl">
              <span className="font-bold text-[#0A192A] block mb-1 text-xs">Method 3: Environment Whitelist</span>
              <p className="text-[11px] text-[#5F7180]">
                Add emails to <code className="font-mono text-[#00658F]">NEXT_PUBLIC_ADMIN_EMAILS</code> in <code className="font-mono text-[#00658F]">.env.local</code>.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] relative">
            <button
              type="button"
              onClick={copyToClipboard}
              className="absolute right-3 top-3 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-sans transition-colors"
            >
              {copied ? "Copied!" : "Copy Payload"}
            </button>
            <span className="text-slate-400 block mb-2">{"// Sample Document for Firestore admins/" + (user?.uid || "UID")}</span>
            <pre>{adminSetupJson}</pre>
          </div>
        </div>
      </div>

      {/* Platform & Environment Status */}
      <div className="bg-white border border-[#DCECF2] rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0A192A] font-heading">
          Connected Firebase Infrastructure
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Project ID</span>
            <strong className="text-[#0A192A] font-mono text-sm">wenture-india</strong>
          </div>

          <div className="p-3.5 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Auth Domain</span>
            <strong className="text-[#0A192A] font-mono text-sm">wenture-india.firebaseapp.com</strong>
          </div>

          <div className="p-3.5 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Storage Bucket</span>
            <strong className="text-[#0A192A] font-mono text-sm">wenture-india.firebasestorage.app</strong>
          </div>

          <div className="p-3.5 bg-[#F4FAFD] border border-[#DCECF2] rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Admin Session</span>
            <strong className="text-[#0A192A] text-sm truncate block">{user?.email}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
