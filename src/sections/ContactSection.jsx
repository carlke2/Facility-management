import React from "react";
import { useNavigate } from "react-router-dom";

export default function ContactSection() {
  const navigate = useNavigate();

  return (
    <section id="contact" className="section-padding">
      <div className="container-wide">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[rgb(var(--surface))] via-[rgb(var(--bg-alt))] to-[rgb(var(--surface))] border border-[rgb(var(--border))] p-10 md:p-14 lg:p-20">
          {/* Background glow */}
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[rgb(var(--brand))/0.06] blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[rgb(var(--brand-deep))/0.05] blur-[100px] rounded-full pointer-events-none" />

          {/* Decorative icon */}
          <div className="absolute top-6 right-8 hidden lg:flex items-center gap-2 opacity-10">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <span className="section-label mb-4 inline-block">Get Started</span>

            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold mb-6 leading-tight">
              Ready to transform how your{" "}
              <br className="hidden md:block" />
              team books and works?
            </h2>

            <p className="text-base md:text-lg text-[rgb(var(--text-secondary))] mb-10 leading-relaxed max-w-2xl mx-auto">
              See how Facility Booking can help you maximize space, save time, and create better workplace experiences.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-14">
              <button
                onClick={() => navigate("/register")}
                className="btn-primary px-8 py-4 text-sm"
              >
                Request Demo
                <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button
                onClick={() => navigate("/login")}
                className="btn-secondary px-8 py-4 text-sm"
              >
                Talk to an Expert
              </button>
            </div>

            {/* Contact Details */}
            <div className="pt-10 border-t border-[rgb(var(--border))] grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  label: "Email Us",
                  value: "hello@opshub.com",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  ),
                },
                {
                  label: "Call Us",
                  value: "+1 (800) 123-4567",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  ),
                },
                {
                  label: "Visit Us",
                  value: "123 Innovation Drive, SF",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                },
              ].map((contact, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-[rgb(var(--surface-hover))] border border-[rgb(var(--border))] flex items-center justify-center text-[rgb(var(--brand-hover))] mb-3">
                    {contact.icon}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[rgb(var(--text-muted))] mb-1">{contact.label}</div>
                  <div className="text-sm font-semibold text-white">{contact.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
