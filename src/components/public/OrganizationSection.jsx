import React from 'react';
import { Network, Building2, Users, Briefcase, DollarSign, Laptop, Megaphone, Layers } from 'lucide-react';

export function OrganizationMap() {
  const departments = [
    { name: 'HR & People', icon: Users, kpi: '1,284 staff', desc: 'Lifecycle & Self-Service' },
    { name: 'Operations', icon: Building2, kpi: '12 active sites', desc: 'Rosters & Transport' },
    { name: 'Finance', icon: DollarSign, kpi: 'KSh 4.2M Payroll', desc: 'Tax & Disbursal' },
    { name: 'IT & Security', icon: Laptop, kpi: '99.9% Uptime', desc: 'RBAC & Audit' },
    { name: 'Marketing', icon: Megaphone, kpi: 'Brand Experience', desc: 'Asset CMS' },
    { name: 'Executive', icon: Briefcase, kpi: 'Real-time KPI', desc: 'Governance' },
  ];

  return (
    <div className="w-full p-8 rounded-3xl bg-white border border-[#DCE6F2] shadow-xl relative overflow-hidden">
      {/* Background connector grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Central Operating Layer */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 relative z-10 my-4">
        <div className="px-6 py-3 rounded-2xl bg-[#2563EB] text-white shadow-lg border border-[#3B82F6] flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white text-[#2563EB] font-black flex items-center justify-center text-sm">
            SR
          </div>
          <div className="text-left">
            <span className="block text-xs uppercase tracking-widest font-extrabold text-[#EAF3FF]">
              STAFFROOM CORE
            </span>
            <span className="text-base font-black tracking-tight">
              Single Operating System
            </span>
          </div>
        </div>
        <p className="text-xs font-bold text-[#52677F] max-w-md">
          Unified Data Layer • Shared RBAC • Real-time Cross-Departmental Visibility
        </p>
      </div>

      {/* Connector lines & Department Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 relative z-10">
        {departments.map((dept, i) => {
          const Icon = dept.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] hover:border-[#2563EB] transition-all hover:shadow-md group relative"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-white border border-[#DCE6F2] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                  <Icon size={18} />
                </div>
                <span className="px-2 py-0.5 rounded bg-[#EAF3FF] text-[#2563EB] text-[10px] font-mono font-bold">
                  {dept.kpi}
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-extrabold text-[#102A43] group-hover:text-[#2563EB] transition-colors">
                  {dept.name}
                </h4>
                <p className="text-xs text-[#52677F] font-medium">
                  {dept.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrganizationSection() {
  return (
    <section id="organization" className="py-20 lg:py-28 bg-[#F6F9FD] text-[#102A43] border-b border-[#DCE6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-[#EAF3FF] border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
            CROSS-DEPARTMENTAL ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#102A43]">
            ONE ORGANIZATION. EVERY DEPARTMENT CONNECTED.
          </h2>
          <p className="text-base sm:text-lg text-[#52677F]">
            Give every department its own operational workspace while maintaining organization-wide visibility, governance and security.
          </p>
        </div>

        {/* Map */}
        <OrganizationMap />

      </div>
    </section>
  );
}
