import React from 'react';
import { Clock, Calendar, Bus, CheckSquare, ArrowRight } from 'lucide-react';

export default function OperationsSection() {
  const operations = [
    {
      title: 'ATTENDANCE',
      icon: Clock,
      subtitle: 'Real-time Attendance Tracking',
      description: 'Track attendance and workforce presence across physical sites, mobile check-ins, and shift transitions with tamper-resistant audit logs.',
      highlights: ['Biometric & QR mobile clock-ins', 'Geofenced site check-ins', 'Automated late arrival alerts']
    },
    {
      title: 'SHIFTS & DUTY ROSTERS',
      icon: Calendar,
      subtitle: 'Roster & Duty Optimization',
      description: 'Organize schedules, duties and team coverage. Resolve shift conflicts automatically before schedules go live.',
      highlights: ['Multi-department roster matrices', 'Instant shift swapping requests', 'Overtime threshold guardrails']
    },
    {
      title: 'TRANSPORT',
      icon: Bus,
      subtitle: 'Commute & Route Operations',
      description: 'Manage pickup points, employee residences, routes and daily transport planning for field teams and night shifts.',
      highlights: ['Employee pickup point mapping', 'Vehicle capacity & route planning', 'Driver assignment & trip logs']
    },
    {
      title: 'APPROVALS & WORKFLOWS',
      icon: CheckSquare,
      subtitle: 'Multi-level Process Automation',
      description: 'Automate requests, approvals and operational processes. Keep multi-tiered workflows moving without administrative bottlenecks.',
      highlights: ['Custom approval matrices', 'Parallel & sequential sign-offs', 'SLAs & automated escalations']
    },
  ];

  return (
    <section id="operations" className="py-20 lg:py-28 bg-[#F6F9FD] text-[#102A43] border-b border-[#DCE6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-[#EAF3FF] border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
            OPERATIONAL EXCELLENCE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#102A43]">
            TURN DAILY OPERATIONS INTO ONE CONNECTED WORKFLOW.
          </h2>
          <p className="text-base sm:text-lg text-[#52677F]">
            Streamline duty management, shift logistics, transport routes, and multi-tier sign-offs across your entire enterprise.
          </p>
        </div>

        {/* 4 Cards Grid (2x2 on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {operations.map((op, idx) => {
            const Icon = op.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-[#DCE6F2] hover:border-[#2563EB] shadow-xs hover:shadow-md transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-xl bg-[#EAF3FF] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB] bg-[#EAF3FF] px-2.5 py-1 rounded-lg">
                    {op.title}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#102A43] group-hover:text-[#2563EB] transition-colors">
                    {op.subtitle}
                  </h3>
                  <p className="mt-2 text-sm text-[#52677F] leading-relaxed">
                    {op.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#DCE6F2]">
                  <ul className="space-y-1.5 text-xs font-semibold text-[#52677F]">
                    {op.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
