import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, type = "text", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-[20px]">
              {icon}
            </span>
          )}
          <input
            id={id}
            type={type}
            ref={ref}
            className={cn(
              "w-full bg-surface-pure border border-border-subtle rounded-lg py-3 text-on-surface font-body-md text-sm transition-all duration-200 placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container",
              icon ? "pl-11 pr-4" : "px-4",
              error && "border-error focus:border-error focus:ring-error",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-error font-body-md mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
