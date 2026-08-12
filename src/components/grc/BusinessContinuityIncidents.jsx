import React, { useState } from 'react'
import {
  ShieldAlert, RefreshCw, AlertTriangle, CheckCircle2,
  Clock, FileText, Search, Filter, ShieldCheck, Activity
} from 'lucide-react'

const CONTINUITY_PLANS = [
  {
    id: 'BCP-01',
    processName: 'Payroll Processing & Statutory Tax Remittance Engine',
    tier: 'TIER_1_CRITICAL',
    rto: '2 Hours', // Recovery Time Objective
    rpo: '15 Minutes', // Recovery Point Objective
    drLocation: 'Secondary Cloud Region (eu-west-1 & On-Prem Backup)',
    lastDrillDate: '2026-06-15',
    drillResult: 'PASSED (RTO achieved in 42 minutes)',
    owner: 'Head of IT & Payroll Systems'
  },
  {
    id: 'BCP-02',
    name: 'Mombasa Hub Logistics & Dispatch Telematics System',
    processName: 'Mombasa Logistics Dispatch & Route Management',
    tier: 'TIER_1_CRITICAL',
    rto: '4 Hours',
    rpo: '1 Hour',
    drLocation: 'Hot-Standby Cellular Failover Node',
    lastDrillDate: '2026-07-10',
    drillResult: 'PASSED (RTO achieved in 1 hr 15 mins)',
    owner: 'Head of Fleet Operations'
  },
  {
    id: 'BCP-03',
    processName: 'Biometric Time & Attendance Field Sync',
    tier: 'TIER_2_ESSENTIAL',
    rto: '12 Hours',
    rpo: '4 Hours',
    drLocation: 'Local Device Offline Cache & Re-sync Engine',
    lastDrillDate: '2026-05-20',
    drillResult: 'PASSED',
    owner: 'Facilities & Security Lead'
  }
]

export default function BusinessContinuityIncidents() {
  const [plans, setPlans] = useState(CONTINUITY_PLANS)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 w-fit mb-2">
              <ShieldAlert size={13} className="text-cyan-400" /> Business Continuity & Incident Response
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="text-cyan-400" /> Business Continuity (BCP), Disaster Recovery & Incident Management
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Critical process impact assessments (BIA), Recovery Time Objectives (RTO/RPO), disaster recovery drill results, operational incident logs, and post-incident lessons learned.
            </p>
          </div>
        </div>
      </div>

      {/* Continuity Cards */}
      <div className="space-y-3">
        {plans.map((p) => (
          <div
            key={p.id}
            className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-400">{p.id}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                  {p.tier}
                </span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {p.drillResult}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white">{p.processName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">DR Facility: <strong className="text-slate-800 dark:text-slate-200">{p.drLocation}</strong></p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-500 font-mono">
              <div>RTO Target: <strong className="text-cyan-600 dark:text-cyan-400">{p.rto}</strong></div>
              <div>RPO Target: <strong className="text-cyan-600 dark:text-cyan-400">{p.rpo}</strong></div>
              <div>Last DR Drill: <strong className="text-slate-800 dark:text-slate-200">{p.lastDrillDate}</strong></div>
              <div>Owner: <strong className="text-slate-800 dark:text-slate-200">{p.owner}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
