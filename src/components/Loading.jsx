import React from "react";

export default function Loading({ label = "Loading..." }) {
  return (
    <div className="min-h-[50vh] w-full flex items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
        <span className="text-sm text-zinc-700">{label}</span>
      </div>
    </div>
  );
}
