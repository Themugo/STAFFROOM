import React from 'react';
import { Users, Workflow, DollarSign, ShieldCheck, BrainCircuit, Check } from 'lucide-react';

export default function TrustStrip() {
  const pillars = [
    { name: 'PEOPLE', icon: Users },
    { name: 'OPERATIONS', icon: Workflow },
    { name: 'FINANCE', icon: DollarSign },
    { name: 'GOVERNANCE', icon: ShieldCheck },
    { name: 'INTELLIGENCE', icon: BrainCircuit },
  ];

  const trustStatements = [
    'Secure by design',
    'Role-based',
    'Audit-ready',
    'Kenya-ready',
    'Enterprise-ready',
  ];

  return (
    <div className="bg-white border-b border-[#DCE6F2] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Heading and Pillars */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#7890A8] shrink-0">
            BUILT FOR MODERN ENTERPRISES
          </span>

          <div className="hidden sm:block h-4 w-px bg-[#DCE6F2]" />

          <div className="flex items-center flex-wrap justify-center gap-2.5">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <span
                  key={p.name}
                  className="px-3 py-1 rounded-lg bg-[#F6F9FD] border border-[#DCE6F2] text-[#102A43] text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <Icon size={14} className="text-[#2563EB]" />
                  <span>{p.name}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Small Trust Statements */}
        <div className="flex items-center flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-bold text-[#52677F]">
          {trustStatements.map((stmt, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <Check size={14} className="text-[#159A68]" />
              <span>{stmt}</span>
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}
