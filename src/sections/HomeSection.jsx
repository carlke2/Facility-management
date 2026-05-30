import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomeSection() {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[5%] left-[0%] w-[500px] h-[500px] bg-[rgb(var(--brand))/0.08] blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[0%] w-[400px] h-[400px] bg-[rgb(var(--brand-deep))/0.06] blur-[120px] rounded-full" />
      </div>

      <div className="container-wide px-5 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12">
        {/* Left — Copy */}
        <div>
          <span className="section-label">Facility Booking</span>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.12] mb-6 tracking-tight">
            Smarter room, desk, and{" "}
            <br className="hidden md:block" />
            resource booking.
            <br />
            <span className="text-brand-gradient">For every workplace.</span>
          </h1>

          <p className="text-base md:text-lg text-[rgb(var(--text-secondary))] leading-relaxed max-w-lg mb-8">
            Streamline how people, places, and assets are booked across your organization. Reduce no-shows, eliminate double bookings, and create better workplace experiences.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={() => navigate("/register")}
              className="btn-primary px-7 py-3.5 text-sm"
            >
              Request Demo
              <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button
              onClick={() => document.querySelector("#facility-booking")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-secondary px-7 py-3.5 text-sm"
            >
              Explore Platform
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-6 text-[rgb(var(--text-muted))]">
            {[
              { icon: "⚡", label: "Real-time Availability", sub: "See free and busy slots instantly" },
              { icon: "🛡️", label: "Policy & Compliance", sub: "Set rules and enforce policies" },
              { icon: "✨", label: "Seamless Experience", sub: "Book in seconds, not minutes" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[rgb(var(--surface-hover))] border border-[rgb(var(--border))] flex items-center justify-center text-sm flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[rgb(var(--text-primary))]">{item.label}</div>
                  <div className="text-[11px] text-[rgb(var(--text-muted))]">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Dashboard Mockup */}
        <div className="relative">
          <div className="card-premium p-3 lg:p-5 relative overflow-hidden">
            {/* Browser chrome */}
            <div className="rounded-xl overflow-hidden border border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
              {/* Title bar */}
              <div className="h-9 border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))] flex items-center px-4 gap-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded bg-[rgb(var(--bg))] text-[10px] text-[rgb(var(--text-muted))] font-medium border border-[rgb(var(--border))]">
                    Facility Booking
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-4 space-y-4">
                {/* Top bar */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[rgb(var(--brand))/0.2] flex items-center justify-center">
                      <div className="w-3 h-3 rounded bg-[rgb(var(--brand))]" />
                    </div>
                    <div className="text-xs font-semibold text-white">Facility Booking</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 px-3 rounded bg-[rgb(var(--surface-hover))] text-[10px] text-[rgb(var(--text-muted))] flex items-center font-medium">Today</div>
                    <div className="h-6 px-3 rounded bg-[rgb(var(--brand))/0.2] text-[10px] text-[rgb(var(--brand-hover))] flex items-center font-medium">+ New Booking</div>
                  </div>
                </div>

                {/* Metric cards */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: "Available Rooms", value: "12", color: "text-emerald-400" },
                    { label: "Booked Today", value: "8", color: "text-amber-400" },
                    { label: "Attendance Board", value: "94%", color: "text-[rgb(var(--brand-hover))]" },
                  ].map((m, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/50">
                      <div className="text-[9px] text-[rgb(var(--text-muted))] font-medium uppercase tracking-wider mb-1">{m.label}</div>
                      <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Schedule timeline */}
                <div className="p-3 rounded-lg bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/50">
                  <div className="text-[10px] text-[rgb(var(--text-muted))] font-semibold uppercase tracking-wider mb-3">Today's Schedule</div>
                  <div className="space-y-2">
                    {[
                      { time: "09:00", title: "Board Meeting", room: "Room A", status: "bg-emerald-500" },
                      { time: "11:00", title: "Sprint Planning", room: "Room B", status: "bg-[rgb(var(--brand))]" },
                      { time: "14:00", title: "Design Review", room: "Room C", status: "bg-amber-500" },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded bg-[rgb(var(--bg))] border border-[rgb(var(--border))]/30">
                        <div className={`w-1 h-8 rounded-full ${s.status}`} />
                        <div className="text-[10px] text-[rgb(var(--text-muted))] font-mono w-10">{s.time}</div>
                        <div className="flex-1">
                          <div className="text-[11px] font-semibold text-white">{s.title}</div>
                          <div className="text-[9px] text-[rgb(var(--text-muted))]">{s.room}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini chart */}
                <div className="p-3 rounded-lg bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/50">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-[10px] text-[rgb(var(--text-muted))] font-semibold uppercase tracking-wider">Utilization</div>
                    <div className="text-[10px] text-emerald-400 font-medium">+12%</div>
                  </div>
                  <div className="flex items-end gap-1.5 h-16">
                    {[35, 55, 40, 70, 50, 80, 60, 75, 45, 65, 85, 55].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm bg-[rgb(var(--brand))]/30 hover:bg-[rgb(var(--brand))]/60 transition-colors" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating element — top right */}
            <div className="absolute -right-3 top-16 card-premium p-3 w-44 shadow-2xl animate-float hidden lg:block" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-emerald-400 text-[10px]">✓</span>
                </div>
                <div className="text-[10px] font-semibold text-white">Booking Confirmed</div>
              </div>
              <div className="text-[9px] text-[rgb(var(--text-muted))]">Conference Room A — 2:00 PM</div>
            </div>

            {/* Floating element — bottom left */}
            <div className="absolute -left-3 bottom-20 card-premium p-3 w-40 shadow-2xl animate-float hidden lg:block" style={{ animationDelay: '1.5s' }}>
              <div className="text-[9px] uppercase font-bold text-[rgb(var(--text-muted))] mb-1.5 tracking-wider">Upcoming</div>
              <div className="text-[10px] font-semibold text-white mb-1">Design Sprint</div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[9px] text-amber-400 font-medium">In 30 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
