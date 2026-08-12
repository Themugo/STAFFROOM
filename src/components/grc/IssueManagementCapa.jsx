import React, { useState } from 'react'
import {
  AlertCircle, ShieldAlert, CheckCircle2, RefreshCw,
  Search, Filter, Wrench, ChevronRight, FileText
} from 'lucide-react'

const ISSUES_DATA = [
  {
    id: 'ISS-2026-801',
    type: 'Audit Finding',
    title: 'Duplicate Vendor Bank Detail Entry Detected',
    source: 'Procurement Internal Audit',
    severity: 'HIGH',
    owner: 'Procurement Operations Lead',
    rootCause: 'Lack of automated IBAN uniqueness constraint in vendor registration wizard.',
    capaPlan: 'Enforce database unique constraint on vendor IBAN & bank account fields.',
    status: 'IN_REMEDIATION',
    dueDate: '2026-08-15'
  },
  {
    id: 'ISS-2026-802',
    type: 'Control Failure',
    title: 'Mombasa Warehouse Night Shift Overtime Exceeded Threshold',
    source: 'Control Testing (CTL-DET-201)',
    severity: 'CRITICAL',
    owner: 'Mombasa Warehouse Manager',
    rootCause: 'Absence of real-time cap check during manual roster entry.',
    capaPlan: 'Deploy automated hard cap in StaffRoom Shift Scheduling Engine.',
    status: 'CLOSED',
    dueDate: '2026-08-01'
  },
  {
    id: 'ISS-2026-803',
    type: 'Security Incident',
    title: 'Unusual Off-Hours Biometric Login in Kisumu Branch',
    source: 'Attendance Intelligence Monitor',
    severity: 'MEDIUM',
    owner: 'Kisumu Regional Security Officer',
    rootCause: 'Employee returned after hours to collect personal items without notifying security.',
    capaPlan: 'Issue reminder memo regarding off-hours facility access authorization policy.',
    status: 'CLOSED',
    dueDate: '2026-07-28'
  }
]

export default function IssueManagementCapa() {
  const [issues, setIssues] = useState(ISSUES_DATA)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 w-fit mb-2">
              <AlertCircle size={13} className="text-rose-400" /> Enterprise Issue Management & CAPA Engine
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Wrench className="text-rose-400" /> Issue Tracking, Root Cause Analysis & Corrective Actions (CAPA)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Track policy violations, control failures, audit findings, and security incidents. Conduct 5-Whys Root Cause Analysis and manage CAPA resolution workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {issues.map((iss) => {
          const isCritical = iss.severity === 'CRITICAL'
          const isHigh = iss.severity === 'HIGH'

          return (
            <div
              key={iss.id}
              className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{iss.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {iss.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isCritical ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : isHigh ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {iss.severity}
                  </span>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {iss.status}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">{iss.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Source: {iss.source} • Assignee: <strong className="text-slate-800 dark:text-slate-200">{iss.owner}</strong>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div>
                  <strong className="text-rose-600 dark:text-rose-400 font-bold block text-[10px] uppercase font-mono">5-Whys Root Cause:</strong>
                  <span className="text-slate-700 dark:text-slate-300">{iss.rootCause}</span>
                </div>
                <div>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold block text-[10px] uppercase font-mono">CAPA Action Plan:</strong>
                  <span className="text-slate-700 dark:text-slate-300">{iss.capaPlan}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[10px] font-mono text-slate-500">
                <span>Remediation Target Due: {iss.dueDate}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Verification Pending</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
