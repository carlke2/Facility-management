import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ["home", "facility-booking", "support-ticketing", "about", "insights", "contact"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#home", id: "home" },
    { label: "Facility Booking", href: "#facility-booking", id: "facility-booking" },
    { label: "Support Ticketing", href: "#support-ticketing", id: "support-ticketing" },
    { label: "About", href: "#about", id: "about" },
    { label: "Insights", href: "#insights", id: "insights" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[rgb(var(--bg))/0.92] backdrop-blur-xl border-b border-[rgb(var(--border))] py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-wide px-5 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-[rgb(var(--brand-hover))] to-[rgb(var(--brand-deep))] rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-white">OpsHub</span>
            <span className="text-[9px] font-semibold text-[rgb(var(--text-muted))] uppercase tracking-[0.15em]">Facility · HR · Support</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all duration-200 ${
                activeSection === item.id
                  ? "text-white bg-[rgb(var(--surface-hover))]"
                  : "text-[rgb(var(--text-secondary))] hover:text-white hover:bg-[rgb(var(--surface))/0.5]"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthed ? (
            <div className="flex items-center gap-3">
              <Link
                to="/app"
                className="hidden sm:inline-flex text-[13px] font-medium text-[rgb(var(--text-secondary))] hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-[rgb(var(--surface-hover))] text-white text-[13px] font-medium border border-[rgb(var(--border))] hover:border-[rgb(var(--danger))/0.4] hover:text-[rgb(var(--danger))] transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="hidden sm:inline-flex text-[13px] font-medium text-[rgb(var(--text-secondary))] hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <button
                onClick={() => navigate("/register")}
                className="btn-primary text-[13px] px-5 py-2.5"
              >
                Request Demo
                <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[rgb(var(--text-secondary))] hover:text-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12"/>
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[rgb(var(--bg))/0.98] backdrop-blur-xl border-t border-[rgb(var(--border))] mt-2">
          <div className="container-wide px-5 py-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "text-white bg-[rgb(var(--surface-hover))]"
                    : "text-[rgb(var(--text-secondary))] hover:text-white hover:bg-[rgb(var(--surface))]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
