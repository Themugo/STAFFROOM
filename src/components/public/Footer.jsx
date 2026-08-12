import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const footerGroups = [
    {
      title: 'Platform',
      links: [
        { label: 'Workforce Core', href: '#platform' },
        { label: 'Operations & Rosters', href: '#operations' },
        { label: 'Payroll & Statutory', href: '#platform' },
        { label: 'Transport Logistics', href: '#operations' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Cross-Department Map', href: '#organization' },
        { label: 'Healthcare & Duty Roster', href: '#whitelabel' },
        { label: 'Logistics & Shift Management', href: '#operations' },
        { label: 'White-Label Branding', href: '#whitelabel' },
      ],
    },
    {
      title: 'AI & Intelligence',
      links: [
        { label: 'StaffRoom AI Copilot', href: '#ai' },
        { label: 'Burnout Risk Models', href: '#ai' },
        { label: 'Predictive Analytics', href: '#ai' },
        { label: 'Natural Language Queries', href: '#ai' },
      ],
    },
    {
      title: 'Security',
      links: [
        { label: 'Security Architecture', href: '#security' },
        { label: 'Role-Based Access (RBAC)', href: '#security' },
        { label: 'Tamper-Evident Audit Logs', href: '#security' },
        { label: 'GDPR & PDPA Readiness', href: '#security' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Kenya Operations Guide', href: '#kenya-operations' },
        { label: 'System Status', href: '#' },
        { label: 'Documentation', href: '#' },
        { label: 'API Reference', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About StaffRoom', href: '/AboutPage' },
        { label: 'Careers', href: '#' },
        { label: 'Contact Sales', href: '#' },
        { label: 'Blog & News', href: '/BlogPage' },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-[#DCE6F2] text-[#102A43]">
      
      {/* Newsletter Bar immediately above main footer */}
      <div className="bg-[#F6F9FD] border-b border-[#DCE6F2] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-black text-[#102A43]">
              STAY IN THE LOOP
            </h3>
            <p className="text-xs sm:text-sm text-[#52677F]">
              Product updates, HR insights and practical workforce ideas — delivered monthly.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center gap-2">
            {subscribed ? (
              <div className="px-4 py-2.5 rounded-xl bg-[#159A68]/10 text-[#159A68] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#DCE6F2] text-xs text-[#102A43] placeholder-[#7890A8] focus:outline-none focus:border-[#2563EB] w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <Send size={13} />
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8">
          
          {/* Brand Info (2 cols) */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white font-black text-sm">
                SR
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[#102A43]">
                StaffRoom
              </span>
            </Link>
            <p className="text-xs text-[#52677F] max-w-sm leading-relaxed">
              Enterprise Workforce Intelligence Platform connecting people, HR, operations, finance, and AI workflows.
            </p>
          </div>

          {/* Link Groups */}
          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-xs font-extrabold text-[#102A43] uppercase tracking-wider">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-[#52677F] hover:text-[#2563EB] font-medium transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-8 border-t border-[#DCE6F2] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7890A8] font-medium">
          <div>
            © 2026 StaffRoom. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#2563EB] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#2563EB] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#2563EB] transition-colors">Security Overview</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
