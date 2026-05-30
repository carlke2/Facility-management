import React from "react";

const capabilities = [
  {
    title: "Ticket Intake",
    desc: "Multi-channel support request collection from email, chat, and web forms.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    title: "SLA Tracking",
    desc: "Monitor response and resolution times against service level agreements.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    title: "Escalation",
    desc: "Automated routing and escalation for complex or time-sensitive issues.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/>
      </svg>
    ),
  },
  {
    title: "Knowledge Base",
    desc: "Self-service resources and documentation for employee autonomy.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    title: "Analytics",
    desc: "Deep insights into support performance, trends, and team efficiency.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

export default function SupportTicketingSection() {
  return (
    <section id="support-ticketing" className="section-padding bg-[rgb(var(--bg-alt))]">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div>
            <div className="badge-coming-soon mb-3">
              <svg className="w-3 h-3 mr-1.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Coming Soon
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Support Ticketing & Help Desk
            </h2>
            <p className="text-base text-[rgb(var(--text-secondary))] leading-relaxed mb-8">
              Provide exceptional support to your workforce. Our upcoming ticketing module will centralize requests, automate workflows, and provide the tools your support team needs to succeed.
            </p>

            <div className="space-y-5">
              {capabilities.map((cap, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-[rgb(var(--brand))/0.1] border border-[rgb(var(--brand))/0.15] flex items-center justify-center text-[rgb(var(--brand-hover))] flex-shrink-0 group-hover:scale-110 transition-transform">
                    {cap.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">{cap.title}</h4>
                    <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed">{cap.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button className="btn-secondary px-6 py-3 text-sm cursor-default opacity-70">
                <svg className="w-4 h-4 mr-2 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Coming Soon
              </button>
            </div>
          </div>

          {/* Right — Visual Mockup */}
          <div className="relative">
            <div className="card-premium p-6 relative overflow-hidden">
              <div className="space-y-3">
                {[
                  { title: "Laptop screen flickering", priority: "High", status: "Open", statusColor: "bg-red-500/20 text-red-400 border-red-500/20", active: true },
                  { title: "VPN connection issues", priority: "Medium", status: "In Progress", statusColor: "bg-amber-500/20 text-amber-400 border-amber-500/20", active: false },
                  { title: "New employee onboarding", priority: "Normal", status: "Pending", statusColor: "bg-blue-500/20 text-blue-400 border-blue-500/20", active: false },
                  { title: "Printer paper jam — Floor 3", priority: "Low", status: "Resolved", statusColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20", active: false },
                ].map((ticket, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border transition-all ${
                      ticket.active
                        ? "bg-[rgb(var(--surface-hover))] border-[rgb(var(--brand))/0.3]"
                        : "bg-[rgb(var(--bg))] border-[rgb(var(--border))] opacity-50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[rgb(var(--text-muted))]">TK-{1001 + i}</span>
                        <span className="text-xs font-semibold text-white">{ticket.title}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ticket.statusColor}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[10px] text-[rgb(var(--text-muted))]">Priority: {ticket.priority}</span>
                      <span className="text-[10px] text-[rgb(var(--text-muted))]">•</span>
                      <span className="text-[10px] text-[rgb(var(--text-muted))]">Assigned: IT Support</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating notification */}
              <div className="absolute -top-4 -right-4 card-premium p-3.5 shadow-2xl bg-[rgb(var(--brand))] border-[rgb(var(--brand))] text-white max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">New Request</span>
                </div>
                <div className="text-xs font-medium">Laptop screen flickering in Room B</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
