import React from "react";

const benefits = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    title: "Better Space Utilization",
    desc: "Optimize space allocation with real-time visibility and occupancy insights.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: "Easier Scheduling",
    desc: "Find available rooms and desks at a glance. No more back-and-forth.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Smarter Visitor Management",
    desc: "Manage visitors, host pre-registrations, and enhance front-desk efficiency.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Reduced Coordination Friction",
    desc: "Automated workflows and notifications keep everyone on the loop.",
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="section-padding bg-[rgb(var(--bg-alt))]">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="section-label">Built for Modern Workplaces</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold mb-5">
            Benefits that drive impact.
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="group text-center p-8 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] hover:border-[rgb(var(--border-light))] transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-[rgb(var(--brand))/0.1] border border-[rgb(var(--brand))/0.15] flex items-center justify-center text-[rgb(var(--brand-hover))] group-hover:scale-110 transition-transform">
                {b.icon}
              </div>
              <h3 className="text-base font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
