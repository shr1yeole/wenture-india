import React from "react";
import Link from "next/link";
import { GuideItem } from "@/lib/constants/guides";

interface GuideCardProps {
  guide: GuideItem;
}

export function GuideCard({ guide }: GuideCardProps) {
  return (
    <article className="bg-surface-pure rounded-xl p-8 border border-border-subtle shadow-[0px_4px_20px_rgba(10,25,42,0.04)] hover:shadow-[0px_8px_30px_rgba(10,25,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="bg-surface-container-high text-on-surface-variant font-label-caps text-xs px-2.5 py-1 rounded">
            {guide.category}
          </span>
          <span className="font-body-md text-xs text-on-surface-variant">
            {guide.readTime}
          </span>
        </div>

        <h3 className="font-headline-md text-2xl text-on-surface mb-3 font-semibold group-hover:text-primary-container transition-colors">
          <Link href={`/guides/${guide.slug}`}>
            {guide.title}
          </Link>
        </h3>

        <p className="font-body-md text-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-6">
          {guide.shortDescription}
        </p>
      </div>

      <Link
        href={`/guides/${guide.slug}`}
        className="text-primary-container hover:text-primary font-button-text text-sm flex items-center gap-1.5 transition-colors group-hover:translate-x-1 duration-200"
      >
        Read Full Guide
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </Link>
    </article>
  );
}
