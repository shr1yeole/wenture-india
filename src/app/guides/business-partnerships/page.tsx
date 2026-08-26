import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { GUIDES } from "@/lib/constants/guides";
import { GuideTemplate } from "@/components/guides/guide-template";

export const metadata: Metadata = {
  title: "Guide to Business Partnerships | Wenturex",
  description: "Structuring collaborative joint ventures, strategic alliances, and profit-sharing ventures.",
};

export default function BusinessPartnershipsGuidePage() {
  const guide = GUIDES.find((g) => g.slug === "business-partnerships");
  if (!guide) notFound();
  return <GuideTemplate guide={guide} />;
}
