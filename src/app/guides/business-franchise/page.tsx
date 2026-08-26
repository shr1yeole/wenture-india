import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { GUIDES } from "@/lib/constants/guides";
import { GuideTemplate } from "@/components/guides/guide-template";

export const metadata: Metadata = {
  title: "Guide to Business Franchise | Wenturex",
  description: "Evaluating franchise models, master franchise licenses, unit economics, and operational playbooks.",
};

export default function BusinessFranchiseGuidePage() {
  const guide = GUIDES.find((g) => g.slug === "business-franchise");
  if (!guide) notFound();
  return <GuideTemplate guide={guide} />;
}
