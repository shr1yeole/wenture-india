import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { GUIDES } from "@/lib/constants/guides";
import { GuideTemplate } from "@/components/guides/guide-template";

export const metadata: Metadata = {
  title: "Guide to Business Investment | Wenturex",
  description: "A comprehensive institutional framework for evaluating and structuring private market business investments.",
};

export default function BusinessInvestmentGuidePage() {
  const guide = GUIDES.find((g) => g.slug === "business-investment");
  if (!guide) notFound();
  return <GuideTemplate guide={guide} />;
}
