import React, { useState } from 'react';
import { Palette, Sliders, Layout, Globe, Check } from 'lucide-react';

export default function WhiteLabelSection() {
  const [activeBrand, setActiveBrand] = useState('enterprise');

  const brandPresets = {
    enterprise: {
      name: 'StaffRoom Default',
      color: '#2563EB',
      bg: '#EAF3FF',
      orgName: 'Apex Global Logistics',
      termStaff: 'Employees',
      termRoster: 'Shift Roster'
    },
    healthcare: {
      name: 'Avenue Healthcare',
      color: '#0F8F8C',
      bg: '#E6F7F7',
      orgName: 'Avenue Medical Center',
      termStaff: 'Medical Personnel',
      termRoster: 'Duty Schedule'
    },
    banking: {
      name: 'Capital Finance',
      color: '#159A68',
      bg: '#E6F4ED',
      orgName: 'Capital Commerce Bank',
      termStaff: 'Team Members',
      termRoster: 'Branch Roster'
    }
  };

  const current = brandPresets[activeBrand];

  const configurableList = [
    'Branding & Logo',
    'Brand Colors',
    'Custom Terminology',
    'Localization & Currency',
    'Navigation Structure',
    'Dashboard Layouts',
    'Custom Workflows',
  ];

  return (
    <section id="whitelabel" className="py-20 lg:py-28 bg-[#F6F9FD] text-[#102A43] border-b border-[#DCE6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-[#EAF3FF] border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
            WHITE LABEL & BRANDING
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#102A43]">
            YOUR ORGANIZATION. YOUR EXPERIENCE.
          </h2>
          <p className="text-base sm:text-lg text-[#52677F]">
            Configure your organization's branding, terminology, workflows and workspace experience while StaffRoom powers the platform underneath.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex justify-center gap-3">
          {Object.keys(brandPresets).map((key) => (
            <button
              key={key}
              onClick={() => setActiveBrand(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeBrand === key
                  ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                  : 'bg-white text-[#52677F] border-[#DCE6F2] hover:bg-[#EAF3FF]'
              }`}
            >
              {brandPresets[key].name}
            </button>
          ))}
        </div>

        {/* Interactive White-Label Interface Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Configurable items (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xl font-extrabold text-[#102A43]">
              Fully Configurable Experience
            </h3>
            <p className="text-sm text-[#52677F] leading-relaxed">
              Administrators can tailor the entire workspace to reflect corporate identity without touching code:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {configurableList.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-[#DCE6F2] text-xs font-bold text-[#102A43] flex items-center gap-2">
                  <Check size={14} className="text-[#2563EB] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Live Preview Card (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white border border-[#DCE6F2] shadow-xl overflow-hidden p-6 space-y-4">
              
              {/* Mock App Header in Custom Brand Color */}
              <div
                className="p-4 rounded-xl flex items-center justify-between text-white transition-colors"
                style={{ backgroundColor: current.color }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 font-black flex items-center justify-center text-xs">
                    {current.orgName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-extrabold text-sm block">{current.orgName}</span>
                    <span className="text-[10px] text-white/80 font-mono">Powered by StaffRoom</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-white/20 text-[11px] font-bold">
                  {current.termStaff}: 842
                </span>
              </div>

              {/* Terminology & Color Highlights */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] space-y-1">
                  <span className="text-[10px] text-[#7890A8] uppercase font-extrabold block">Custom Terminology</span>
                  <span className="text-xs font-extrabold text-[#102A43] block">{current.termRoster}</span>
                  <span className="text-[11px] text-[#52677F]">4 Active Shifts Today</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] space-y-1">
                  <span className="text-[10px] text-[#7890A8] uppercase font-extrabold block">Brand Palette</span>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="w-4 h-4 rounded-full border border-white shadow-2xs" style={{ backgroundColor: current.color }} />
                    <span className="text-xs font-mono font-bold text-[#102A43]">{current.color}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
