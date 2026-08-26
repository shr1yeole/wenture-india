import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "surface" | "outline" | "highlight";
  children: React.ReactNode;
}

export function Badge({
  className,
  variant = "surface",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-primary-container text-white",
    surface: "bg-surface-container-high text-on-surface-variant border border-border-subtle",
    outline: "bg-transparent text-primary-container border border-primary-container/30",
    highlight: "bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded font-label-caps text-xs uppercase tracking-wider font-semibold",
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
