import React from "react";

export default function Alert({ type = "info", children }) {
  const styles = {
    info: "border-zinc-200 bg-zinc-50 text-zinc-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-red-200 bg-red-50 text-red-900",
  };
  return (
    <div className={`rounded-xl border px-3 py-2 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
}
