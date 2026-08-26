import React from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

export function BentoCard({
  icon,
  title,
  description,
  className,
  children,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-pure rounded-xl p-8 border border-border-subtle shadow-[0px_4px_20px_rgba(10,25,42,0.04)] hover:shadow-[0px_8px_30px_rgba(10,25,42,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group",
        className
      )}
    >
      <div>
        <div className="w-14 h-14 rounded-lg bg-surface-container-high text-primary-container flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
          <span className="material-symbols-outlined text-[30px]">{icon}</span>
        </div>
        <h3 className="font-headline-md text-2xl text-on-surface mb-3 font-semibold">
          {title}
        </h3>
        <p className="font-body-md text-base text-on-surface-variant leading-relaxed">
          {description}
        </p>
      </div>

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
