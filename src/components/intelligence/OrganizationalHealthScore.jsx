import React, { useState } from 'react'
import {
  Heart, ShieldCheck, DollarSign, Activity, Cpu, Users,
  Award, TrendingUp, ArrowUpRight, CheckCircle2, ChevronRight
} from 'lucide-react'

const HEALTH_DOMAINS = [
  { name: 'People & Culture Health', score: 92.4, status: 'EXCELLENT', weight: '20%', trend: '+1.8%', icon: Users, color: 'text-indigo-500' },
  { name: 'Financial & Payroll Health', score: 94.1, status: 'EXCELLENT', weight: '20%', trend: '+2.1%', icon: DollarSign, color: 'text-emerald-500' },
  { name: 'Operational & Fleet Health', score: 84.6, status: 'GOOD', weight: '15%', trend: '+0.5%', icon: Activity, color: 'text-amber-500' },
  { name: 'Compliance & Legal Health', score: 98.8, status: 'EXCELLENT', weight: '20%', trend: '+0.2%', icon: ShieldCheck, color: 'text-emerald-500' },
  { name: 'Technology & Security Health', score: 96.2, status: 'EXCELLENT', weight: '15%', trend: '+1.1%', icon: Cpu, color: 'text-cyan-500' },
  { name: 'Customer & Service Health', score: 88.0, status: 'GOOD', weight: '10%', trend: '+3.0%', icon: Heart, color: 'text-purple-500' }
]

export default function OrganizationalHealthScore() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Award size={13} className="text-emerald-400" /> Organizational Health Index Engine
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Award className="text-emerald-400" /> Enterprise Health Index & Domain Breakdown
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Composite organizational health score evaluating People, Financial, Operational, Statutory Compliance, Technology, and Service Delivery metrics.
            </p>
          </div>

          <div className="card p-4 bg-slate-800/90 border border-slate-700 rounded-2xl flex items-center gap-4 shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall Enterprise Health</span>
              <strong className="text-3xl font-mono font-black text-emerald-400">92.8 / 100</strong>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              GRADE A+
            </span>
          </div>
        </div>
      </div>

      {/* Domain Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HEALTH_DOMAINS.map((domain, i) => {
          const Icon = domain.icon

          return (
            <div key={i} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Weight: {domain.weight}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {domain.status}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  <Icon size={20} className={domain.color} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white">{domain.name}</h3>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-mono font-black text-slate-900 dark:text-white">{domain.score}</span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{domain.trend}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${domain.score}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
