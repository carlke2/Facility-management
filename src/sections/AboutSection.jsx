import React from "react";

const points = [
  {
    title: "One Platform",
    desc: "Unified workspace operations for HR, Facility, and Support — no more juggling tools.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    title: "Reduced Friction",
    desc: "Eliminate manual coordination and scheduling conflicts across departments.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    title: "Total Visibility",
    desc: "Real-time tracking of resources, bookings, and workforce operations across locations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    title: "Data-Driven",
    desc: "Comprehensive reporting and insights for smarter, more informed decisions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-padding">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-label">Why OpsHub</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold mb-5">
            Why teams choose OpsHub.
          </h2>
          <p className="text-base text-[rgb(var(--text-secondary))] leading-relaxed">
            OpsHub was built to solve the fragmentation in workplace operations. By bringing together HR, Facility Management, and Support, we help teams work smarter and faster.
          </p>
        </div>

        {/* Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {points.map((point, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] flex items-center justify-center mb-5 text-[rgb(var(--brand-hover))] group-hover:border-[rgb(var(--brand))/0.4] group-hover:scale-110 transition-all shadow-md">
                {point.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{point.title}</h3>
              <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="p-10 lg:p-14 rounded-2xl bg-gradient-to-r from-[rgb(var(--surface))] to-[rgb(var(--bg-alt))] border border-[rgb(var(--border))] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[rgb(var(--brand))/0.04] blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Connecting People, Rooms, and Resources.</h3>
              <p className="text-[rgb(var(--text-secondary))] mb-6 leading-relaxed">
                We believe workspace management should be invisible. Our goal is to automate the mundane so your team can focus on doing great work.
              </p>
              <button
                className="btn-primary px-7 py-3 text-sm"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Learn More About Our Mission
              </button>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Rooms Managed", value: "500+", color: "border-[rgb(var(--brand))/0.3]" },
                  { label: "Active Users", value: "2.4k", color: "border-blue-500/30" },
                  { label: "Bookings/mo", value: "12k+", color: "border-emerald-500/30" },
                  { label: "Uptime", value: "99.9%", color: "border-amber-500/30" },
                ].map((stat, i) => (
                  <div key={i} className={`h-28 w-28 sm:h-32 sm:w-32 rounded-2xl bg-[rgb(var(--surface-hover))] border ${stat.color} flex flex-col items-center justify-center text-center p-3 hover:scale-105 transition-transform`}>
                    <span className="text-2xl font-extrabold text-white">{stat.value}</span>
                    <span className="text-[10px] text-[rgb(var(--text-muted))] font-semibold uppercase tracking-wider mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
