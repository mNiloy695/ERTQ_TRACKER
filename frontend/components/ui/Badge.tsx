import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "magnitude";
  magnitude?: number;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  magnitude,
  className,
  children,
  ...props
}) => {
  let styleClasses = "bg-slate-800 text-slate-300 border-slate-700";

  if (variant === "success") {
    styleClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  } else if (variant === "warning") {
    styleClasses = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  } else if (variant === "danger") {
    styleClasses = "bg-rose-500/10 text-rose-400 border-rose-500/20";
  } else if (variant === "info") {
    styleClasses = "bg-sky-500/10 text-sky-400 border-sky-500/20";
  } else if (variant === "magnitude" && magnitude !== undefined) {
    if (magnitude >= 7.0) {
      styleClasses = "bg-purple-950/80 text-purple-300 border-purple-500/40 font-bold shadow-sm shadow-purple-500/20";
    } else if (magnitude >= 6.0) {
      styleClasses = "bg-rose-950/80 text-rose-300 border-rose-500/40 font-bold shadow-sm shadow-rose-500/20";
    } else if (magnitude >= 5.0) {
      styleClasses = "bg-amber-950/80 text-amber-300 border-amber-500/40 font-semibold";
    } else if (magnitude >= 4.0) {
      styleClasses = "bg-yellow-950/60 text-yellow-300 border-yellow-500/30";
    } else {
      styleClasses = "bg-emerald-950/50 text-emerald-400 border-emerald-500/30";
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium tracking-wide transition-colors",
        styleClasses,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
