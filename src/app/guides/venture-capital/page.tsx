import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { GUIDES } from "@/lib/constants/guides";
import { GuideTemplate } from "@/components/guides/guide-template";

export const metadata: Metadata = {
  title: "Guide to Venture Capital | Wenturex",
  description: "Navigating early-stage and growth-stage high-growth technology funding rounds and term sheets.",
};

export default function VentureCapitalGuidePage() {
  const guide = GUIDES.find((g) => g.slug === "venture-capital");
  if (!guide) notFound();
  return <GuideTemplate guide={guide} />;
}
