import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}

export function Container({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps) {
  const sizeClass = {
    narrow: "max-w-4xl",
    default: "max-w-container-max",
    wide: "max-w-7xl",
  }[size];

  return (
    <div
      className={cn(
        "w-full mx-auto px-margin-mobile md:px-margin-desktop",
        sizeClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
