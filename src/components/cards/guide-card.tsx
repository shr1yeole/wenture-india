import React from "react";
import Link from "next/link";
import { GuideItem } from "@/lib/constants/guides";

interface GuideCardProps {
  guide: GuideItem;
}

export function GuideCard({ guide }: GuideCardProps) {
  return (
    <article className="bg-surface-pure rounded-xl p-3.5 sm:p-6 md:p-8 border border-border-subtle shadow-[0px_4px_20px_rgba(10,25,42,0.04)] hover:shadow-[0px_8px_30px_rgba(10,25,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group h-full">
      <div>
        <div className="flex items-center justify-between gap-1.5 mb-2.5 sm:mb-4">
          <span className="bg-surface-container-high text-on-surface-variant font-label-caps text-[9px] sm:text-xs px-2 py-0.5 rounded truncate max-w-[100px] sm:max-w-none">
            {guide.category}
          </span>
          <span className="font-body-md text-[9px] sm:text-xs text-on-surface-variant shrink-0">
            {guide.readTime}
          </span>
        </div>

        <h3 className="font-headline-md text-xs sm:text-lg md:text-2xl text-on-surface mb-1.5 sm:mb-3 font-semibold group-hover:text-primary-container transition-colors line-clamp-2">
          <Link href={`/guides/${guide.slug}`}>
            {guide.title}
          </Link>
        </h3>

        <p className="font-body-md text-[10px] sm:text-xs md:text-sm text-on-surface-variant leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-6">
          {guide.shortDescription}
        </p>
      </div>

      <Link
        href={`/guides/${guide.slug}`}
        className="text-primary-container hover:text-primary font-button-text text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 transition-colors group-hover:translate-x-1 duration-200"
      >
        <span>Read Guide</span>
        <span className="material-symbols-outlined text-[14px] sm:text-[18px]">arrow_forward</span>
      </Link>
    </article>
  );
}
