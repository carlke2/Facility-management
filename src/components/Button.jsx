import React from "react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizes = {
    sm: "text-sm px-3 py-1.5 rounded-lg",
    md: "text-sm px-4 py-2 rounded-xl",
    lg: "text-base px-7 py-3 rounded-2xl",
  };

  const variants = {
    // ✅ Company CTA (RED)
    primary:
      "bg-[rgb(var(--brand))] text-white shadow-md hover:bg-[rgb(var(--brandHover))] hover:shadow-lg focus:ring-[rgb(var(--brand))] focus:ring-offset-[rgb(var(--bg))]",

    // ✅ Dark-theme friendly ghost button
    ghost:
      "bg-white/5 backdrop-blur border border-[rgb(var(--border))] text-[rgb(var(--text))] hover:bg-white/10 focus:ring-white/10 focus:ring-offset-[rgb(var(--bg))]",

    // ✅ Soft red button
    soft:
      "bg-[rgb(var(--brand))]/10 text-[rgb(var(--text))] border border-[rgb(var(--brand))]/20 hover:bg-[rgb(var(--brand))]/15 focus:ring-[rgb(var(--brand))]/25 focus:ring-offset-[rgb(var(--bg))]",

    // Danger stays red (slightly brighter)
    danger:
      "bg-red-600 text-white hover:bg-red-500 focus:ring-red-300 focus:ring-offset-[rgb(var(--bg))]",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
