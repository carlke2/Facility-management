import React from "react";
import { useAuth } from "../context/AuthContext";

export default function InsightsSection() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const metrics = [
    { label: "Utilization Rate", value: "72%", trend: "+5%", trendLabel: "vs last 30 days", up: true },
    { label: "Total Bookings", value: "842", trend: "+12%", trendLabel: "vs last 30 days", up: true },
    { label: "No-shows", value: "24", trend: "-10%", trendLabel: "vs last 30 days", up: false },
    { label: "Avg. Check-in", value: "91%", trend: "+2%", trendLabel: "vs last 30 days", up: true },
  ];

  const checkpoints = [
    "Track real-time occupancy and utilization trends",
    "Identify peak usage and underutilized spaces",
    "Run time tracking and priority impact analysis",
    "Export reports and share with stakeholders",
  ];

  return (
    <section id="insights" className="section-padding bg-[rgb(var(--bg-alt))]">
      <div className="container-wide">
        {/* Top Section — Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-12">
          {/* Left — Copy */}
          <div>
            <span className="section-label">Smart Analytics</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-5 leading-tight">
              Make data-driven decisions with utilization insights.
            </h2>
            <p className="text-base text-[rgb(var(--text-secondary))] leading-relaxed mb-8">
              Track occupancy, no-shows, and resource usage across locations. Optimize space planning and improve ROI with actionable analytics.
            </p>

            <div className="space-y-3">
              {checkpoints.map((cp, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[rgb(var(--success))/0.15] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--success))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="text-sm text-[rgb(var(--text-secondary))]">{cp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Metrics Dashboard */}
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Facility Utilization Overview</h3>
              <div className="flex gap-2">
                <select className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg px-3 py-1.5 text-xs text-[rgb(var(--text-secondary))] outline-none">
                  <option>All locations</option>
                </select>
                <select className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg px-3 py-1.5 text-xs text-[rgb(var(--text-secondary))] outline-none">
                  <option>Last 30 days</option>
                </select>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {metrics.map((m, i) => (
                <div key={i} className="card-premium p-4">
                  <div className="text-[10px] font-semibold text-[rgb(var(--text-muted))] uppercase tracking-wider mb-1.5">{m.label}</div>
                  <div className="text-2xl font-extrabold mb-1">{m.value}</div>
                  <div className={`text-[10px] font-bold ${m.up ? "text-[rgb(var(--success))]" : "text-[rgb(var(--success))]"}`}>
                    {m.trend} <span className="text-[rgb(var(--text-muted))] font-normal">{m.trendLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="card-premium p-6 h-[360px] flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold">Utilization Trend</h3>
              <span className="text-[10px] text-[rgb(var(--success))] font-bold">↑ +8% overall</span>
            </div>
            <div className="flex-1 flex items-end gap-2 px-2 pb-2">
              {[40, 60, 45, 80, 55, 90, 70, 85, 50, 65, 75, 60].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div
                    style={{ height: `${h}%` }}
                    className="bg-[rgb(var(--brand))]/25 rounded-t group-hover:bg-[rgb(var(--brand))]/50 transition-all duration-200"
                  />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-[rgb(var(--text-dark))] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {h}%
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between px-2 text-[9px] text-[rgb(var(--text-muted))] font-semibold uppercase mt-3 border-t border-[rgb(var(--border))] pt-3">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="card-premium p-6 h-[360px] flex flex-col">
            <h3 className="text-base font-bold mb-5">Utilization by Space Type</h3>
            <div className="flex-1 flex items-center justify-center gap-10">
              {/* SVG Donut */}
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {/* Background ring */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(var(--surface-hover))" strokeWidth="3.5" />
                  {/* Segments */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(var(--brand-hover))" strokeWidth="3.5"
                    strokeDasharray="54.5 33.4" strokeDashoffset="0" className="transition-all duration-500" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(var(--success))" strokeWidth="3.5"
                    strokeDasharray="21.1 66.8" strokeDashoffset="-54.5" className="transition-all duration-500" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(var(--warning))" strokeWidth="3.5"
                    strokeDasharray="8.8 79.1" strokeDashoffset="-75.6" className="transition-all duration-500" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(var(--text-muted))" strokeWidth="3.5"
                    strokeDasharray="3.5 84.4" strokeDashoffset="-84.4" className="transition-all duration-500" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold">72%</span>
                  <span className="text-[9px] text-[rgb(var(--text-muted))] uppercase font-bold tracking-wider">Overall</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3.5">
                {[
                  { label: "Meeting Rooms", val: "62%", color: "bg-[rgb(var(--brand-hover))]" },
                  { label: "Desks", val: "24%", color: "bg-[rgb(var(--success))]" },
                  { label: "Amenities", val: "10%", color: "bg-[rgb(var(--warning))]" },
                  { label: "Other", val: "4%", color: "bg-[rgb(var(--text-muted))]" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-[rgb(var(--text-secondary))] w-28">{item.label}</span>
                    <span className="text-sm font-bold">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Admin/Non-admin CTA */}
        {isAdmin ? (
          <div className="mt-10 flex justify-center">
            <button className="btn-primary px-8 py-3.5 text-sm">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Access Real-time Reports
            </button>
          </div>
        ) : (
          <div className="mt-10 p-6 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-center max-w-2xl mx-auto">
            <h4 className="font-bold mb-2">Available for Administrators</h4>
            <p className="text-sm text-[rgb(var(--text-secondary))] mb-4">Real-time reports, activity logs, and export capabilities are available for users with administrative privileges.</p>
            <button className="text-[rgb(var(--brand-hover))] text-sm font-bold hover:underline">Learn more about admin features →</button>
          </div>
        )}
      </div>
    </section>
  );
}
