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

      <main className="flex-grow py-8 sm:py-14 md:py-20">
        <Container size="narrow">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-body-md text-on-surface-variant mb-4 sm:mb-8">
            <Link href="/guides" className="hover:text-primary-container">
              Guides
            </Link>
            <span>/</span>
            <span className="text-on-surface font-semibold truncate max-w-[200px] sm:max-w-none">{guide.title}</span>
          </div>

          {/* Article Header */}
          <header className="mb-6 sm:mb-12">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <Badge variant="primary">{guide.category}</Badge>
              <span className="text-xs font-body-md text-on-surface-variant">
                {guide.readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-on-surface mb-3 sm:mb-4 leading-tight">
              {guide.title}
            </h1>

            <p className="text-base sm:text-xl text-secondary font-medium leading-relaxed">
              {guide.subtitle}
            </p>
          </header>

          {/* Article Content */}
          <div className="bg-surface-pure rounded-2xl p-4 sm:p-8 md:p-12 border border-border-subtle shadow-sm space-y-6 sm:space-y-10">
            {guide.contentSections.map((section, idx) => (
              <section key={idx} className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-2xl font-bold text-on-surface">
                  {section.heading}
                </h2>

                {section.body.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-xs sm:text-base text-on-surface-variant leading-relaxed"
                  >
                    {p}
                  </p>
                ))}

                {section.keyTakeaway && (
                  <div className="bg-surface-container-low border-l-4 border-primary-container p-3 sm:p-4 rounded-r-lg text-xs sm:text-sm text-on-surface font-medium mt-3 sm:mt-4">
                    <span className="font-bold text-primary block mb-0.5 sm:mb-1">Key Takeaway:</span>
                    {section.keyTakeaway}
                  </div>
                )}
              </section>
            ))}

            {/* Bottom Call to Action */}
            <div className="pt-6 sm:pt-8 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div>
                <h4 className="font-button-text text-sm sm:text-base font-bold text-on-surface">
                  Ready to explore active opportunities?
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Explore active business and investment opportunities in our catalog.
                </p>
              </div>

              <Link
                href="/opportunities"
                className="bg-primary-container text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-button-text text-xs sm:text-sm hover:bg-surface-tint shadow-sm transition-all shrink-0 w-full sm:w-auto text-center"
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
