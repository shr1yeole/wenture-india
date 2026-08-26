import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { GuideItem } from "@/lib/constants/guides";
import { Badge } from "@/components/ui/badge";

interface GuideTemplateProps {
  guide: GuideItem;
}

export function GuideTemplate({ guide }: GuideTemplateProps) {
  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-container selection:text-white">
      <Navbar />

      <main className="flex-grow py-12 md:py-20">
        <Container size="narrow">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-body-md text-on-surface-variant mb-8">
            <Link href="/guides" className="hover:text-primary-container">
              Guides
            </Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">{guide.title}</span>
          </div>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="primary">{guide.category}</Badge>
              <span className="text-xs font-body-md text-on-surface-variant">
                {guide.readTime}
              </span>
            </div>

            <h1 className="font-display-lg-mobile md:font-headline-xl text-3xl md:text-5xl font-bold text-on-surface mb-4 leading-tight">
              {guide.title}
            </h1>

            <p className="font-headline-md text-xl text-secondary font-medium leading-relaxed">
              {guide.subtitle}
            </p>
          </header>

          {/* Article Content */}
          <div className="bg-surface-pure rounded-2xl p-8 sm:p-12 border border-border-subtle shadow-sm space-y-10">
            {guide.contentSections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="font-headline-md text-2xl font-bold text-on-surface">
                  {section.heading}
                </h2>

                {section.body.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className="font-body-md text-base text-on-surface-variant leading-relaxed"
                  >
                    {p}
                  </p>
                ))}

                {section.keyTakeaway && (
                  <div className="bg-surface-container-low border-l-4 border-primary-container p-4 rounded-r-lg text-sm text-on-surface font-medium mt-4">
                    <span className="font-bold text-primary block mb-1">Key Takeaway:</span>
                    {section.keyTakeaway}
                  </div>
                )}
              </section>
            ))}

            {/* Bottom Call to Action */}
            <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="font-button-text text-base font-bold text-on-surface">
                  Ready to explore active opportunities?
                </h4>
                <p className="font-body-md text-xs text-on-surface-variant">
                  Evaluate vetted live investments in our catalog.
                </p>
              </div>

              <Link
                href="/opportunities"
                className="bg-primary-container text-white px-6 py-3 rounded-lg font-button-text text-sm hover:bg-surface-tint shadow-sm transition-all shrink-0"
              >
                Browse Opportunities
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
