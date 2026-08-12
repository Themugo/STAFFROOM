import React from 'react';
import PublicNavbar from '../components/public/PublicNavbar';
import Footer from '../components/public/Footer';
import SEO from '../components/common/SEO';
import { SEO_CONFIG } from '../config/seo.config';
import { FileText, Shield, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F6F9FD] text-[#102A43] font-sans">
      <SEO
        title={SEO_CONFIG.pages.terms.title}
        description={SEO_CONFIG.pages.terms.description}
        canonical={SEO_CONFIG.pages.terms.canonical}
        breadcrumbs={[{ name: 'Home', item: '/' }, { name: 'Terms of Service', item: '/terms' }]}
      />
      <PublicNavbar />

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#DCE6F2] rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold mb-6">
            <FileText size={14} />
            <span>StaffRoom Master Subscription Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#102A43] tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-[#52677F] mb-8 font-medium">
            Effective Date: March 2026 • Enterprise License & Service Level Agreement
          </p>

          <div className="space-y-8 text-sm text-[#52677F] leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#102A43] flex items-center gap-2">
                <Shield size={18} className="text-[#2563EB]" />
                1. Acceptance of Enterprise Terms
              </h2>
              <p>
                By subscribing to or accessing the StaffRoom Enterprise Operating Platform, organizations agree to abide by these Terms of Service and applicable service level agreements (SLAs). Account provision is restricted to authorized enterprise representatives.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#102A43] flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#2563EB]" />
                2. Platform Service Availability (99.99% Uptime)
              </h2>
              <p>
                StaffRoom guarantees 99.99% operational availability for production tenants, backed by multi-region Cloud infrastructure and active failover routines. Scheduled maintenance windows are communicated at least 72 hours in advance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#102A43]">
                3. Acceptable Usage & Multi-Tenant Boundaries
              </h2>
              <p>
                Tenants are prohibited from attempting reverse-engineering, unauthorized privilege escalation, or uploading malicious software vectors. Multi-tenant boundaries are enforced at the schema and application levels.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#102A43]">
                4. Governance & Dispute Resolution
              </h2>
              <p>
                This agreement is governed by standard commercial enterprise arbitration rules. For legal notices, reach out to <span className="text-[#2563EB] font-bold">legal@staffroom.ai</span>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
