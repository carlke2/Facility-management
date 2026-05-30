import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HomeSection from "../sections/HomeSection";
import BenefitsSection from "../sections/BenefitsSection";
import FeaturesSection from "../sections/FeaturesSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import FacilityBookingSection from "../sections/FacilityBookingSection";
import SupportTicketingSection from "../sections/SupportTicketingSection";
import HumanResourceSection from "../sections/HumanResourceSection";
import AboutSection from "../sections/AboutSection";
import InsightsSection from "../sections/InsightsSection";
import ContactSection from "../sections/ContactSection";

export default function Landing() {
  return (
    <div className="bg-[rgb(var(--bg))] text-[rgb(var(--text-primary))]">
      <Navbar />
      <main>
        {/* 1. Hero */}
        <HomeSection />

        {/* 2. Benefits — "Benefits that drive impact" */}
        <BenefitsSection />

        {/* 3. Features Grid — "Everything you need to manage your spaces" */}
        <FeaturesSection />

        {/* Divider */}
        <div className="section-divider" />

        {/* 4. How It Works — "From request to check-in" */}
        <HowItWorksSection />

        {/* 5. Live Facility Booking Module */}
        <FacilityBookingSection />

        {/* Divider */}
        <div className="section-divider" />

        {/* 6. Support Ticketing (Coming Soon) */}
        <SupportTicketingSection />

        {/* 7. HR Module (Planned) */}
        <HumanResourceSection />

        {/* 8. About / Why OpsHub */}
        <AboutSection />

        {/* Divider */}
        <div className="section-divider" />

        {/* 9. Insights & Analytics */}
        <InsightsSection />

        {/* 10. CTA / Contact */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
