import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { GUIDES } from "@/lib/constants/guides";
import { GuideTemplate } from "@/components/guides/guide-template";

export const metadata: Metadata = {
  title: "Guide to Angel Investment | Wenturex",
  description: "Empowering visionary early-stage founders through strategic angel syndicates and individual capital.",
};

export default function AngelInvestmentGuidePage() {
  const guide = GUIDES.find((g) => g.slug === "angel-investment");
  if (!guide) notFound();
  return <GuideTemplate guide={guide} />;
}
