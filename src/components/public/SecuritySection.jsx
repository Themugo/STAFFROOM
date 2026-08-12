import React from 'react';
import { Shield, Key, History, FileCheck, HardDrive, Lock, CheckCircle2 } from 'lucide-react';

export default function SecuritySection() {
  const securityCards = [
    {
      title: 'End-to-End Encryption',
      icon: Lock,
      desc: 'All sensitive workforce records, PII, and financial parameters encrypted at rest using AES-256 and in transit via TLS 1.3.'
    },
    {
      title: 'Role-Based Access Control',
      icon: Key,
      desc: 'Granular permissions restricting data view and mutation by tenant, department, role, and custom authorization matrices.'
    },
    {
      title: 'Audit Logs',
      icon: History,
      desc: 'Tamper-evident audit logging capturing user, IP, action, timestamp, and payload changes for complete governance transparency.'
    },
    {
      title: 'Compliance-Ready Architecture',
      icon: FileCheck,
      desc: 'Designed for GDPR requirements, Kenya Data Protection Act (PDPA)-ready architecture, and enterprise compliance controls.'
    },
    {
      title: 'Automated Backups',
      icon: HardDrive,
      desc: 'Point-in-time recovery and continuous automated database snapshotting ensuring zero unrecoverable data loss.'
    },
    {
      title: 'Multi-Tenancy Isolation',
      icon: Shield,
      desc: 'Strict multi-tenant cryptographic and relational database separation preventing cross-tenant data leakage.'
    },
  ];

  const techBadges = [
    'AES-256 Encryption',
    'TLS 1.3 Transport',
    'Role-Based Access Control',
    'Tamper-Evident Audit Logging',
    'Point-in-Time Recovery',
  ];

  return (
    <section id="security" className="py-20 lg:py-28 bg-[#F6F9FD] text-[#102A43] border-b border-[#DCE6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-[#EAF3FF] border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
            ENTERPRISE GOVERNANCE & SECURITY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#102A43]">
            YOUR WORKFORCE DATA DESERVES ENTERPRISE-GRADE PROTECTION.
          </h2>
          <p className="text-base sm:text-lg text-[#52677F]">
            Built with strict data governance, field-level security controls, and transparent audit logging at every layer.
          </p>
        </div>

        {/* 6 Security Cards (3x2 grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityCards.map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#DCE6F2] hover:border-[#2563EB] shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="p-3 rounded-xl bg-[#EAF3FF] text-[#2563EB] w-fit">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-extrabold text-[#102A43]">
                  {sc.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#52677F] leading-relaxed font-medium">
                  {sc.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tech Strip */}
        <div className="pt-6 border-t border-[#DCE6F2] flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#7890A8] mr-2">
            Built-In Security Controls:
          </span>
          {techBadges.map((badge, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#DCE6F2] text-[#102A43] text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <CheckCircle2 size={14} className="text-[#159A68]" />
              <span>{badge}</span>
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
