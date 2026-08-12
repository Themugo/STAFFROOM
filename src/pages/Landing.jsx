import React, { useState } from 'react';
import PublicNavbar from '../components/public/PublicNavbar';
import HeroSection from '../components/public/HeroSection';
import TrustStrip from '../components/public/TrustStrip';
import CapabilityGrid from '../components/public/CapabilityGrid';
import AISection from '../components/public/AISection';
import OrganizationSection from '../components/public/OrganizationSection';
import OperationsSection from '../components/public/OperationsSection';
import SecuritySection from '../components/public/SecuritySection';
import WhiteLabelSection from '../components/public/WhiteLabelSection';
import KenyaOperationsSection from '../components/public/KenyaOperationsSection';
import FinalCTA from '../components/public/FinalCTA';
import Footer from '../components/public/Footer';
import SEO from '../components/common/SEO';
import { SEO_CONFIG } from '../config/seo.config';
import { X, CheckCircle2, Calendar, Send } from 'lucide-react';

export default function Landing() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    workforceSize: '100-500 staff',
  });

  const handleOpenDemo = () => {
    setDemoSubmitted(false);
    setDemoModalOpen(true);
  };

  const handleSubmitDemo = (e) => {
    e.preventDefault();
    setDemoSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F6F9FD] font-sans text-[#102A43] selection:bg-[#2563EB] selection:text-white">
      <SEO
        title={SEO_CONFIG.pages.home.title}
        description={SEO_CONFIG.pages.home.description}
        canonical={SEO_CONFIG.pages.home.canonical}
        ogType={SEO_CONFIG.pages.home.ogType}
      />
      {/* 1. Navigation */}
      <PublicNavbar onBookDemo={handleOpenDemo} />

      {/* 2. Hero & 3. Product Preview (embedded inside Hero) */}
      <HeroSection onBookDemo={handleOpenDemo} />

      {/* 4. Trust Strip */}
      <TrustStrip />

      {/* 5. Platform Capabilities */}
      <CapabilityGrid />

      {/* 6. AI Intelligence */}
      <AISection />

      {/* 7. Connected Departments */}
      <OrganizationSection />

      {/* 8. Operations */}
      <OperationsSection />

      {/* 9. Security */}
      <SecuritySection />

      {/* 10. White Label */}
      <WhiteLabelSection />

      {/* 11. Kenya-Ready Operations */}
      <KenyaOperationsSection />

      {/* 12. Final CTA */}
      <FinalCTA onBookDemo={handleOpenDemo} />

      {/* 13. Newsletter & 14. Footer */}
      <Footer />

      {/* Book a Demo Modal */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#DCE6F2] p-8 shadow-2xl text-[#102A43] space-y-6">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#7890A8] hover:text-[#102A43] hover:bg-[#F6F9FD] transition-colors"
            >
              <X size={20} />
            </button>

            {demoSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#159A68]/10 text-[#159A68] border border-[#159A68]/30 flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-black text-[#102A43]">Demo Requested!</h3>
                <p className="text-sm text-[#52677F] leading-relaxed max-w-sm mx-auto">
                  Thank you for your interest in StaffRoom Enterprise. Our solutions director will reach out within 2 hours.
                </p>
                <button
                  onClick={() => setDemoModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1d4ed8]"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                    <Calendar size={14} /> Schedule Executive Briefing
                  </div>
                  <h3 className="text-2xl font-black text-[#102A43]">Book a StaffRoom Demo</h3>
                  <p className="text-xs text-[#52677F]">
                    See how StaffRoom unifies workforce, HR, operations and finance for your organization.
                  </p>
                </div>

                <form onSubmit={handleSubmitDemo} className="space-y-4 text-xs font-medium">
                  <div className="space-y-1">
                    <label className="block font-bold text-[#102A43]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-4 py-3 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] text-sm text-[#102A43] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-[#102A43]">Work Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. s.jenkins@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] text-sm text-[#102A43] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-[#102A43]">Organization Name</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Mombasa Port Authority"
                      className="w-full px-4 py-3 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] text-sm text-[#102A43] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-[#102A43]">Workforce Size</label>
                    <select
                      value={formData.workforceSize}
                      onChange={(e) => setFormData({ ...formData, workforceSize: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] text-sm text-[#102A43] focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="50-100 staff">50 - 100 employees</option>
                      <option value="100-500 staff">100 - 500 employees</option>
                      <option value="500-2,000 staff">500 - 2,000 employees</option>
                      <option value="2,000+ staff">2,000+ enterprise scale</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Request Executive Briefing</span>
                    <Send size={15} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
