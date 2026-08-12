import React, { useState } from 'react'
import {
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, FileText,
  Activity, TrendingUp, Scale, AlertCircle, ShieldAlert, Zap,
  BarChart3, PieChart, Users, Building2, ChevronRight, Lock
} from 'lucide-react'

export default function GrcExecutiveCenter({ onNavigateTab }) {
  const [selectedPeriod, setSelectedPeriod] = useState('Q3-2026')

  return (
    <div className="space-y-6">
      {/* Executive GRC Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit mb-2">
              <ShieldCheck size={13} className="text-amber-400 animate-pulse" /> Enterprise Governance, Risk & Compliance Platform (GRC v2.5)
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="text-amber-400" /> Enterprise GRC Command Center
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time enterprise governance telemetry monitoring risk exposure, compliance posture, control effectiveness, internal audit findings, and segregation of duties.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-800/90 border border-slate-700 text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Org Risk Score</span>
              <span className="text-lg font-black font-mono text-emerald-400">84.2 / 100 (LOW)</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-slate-800/90 border border-slate-700 text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Compliance Index</span>
              <span className="text-lg font-black font-mono text-cyan-400">96.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigateTab && onNavigateTab('risk_register')}
          className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs hover:border-amber-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Active Risks</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">18 Registered</div>
            <p className="text-[11px] text-rose-500 font-bold mt-1">2 Critical • 4 High Severity</p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
            <span>Risk Treatment Plan</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-bold">89% Covered</strong>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab('controls_library')}
          className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs hover:border-emerald-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Control Effectiveness</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">91.8% Effective</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">142 Active Controls Tested</p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
            <span>Automated Controls</span>
            <strong className="text-slate-800 dark:text-slate-200 font-bold">64% Automated</strong>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab('internal_audit')}
          className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs hover:border-indigo-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Open Audit Findings</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <FileText size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">5 Findings</div>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold mt-1">1 High • 3 Medium • 1 Low</p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
            <span>Audit Plan Progress</span>
            <strong className="text-indigo-600 dark:text-indigo-400 font-bold">78% Completed</strong>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab('sod_engine')}
          className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs hover:border-rose-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">SoD Conflicts</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <Lock size={18} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">1 Flagged Conflict</div>
            <p className="text-[11px] text-rose-500 font-bold mt-1">Vendor Creation + Payment Approval</p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
            <span>Mitigating Control</span>
            <strong className="text-amber-500 font-bold">Dual Approval Active</strong>
          </div>
        </div>
      </div>

      {/* Quick Action Hub & Governance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Regulatory Deadlines */}
        <div className="lg:col-span-2 card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Clock size={16} className="text-amber-500" /> Upcoming Enterprise Regulatory Deadlines
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400">Q3 FY2026 Statutory Calendar</span>
          </div>

          <div className="space-y-3">
            {[
              { title: 'KRA Monthly PAYE & Withholding Tax Return', date: 'August 9, 2026', owner: 'Finance & Payroll', status: 'IN_PROGRESS', urgency: 'CRITICAL', daysLeft: '6 Days' },
              { title: 'Kenya SHIF (Social Health Authority) Contribution Remittance', date: 'August 9, 2026', owner: 'HR & Payroll', status: 'READY', urgency: 'HIGH', daysLeft: '6 Days' },
              { title: 'NSSF Retirement Benefits Statutory Filing', date: 'August 15, 2026', owner: 'Payroll Dept', status: 'PENDING', urgency: 'MEDIUM', daysLeft: '12 Days' },
              { title: 'ISO 27001 Annual Surveillance Audit Preparation', date: 'September 1, 2026', owner: 'InfoSec & Governance', status: 'ON_TRACK', urgency: 'HIGH', daysLeft: '28 Days' }
            ].map((reg, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{reg.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Due: {reg.date} • Owner: {reg.owner}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    {reg.daysLeft}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {reg.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance Health Breakdown */}
        <div className="card p-6 bg-slate-900 text-white border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Scale size={16} className="text-amber-400" /> Compliance Framework Health
          </h3>

          <div className="space-y-4">
            {[
              { name: 'Kenya Employment Act & Labour Laws', score: 98, status: 'COMPLIANT' },
              { name: 'KRA Tax & Statutory Regulations', score: 100, status: 'FULL' },
              { name: 'Data Protection & Privacy (DPA 2019)', score: 94, status: 'COMPLIANT' },
              { name: 'ISO 27001 Information Security', score: 92, status: 'READY' },
              { name: 'Public Procurement & Disposal Act', score: 96, status: 'COMPLIANT' }
            ].map((fw, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">{fw.name}</span>
                  <span className="font-mono text-emerald-400">{fw.score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${fw.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
