import React from 'react';
import { Bus, Smartphone, Mail, Layers, Globe } from 'lucide-react';

export default function KenyaOperationsSection() {
  const cards = [
    {
      title: 'TRANSPORT',
      icon: Bus,
      desc: 'Pickup points, employee residences, routes and daily transport planning for staff rosters and night shifts.'
    },
    {
      title: 'PAYMENTS',
      icon: Smartphone,
      desc: 'M-PESA-ready operational workflows for casual payouts, expense reimbursements, and statutory deductions.'
    },
    {
      title: 'COMMUNICATIONS',
      icon: Mail,
      desc: 'Instant SMS and email notifications ensuring duty changes, shift alerts, and approvals reach employees anywhere.'
    },
    {
      title: 'WORKFORCE OPERATIONS',
      icon: Layers,
      desc: 'Shifts, rosters, approvals and departmental workflows tailored for local statutory and operational realities.'
    },
  ];

  return (
    <section id="kenya-operations" className="py-20 lg:py-28 bg-[#F6F9FD] text-[#102A43] border-b border-[#DCE6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF3FF] border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
            <Globe size={14} />
            <span>LOCALIZATION & EXTENSIBILITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#102A43]">
            BUILT FOR HOW MODERN ORGANIZATIONS ACTUALLY OPERATE.
          </h2>
          <p className="text-base sm:text-lg text-[#52677F]">
            Kenya-ready out of the box, enterprise-capable across regions, and globally extensible for scaling organizations.
          </p>
        </div>

        {/* 4 Practical Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#DCE6F2] hover:border-[#2563EB] shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="p-3 rounded-xl bg-[#EAF3FF] text-[#2563EB] w-fit">
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-extrabold text-[#102A43]">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#52677F] leading-relaxed font-medium">
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
