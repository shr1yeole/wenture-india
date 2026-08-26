import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-button-text transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-primary-container text-white hover:bg-surface-tint shadow-[0px_4px_12px_rgba(0,166,232,0.25)] rounded-lg",
    secondary:
      "bg-transparent border border-on-surface text-on-surface hover:bg-on-surface hover:text-white rounded-lg",
    outline:
      "bg-transparent border border-border-subtle text-on-surface hover:border-primary-container hover:text-primary-container rounded-lg",
    ghost:
      "bg-transparent text-primary-container hover:text-primary p-0",
    dark:
      "bg-on-surface text-white hover:bg-surface-tint rounded-lg",
  }[variant];

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }[size];

  return (
    <button
      className={cn(baseStyles, variantStyles, variant !== "ghost" && sizeStyles, className)}
      {...props}
    >
      {children}
    </button>
  );
}
