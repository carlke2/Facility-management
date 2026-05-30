import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}
