"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GUIDES, GuideItem } from "@/lib/constants/guides";

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<GuideItem[]>(GUIDES);
  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#00A6E8] uppercase tracking-wider block mb-1">
            Knowledge Base
          </span>
          <h1 className="text-3xl font-extrabold text-[#0A192A] tracking-tight font-heading">
            Guide Management
          </h1>
          <p className="text-sm text-[#5F7180] mt-1">
            Institutional educational modules providing investor and entrepreneur guidance.
          </p>
        </div>

        <Link
          href="/guides"
          target="_blank"
          className="px-4 py-2 bg-white border border-[#DCECF2] hover:bg-slate-50 text-[#0A192A] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <span>View Public Knowledge Hub</span>
          <span className="material-symbols-outlined text-[16px] text-[#00A6E8]">open_in_new</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {guides.map((guide) => (
          <div
            key={guide.slug}
            className="bg-white border border-[#DCECF2] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="w-10 h-10 rounded-xl bg-[#EBF6FC] text-[#00A6E8] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">menu_book</span>
                </span>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                  Published
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#0A192A] mb-2 font-heading">{guide.title}</h3>
              <p className="text-xs text-[#5F7180] leading-relaxed mb-4">{guide.shortDescription}</p>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Core Sections:
                </span>
                {guide.contentSections.slice(0, 3).map((section, i) => (
                  <div key={i} className="text-xs text-[#0A192A] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A6E8]" />
                    <span className="truncate">{section.heading}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#DCECF2] flex items-center justify-between">
              <span className="text-[11px] text-[#5F7180]">Route: <code className="text-[#00658F] font-mono">/guides/{guide.slug}</code></span>
              <Link
                href={`/guides/${guide.slug}`}
                target="_blank"
                className="text-xs font-bold text-[#00A6E8] hover:underline flex items-center gap-1"
              >
                <span>Read</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
