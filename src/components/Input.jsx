import React from "react";

export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1">
      {label ? (
        <label className="text-sm font-medium text-[rgb(var(--muted))]">
          {label}
        </label>
      ) : null}

      <input
        className={`w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface2))] px-3 py-2 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--muted))] outline-none transition focus:border-[rgb(var(--brand))]/40 focus:ring-2 focus:ring-[rgb(var(--brand))]/20 ${className}`}
        {...props}
      />

      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
