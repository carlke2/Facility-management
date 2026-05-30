import React from "react";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    color: "bg-[rgb(var(--icon-blue))]/15 text-blue-400 border-blue-500/20",
    title: "Meeting Rooms",
    desc: "Manage rooms with floor, full visibility, equipment, and location mapping.",
    link: "Learn More →",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
    color: "bg-[rgb(var(--icon-green))]/15 text-green-400 border-green-500/20",
    title: "Desk Booking",
    desc: "Reserve desks across co-working spaces for hybrid and flexible teams.",
    link: "Learn More →",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
        <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
      </svg>
    ),
    color: "bg-[rgb(var(--icon-orange))]/15 text-orange-400 border-orange-500/20",
    title: "Visitor Check-in",
    desc: "Pre-register visitors and let them self-badge with secure access.",
    link: "Learn More →",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
    color: "bg-[rgb(var(--icon-red))]/15 text-red-400 border-red-500/20",
    title: "Amenities & Assets",
    desc: "Book projectors, parking spots, vehicles, or any shared resource in your ecosystem.",
    link: "Learn More →",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    color: "bg-[rgb(var(--icon-purple))]/15 text-purple-400 border-purple-500/20",
    title: "Approvals & Policies",
    desc: "Define booking policies, set fee capacity limits, and automated approvals.",
    link: "Learn More →",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
      </svg>
    ),
    color: "bg-[rgb(var(--icon-yellow))]/15 text-yellow-400 border-yellow-500/20",
    title: "Scheduling Calendar",
    desc: "Visualize your calendar with views for day, week, or by floor. Sync with Google Calendar.",
    link: "Learn More →",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section-padding">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="section-label">Powerful Features</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold mb-5">
            Everything you need to manage your spaces.
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {features.map((f, i) => (
            <div key={i} className="card-feature group">
              {/* Icon */}
              <div className={`icon-circle ${f.color} border mb-5`}>
                {f.icon}
              </div>

              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed mb-4">{f.desc}</p>

              <a
                href="#facility-booking"
                className="inline-flex items-center text-sm font-semibold text-[rgb(var(--brand-hover))] hover:text-white transition-colors group/link"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("facility-booking")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {f.link}
                <svg className="ml-1 w-4 h-4 group-hover/link:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
