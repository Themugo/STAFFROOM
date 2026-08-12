import React from 'react';
import { ArrowRight, Sparkles, ChevronRight, Shield, CheckCircle2 } from 'lucide-react';
import ProductPreview from './ProductPreview';

export default function HeroSection({ onBookDemo }) {
  return (
    <section className="relative pt-28 lg:pt-36 pb-20 lg:pb-28 bg-[#F6F9FD] text-[#102A43] overflow-hidden border-b border-[#DCE6F2]">
      {/* Subtle Pale Blue Background Radial Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-[36rem] h-[36rem] bg-[#EAF3FF] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-10 w-[28rem] h-[28rem] bg-[#60A5FA]/10 rounded-full blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(to right, #2563EB 1px, transparent 1px), linear-gradient(to bottom, #2563EB 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content (52% on desktop => col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF3FF] border border-[#2563EB]/20 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              <Sparkles size={14} className="text-[#2563EB]" />
              <span>ENTERPRISE WORKFORCE INTELLIGENCE PLATFORM</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] leading-[1.1] font-black tracking-tight text-[#102A43]">
              ONE INTELLIGENT OPERATING SYSTEM <br className="hidden sm:inline" />
              <span className="text-[#2563EB]">FOR YOUR ORGANIZATION.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#52677F] max-w-2xl leading-relaxed">
              StaffRoom connects people, HR, operations, finance and workflows in one intelligent platform — giving every team the visibility and control they need to work better.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onBookDemo}
                className="px-7 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Book a Demo</span>
                <ArrowRight size={18} />
              </button>

              <a
                href="#platform"
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-[#EAF3FF] border border-[#DCE6F2] text-[#102A43] hover:text-[#2563EB] font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Explore StaffRoom</span>
                <ChevronRight size={18} className="text-[#2563EB]" />
              </a>
            </div>

            {/* Pillar Supporting Line */}
            <div className="pt-4 flex items-center gap-3 text-xs text-[#52677F] font-bold">
              <span className="flex items-center gap-1.5 text-[#102A43]">
                People
              </span>
              <span className="text-[#7890A8]">•</span>
              <span className="flex items-center gap-1.5 text-[#102A43]">
                Operations
              </span>
              <span className="text-[#7890A8]">•</span>
              <span className="flex items-center gap-1.5 text-[#102A43]">
                Finance
              </span>
              <span className="text-[#7890A8]">•</span>
              <span className="flex items-center gap-1.5 text-[#2563EB]">
                Intelligence
              </span>
            </div>
          </div>

          {/* Right Visualization (48% on desktop => col-span-5) */}
          <div className="lg:col-span-5 w-full">
            <ProductPreview />
          </div>

        </div>
      </div>
    </section>
  );
}
