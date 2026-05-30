import React from "react";

const hrFeatures = [
  {
    title: "Employee Records",
    desc: "Centralized employee database with complete lifecycle tracking.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    title: "Onboarding",
    desc: "Streamlined onboarding workflows for new team members.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
        <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
      </svg>
    ),
  },
  {
    title: "Leave & Attendance",
    desc: "Automated leave tracking, attendance monitoring, and shift management.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    title: "Policies & Documents",
    desc: "Centralized policy storage with version control and acknowledgements.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    title: "Performance",
    desc: "Goals, reviews, and performance management in a structured framework.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    title: "HR Analytics",
    desc: "Workforce analytics, headcount trends, and turnover insights.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

export default function HumanResourceSection() {
  return (
    <section id="human-resource" className="section-padding">
      <div className="container-wide">
        <div className="max-w-3xl mb-14">
          <div className="badge-coming-soon mb-3">
            <svg className="w-3 h-3 mr-1.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Planned Module
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Human Resource Management</h2>
          <p className="text-base text-[rgb(var(--text-secondary))] leading-relaxed">
            Streamline your workforce management with our upcoming HR module. From onboarding to performance tracking, manage the entire employee lifecycle in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hrFeatures.map((feature, i) => (
            <div key={i} className="card-feature group">
              <div className="w-11 h-11 rounded-xl bg-[rgb(var(--surface-hover))] border border-[rgb(var(--border))] flex items-center justify-center mb-4 text-[rgb(var(--brand-hover))] group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold mb-1.5">{feature.title}</h3>
              <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 p-10 rounded-2xl bg-gradient-to-br from-[rgb(var(--surface))] to-[rgb(var(--bg-alt))] border border-[rgb(var(--border))] text-center">
          <h3 className="text-xl font-bold mb-3">Ready to elevate your HR operations?</h3>
          <p className="text-sm text-[rgb(var(--text-secondary))] mb-6 max-w-xl mx-auto">
            Our HR module is currently under development. Be the first to know when we launch and get early access.
          </p>
          <button className="btn-secondary px-6 py-3 text-sm cursor-not-allowed opacity-60">
            View Upcoming Features
          </button>
        </div>
      </div>
    </section>
  );
}
