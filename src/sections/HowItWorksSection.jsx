import React from "react";

const steps = [
  {
    num: "1",
    title: "Request",
    desc: "Employee searches for available rooms, desks, or resources and submits a booking request.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    num: "2",
    title: "Availability Check",
    desc: "System checks real-time availability and policy compliance before confirming the slot.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    num: "3",
    title: "Book",
    desc: "Booking is confirmed instantly or routed for approval based on configured policies.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    num: "4",
    title: "Approval",
    desc: "If needed, the request goes to the designated approver for authorization.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    num: "5",
    title: "Notification",
    desc: "All attendees receive calendar invites and reminders automatically.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    num: "6",
    title: "Check-In",
    desc: "Employees check in on arrival. No-shows are auto-released for others to book.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding bg-[rgb(var(--bg-alt))]">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="section-label">How It Works</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold mb-5">
            From request to check-in—seamless and automated.
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-[3.25rem] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-[rgb(var(--border-light))] to-transparent z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                {/* Step circle */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] flex items-center justify-center text-[rgb(var(--text-secondary))] group-hover:border-[rgb(var(--brand))/0.5] group-hover:text-[rgb(var(--brand-hover))] transition-all duration-300 group-hover:shadow-lg">
                    {step.icon}
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[rgb(var(--brand))] text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                    {step.num}
                  </div>
                </div>

                <h4 className="text-sm font-bold mb-2">{step.title}</h4>
                <p className="text-xs text-[rgb(var(--text-muted))] leading-relaxed max-w-[180px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
