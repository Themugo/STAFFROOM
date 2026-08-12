import React from 'react';
import PublicNavbar from '../components/public/PublicNavbar';
import Footer from '../components/public/Footer';
import SEO from '../components/common/SEO';
import { SEO_CONFIG } from '../config/seo.config';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F6F9FD] text-[#102A43] font-sans">
      <SEO
        title={SEO_CONFIG.pages.privacy.title}
        description={SEO_CONFIG.pages.privacy.description}
        canonical={SEO_CONFIG.pages.privacy.canonical}
        breadcrumbs={[{ name: 'Home', item: '/' }, { name: 'Privacy Policy', item: '/privacy' }]}
      />
      <PublicNavbar />

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#DCE6F2] rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold mb-6">
            <ShieldCheck size={14} />
            <span>StaffRoom Enterprise Privacy Policy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#102A43] tracking-tight mb-4">
            Privacy Policy & Data Stewardship
          </h1>
          <p className="text-sm text-[#52677F] mb-8 font-medium">
            Last Updated: March 2026 • Compliant with GDPR, PDPA, and Kenyan Data Protection Act 2019
          </p>

          <div className="space-y-8 text-sm text-[#52677F] leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#102A43] flex items-center gap-2">
                <Lock size={18} className="text-[#2563EB]" />
                1. Information We Collect
              </h2>
              <p>
                StaffRoom collects personal and organizational data strictly necessary to provide workforce management, attendance tracking, payroll computation, and administrative services to enterprise tenants. This includes employee names, work emails, department assignments, biometric log records (where authorized), and salary parameters.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#102A43] flex items-center gap-2">
                <FileText size={18} className="text-[#2563EB]" />
                2. How We Process Enterprise Data
              </h2>
              <p>
                Data is processed solely on behalf of enterprise tenants under strict Role-Based Access Control (RBAC). StaffRoom does not sell, trade, or analyze employee data for third-party advertising. All processing activities adhere to strict organizational isolation and tenant boundary enforcement.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#102A43] flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#2563EB]" />
                3. Encryption & Security Controls
              </h2>
              <p>
                All data in transit is protected using TLS 1.3 encryption, and data at rest is secured via AES-256 standard encryption. Immutable audit trails log all administrative access, profile modifications, and statutory report generations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#102A43]">
                4. Contact Privacy Officer
              </h2>
              <p>
                For data access requests, DPA compliance inquiries, or security audit reports, contact our dedicated Data Protection Officer at <span className="text-[#2563EB] font-bold">privacy@staffroom.ai</span>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
