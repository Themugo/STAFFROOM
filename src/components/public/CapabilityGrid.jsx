import React from 'react';
import { Users, Workflow, DollarSign, BrainCircuit, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';

export function CapabilityCard({ title, icon: Icon, description, badge, list }) {
  return (
    <div className="group p-7 rounded-2xl bg-white border border-[#DCE6F2] hover:border-[#2563EB] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-xl bg-[#EAF3FF] text-[#2563EB] group-hover:scale-105 transition-transform">
            <Icon size={22} />
          </div>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#2563EB] text-[10px] font-bold uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-[#102A43] group-hover:text-[#2563EB] transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-sm text-[#52677F] leading-relaxed">
            {description}
          </p>
        </div>

        {list && (
          <ul className="pt-2 space-y-1.5 text-xs font-semibold text-[#52677F] border-t border-[#DCE6F2]/80">
            {list.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-4 flex items-center gap-1 text-xs font-bold text-[#2563EB] group-hover:translate-x-1 transition-transform">
        <span>Explore Module</span>
        <ArrowRight size={14} />
      </div>
    </div>
  );
}

export default function CapabilityGrid() {
  const capabilities = [
    {
      title: 'People',
      icon: Users,
      badge: 'Workforce Core',
      description: 'Employee lifecycle, workforce directory and self-service.',
      list: ['Digital onboarding & offboarding', 'Central staff directory & org charts', 'Self-service claims & requests']
    },
    {
      title: 'Operations',
      icon: Workflow,
      badge: 'Execution Layer',
      description: 'Shifts, duty rosters, transport and operational workflows.',
      list: ['Multi-site duty roster management', 'Shift swapping & attendance verification', 'Route-optimized employee transport']
    },
    {
      title: 'Finance',
      icon: DollarSign,
      badge: 'Statutory & Payroll',
      description: 'Payroll, budgets, procurement and financial visibility.',
      list: ['KRA iTax P10, NSSF & SHIF compliance', 'Automated M-PESA & bank disbursal', 'Departmental budget variance tracking']
    },
    {
      title: 'Intelligence',
      icon: BrainCircuit,
      badge: 'AI & Analytics',
      description: 'AI, analytics, forecasting and actionable insights.',
      list: ['Conversational AI HR assistant', 'Overtime & burn-out risk indicators', 'Real-time executive KPI dashboards']
    },
    {
      title: 'Collaboration',
      icon: MessageSquare,
      badge: 'Team Workflows',
      description: 'Approvals, tasks, documents and communications.',
      list: ['Configurable approval matrix', 'Digital signature collection', 'Company-wide announcement hub']
    },
    {
      title: 'Governance',
      icon: ShieldCheck,
      badge: 'Enterprise Control',
      description: 'Security, policies, audit and enterprise controls.',
      list: ['Field-level RLS authorization', 'Tamper-evident audit logging', 'Point-in-time database recovery']
    },
  ];

  return (
    <section id="platform" className="py-20 lg:py-28 bg-[#F6F9FD] border-b border-[#DCE6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-[#EAF3FF] border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
            CONNECTED PLATFORM ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#102A43]">
            EVERYTHING YOUR ORGANIZATION RUNS — CONNECTED.
          </h2>
          <p className="text-base sm:text-lg text-[#52677F]">
            StaffRoom brings workforce management, operations, finance, workflows and intelligence together in one secure operating layer.
          </p>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <CapabilityCard key={cap.title} {...cap} />
          ))}
        </div>

      </div>
    </section>
  );
}
