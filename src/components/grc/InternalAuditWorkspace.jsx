import React, { useState } from 'react'
import {
  FileText, FolderKanban, CheckCircle2, AlertTriangle, Search,
  Filter, Plus, Download, Eye, Clock, ShieldCheck, UserCheck
} from 'lucide-react'

const AUDIT_ENGAGEMENTS = [
  {
    id: 'AUD-2026-01',
    title: 'Mombasa Logistics Hub Overtime & Shift Allowance Audit',
    universeArea: 'Transport & Fleet Logistics',
    leadAuditor: 'Senior Internal Auditor (Internal Audit Team)',
    period: 'Q2-2026',
    status: 'FIELDWORK_COMPLETE',
    findingsCount: 3,
    highRiskCount: 1,
    recommendations: 'Automate biometric night shift log validation against dispatch orders.',
    mgmtResponse: 'Management accepted recommendation. System automation deployed in August 2026.'
  },
  {
    id: 'AUD-2026-02',
    title: 'Payroll Tax & Statutory Deduction Reconciliation Audit (KRA/SHIF)',
    universeArea: 'Finance & Human Resources',
    leadAuditor: 'Head of Internal Audit',
    period: 'Q3-2026',
    status: 'IN_PROGRESS',
    findingsCount: 1,
    highRiskCount: 0,
    recommendations: 'Ensure SHIF 2.75% formula aligns with newly published Gazette guidelines.',
    mgmtResponse: 'In progress - Payroll engine updated and verified.'
  },
  {
    id: 'AUD-2026-03',
    title: 'Vendor Onboarding & Bank Account Verification Audit',
    universeArea: 'Procurement & Finance',
    leadAuditor: 'IT Audit Specialist',
    period: 'Q3-2026',
    status: 'REPORT_ISSUED',
    findingsCount: 2,
    highRiskCount: 1,
    recommendations: 'Require dual approval for all vendor IBAN/Bank account modifications.',
    mgmtResponse: 'Dual approval control enforced in StaffRoom Procurement Module.'
  }
]

export default function InternalAuditWorkspace() {
  const [engagements, setEngagements] = useState(AUDIT_ENGAGEMENTS)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 w-fit mb-2">
              <FolderKanban size={13} className="text-indigo-400" /> Enterprise Internal Audit Workspace
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <FileText className="text-indigo-400" /> Annual Audit Plan, Working Papers & Recommendations
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Audit universe coverage, field work management, working papers, evidence repository, audit committee reporting, and management response tracking.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-4 py-2 rounded-2xl bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/30">
              78% Annual Audit Plan Execution Rate
            </span>
          </div>
        </div>
      </div>

      {/* Engagements List */}
      <div className="space-y-4">
        {engagements.map((aud) => (
          <div
            key={aud.id}
            className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-400">{aud.id}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {aud.universeArea}
                </span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {aud.status}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">{aud.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Lead Auditor: <strong className="text-slate-800 dark:text-slate-200">{aud.leadAuditor}</strong> • Audit Period: {aud.period}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div>
                <strong className="text-indigo-600 dark:text-indigo-400 font-bold block">Audit Finding & Key Recommendation:</strong>
                <span className="text-slate-700 dark:text-slate-300">{aud.recommendations}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold block">Management Official Response:</strong>
                <span className="text-slate-700 dark:text-slate-300">{aud.mgmtResponse}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[10px] font-mono text-slate-500">
              <span>Total Audit Findings: {aud.findingsCount}</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">High Severity Findings: {aud.highRiskCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
