import React from "react";
import Card from "./Card";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <div className="text-sm font-semibold text-[rgb(var(--brand))]">
            Boardroom
          </div>

          <h1 className="mt-2 text-2xl font-semibold text-[rgb(var(--text))]">
            {title}
          </h1>

          {subtitle ? (
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">{subtitle}</p>
          ) : null}
        </div>

        <Card className="p-6">{children}</Card>

        {footer ? (
          <div className="mt-4 text-sm text-[rgb(var(--muted))]">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
