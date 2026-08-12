import React from 'react';
import { Users, Clock, DollarSign, AlertCircle, ArrowUpRight, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

export default function ProductPreview() {
  return (
    <div className="w-full rounded-2xl bg-white border border-[#DCE6F2] shadow-xl overflow-hidden text-[#102A43] font-sans">
      {/* App Header Bar */}
      <div className="px-5 py-3.5 bg-[#F6F9FD] border-b border-[#DCE6F2] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
          </div>
          <div className="h-4 w-px bg-[#DCE6F2] mx-1" />
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#2563EB] text-white text-[11px] font-black tracking-wide">
              StaffRoom
            </span>
            <span className="text-xs font-bold text-[#52677F]">
              Executive Command
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#159A68] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#159A68]"></span>
          </span>
          <span className="text-[11px] font-mono font-bold text-[#159A68] uppercase tracking-wider">
            Live System
          </span>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="p-5 space-y-4">
        {/* Top 3 Core Metrics */}
        <div className="grid grid-cols-3 gap-3">
          {/* Metric 1 */}
          <div className="p-3.5 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] space-y-1">
            <div className="flex items-center justify-between text-[#52677F] text-[11px] font-bold">
              <span>WORKFORCE</span>
              <Users size={13} className="text-[#2563EB]" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-[#102A43]">1,284</span>
              <span className="text-[10px] font-bold text-[#159A68]">+4%</span>
            </div>
            <p className="text-[10px] text-[#7890A8] truncate">across 12 sites</p>
          </div>

          {/* Metric 2 */}
          <div className="p-3.5 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] space-y-1">
            <div className="flex items-center justify-between text-[#52677F] text-[11px] font-bold">
              <span>ATTENDANCE</span>
              <Clock size={13} className="text-[#159A68]" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-[#102A43]">94.2%</span>
              <span className="text-[10px] font-bold text-[#159A68]">On Track</span>
            </div>
            <p className="text-[10px] text-[#7890A8] truncate">shift validation active</p>
          </div>

          {/* Metric 3 */}
          <div className="p-3.5 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] space-y-1">
            <div className="flex items-center justify-between text-[#52677F] text-[11px] font-bold">
              <span>PAYROLL</span>
              <DollarSign size={13} className="text-[#2563EB]" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-[#102A43]">KSh 4.2M</span>
              <span className="text-[10px] font-bold text-[#2563EB]">Verified</span>
            </div>
            <p className="text-[10px] text-[#7890A8] truncate">KRA iTax P10 verified</p>
          </div>
        </div>

        {/* Workforce Health Trend Chart */}
        <div className="p-4 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-[#102A43] flex items-center gap-1.5">
              <TrendingUp size={14} className="text-[#2563EB]" /> Workforce Health
            </span>
            <span className="text-[10px] font-mono text-[#7890A8]">Real-time Sync</span>
          </div>

          <div className="h-20 w-full relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,45 Q 50,15 100,30 T 200,20 T 300,10 L 300,60 L 0,60 Z"
                fill="url(#chartGradLight)"
              />
              <path
                d="M 0,45 Q 50,15 100,30 T 200,20 T 300,10"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
              />
              <circle cx="300" cy="10" r="4" fill="#3B82F6" />
            </svg>
          </div>
        </div>

        {/* Needs Attention Panel */}
        <div className="p-4 rounded-xl bg-white border border-[#DCE6F2] space-y-2.5">
          <div className="flex items-center justify-between text-xs font-extrabold text-[#102A43]">
            <span className="flex items-center gap-1.5 text-[#D98B00]">
              <AlertCircle size={14} /> Needs Attention
            </span>
            <span className="text-[10px] text-[#7890A8] font-semibold">3 Action Items</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="p-2 rounded-lg bg-[#F6F9FD] border border-[#DCE6F2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D98B00]" />
                <span className="text-[#102A43] font-semibold">Payroll Variance (+2.1% overtime in Mombasa hub)</span>
              </div>
              <span className="text-[10px] text-[#2563EB] font-bold cursor-pointer hover:underline">Review</span>
            </div>

            <div className="p-2 rounded-lg bg-[#F6F6FD] border border-[#DCE6F2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D94B61]" />
                <span className="text-[#102A43] font-semibold">Overtime Anomaly (Shift 3 night roster)</span>
              </div>
              <span className="text-[10px] text-[#2563EB] font-bold cursor-pointer hover:underline">Resolve</span>
            </div>

            <div className="p-2 rounded-lg bg-[#F6F9FD] border border-[#DCE6F2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#159A68]" />
                <span className="text-[#102A43] font-semibold">Leave Approval (4 executive sign-offs pending)</span>
              </div>
              <span className="text-[10px] text-[#2563EB] font-bold cursor-pointer hover:underline">Approve</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
