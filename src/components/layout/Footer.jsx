import React from "react";

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "Facility Booking", href: "#facility-booking" },
      { label: "Support Ticketing", href: "#support-ticketing" },
      { label: "HR Module", href: "#about" },
      { label: "Integrations", href: "#insights" },
      { label: "Security", href: "#about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Insights", href: "#insights" },
      { label: "Blog", href: "#" },
      { label: "Case Studies", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "System Status", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#" },
      { label: "Partners", href: "#" },
      { label: "Newsroom", href: "#" },
      { label: "Contact Us", href: "#contact" },
    ],
  },
];

const socialLinks = [
  {
    label: "LinkedIn",
    abbr: "in",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Twitter",
    abbr: "X",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    abbr: "gh",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const handleNavClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-[rgb(var(--bg))] border-t border-[rgb(var(--border))] pt-16 pb-8">
      <div className="container-wide px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-[rgb(var(--brand-hover))] to-[rgb(var(--brand-deep))] rounded-lg flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-tight text-white">OpsHub</span>
                <span className="text-[9px] font-semibold text-[rgb(var(--text-muted))] uppercase tracking-[0.12em]">Facility · HR · Support</span>
              </div>
            </div>
            <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed mb-6 max-w-sm">
              The enterprise operations platform that unifies HR, facility management, and support operations under one roof.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-[rgb(var(--surface))] border border-[rgb(var(--border))] flex items-center justify-center text-[rgb(var(--text-muted))] hover:text-white hover:border-[rgb(var(--border-light))] transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section, i) => (
            <div key={i}>
              <h4 className="text-sm font-bold text-white mb-5">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-sm text-[rgb(var(--text-secondary))] hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[rgb(var(--border))] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[rgb(var(--text-muted))]">
            © {new Date().getFullYear()} OpsHub, Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, i) => (
              <a key={i} href="#" className="text-xs text-[rgb(var(--text-muted))] hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
