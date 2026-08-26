import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { OPPORTUNITIES } from "@/lib/constants/opportunities";
import { OpportunityDetailView } from "@/components/opportunity-detail-view";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return OPPORTUNITIES.map((opp) => ({
    slug: opp.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const opp = OPPORTUNITIES.find((o) => o.slug === slug);
  if (!opp) return { title: "Opportunity Not Found" };

  return {
    title: `${opp.title} (${opp.category} - ${opp.sector}) | Wenturex India International`,
    description: opp.shortDescription,
  };
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const opp = OPPORTUNITIES.find((o) => o.slug === slug);

  if (!opp) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F6FAFF] selection:bg-[#00A6E8] selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <OpportunityDetailView opportunity={opp} />
      </main>
      <Footer />
    </div>
  );
}
