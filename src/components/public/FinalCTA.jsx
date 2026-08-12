import React from 'react';
import { ArrowRight, PhoneCall, CheckCircle2 } from 'lucide-react';

export default function FinalCTA({ onBookDemo }) {
  return (
    <section className="py-20 lg:py-28 bg-[#EAF3FF] border-b border-[#DCE6F2] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-white border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
            GET STARTED WITH STAFFROOM
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-black tracking-tight text-[#102A43] leading-tight">
            READY TO RUN YOUR ORGANIZATION <br className="hidden sm:inline" />
            FROM ONE INTELLIGENT PLATFORM?
          </h2>
          <p className="text-base sm:text-lg text-[#52677F] max-w-2xl mx-auto">
            Connect your people, operations and workflows with StaffRoom.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onBookDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Book a Demo</span>
            <ArrowRight size={18} />
          </button>

          <a
            href="mailto:sales@staffroom.co.ke"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-[#F6F9FD] border border-[#DCE6F2] text-[#102A43] font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <PhoneCall size={18} className="text-[#2563EB]" />
            <span>Talk to Sales</span>
          </a>
        </div>

        {/* Supporting Bullet List */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-[#52677F]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-[#159A68]" />
            <span>No long-term lock-in</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-[#159A68]" />
            <span>Dedicated onboarding engineer</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-[#159A68]" />
            <span>Kenya statutory compliance guaranteed</span>
          </span>
        </div>

      </div>
    </section>
  );
}
