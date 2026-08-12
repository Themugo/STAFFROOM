import React, { useState } from 'react'
import {
  Calendar, Clock, CheckCircle2, AlertTriangle, FileText,
  UserCheck, Search, Filter, ShieldCheck, Scale
} from 'lucide-react'

const OBLIGATIONS = [
  {
    id: 'OBL-TAX-01',
    title: 'KRA Monthly PAYE & Withholding Tax Return Filing',
    type: 'Tax Statutory Requirement',
    jurisdiction: 'Kenya Revenue Authority',
    dueDate: '2026-08-09',
    assignee: 'Head of Payroll & Tax',
    status: 'IN_PROGRESS',
    penaltyRisk: 'KRA Statutory 25% Penalty + 1% Interest/mo'
  },
  {
    id: 'OBL-SHIF-02',
    title: 'Social Health Authority (SHIF) 2.75% Remittance',
    type: 'Healthcare Statutory Mandate',
    jurisdiction: 'Ministry of Health Kenya',
    dueDate: '2026-08-09',
    assignee: 'Payroll Officer',
    status: 'READY_TO_SUBMIT',
    penaltyRisk: 'Late Remittance Surcharge'
  },
  {
    id: 'OBL-NSSF-03',
    title: 'NSSF Retirement Tier I & Tier II Statutory Filing',
    type: 'Pension Statutory Mandate',
    jurisdiction: 'NSSF Board',
    dueDate: '2026-08-15',
    assignee: 'Payroll Officer',
    status: 'PENDING',
    penaltyRisk: '5% Monthly Surcharge'
  },
  {
    id: 'OBL-LIC-04',
    title: 'Nairobi City County Single Business Permit Renewal',
    type: 'Municipal License',
    jurisdiction: 'Nairobi County Govt',
    dueDate: '2026-12-31',
    assignee: 'Facilities Manager',
    status: 'COMPLIANT',
    penaltyRisk: 'Branch Closure Warning'
  }
]

export default function RegulatoryCalendarObligations() {
  const [obligations, setObligations] = useState(OBLIGATIONS)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Calendar size={13} className="text-amber-400" /> Statutory Calendar & Obligations Register
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Calendar className="text-amber-400" /> Regulatory Filing Calendar & Enterprise Obligations
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Centralized tracking of filing deadlines, tax returns (KRA, SHIF, NSSF), license renewals, external audits, and contractual obligations.
            </p>
          </div>
        </div>
      </div>

      {/* Obligations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {obligations.map((obl) => (
          <div
            key={obl.id}
            className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">{obl.id}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                Due: {obl.dueDate}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white">{obl.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Jurisdiction: <strong className="text-slate-800 dark:text-slate-200">{obl.jurisdiction}</strong>
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 flex justify-between font-mono">
              <span>Assignee: {obl.assignee}</span>
              <span className="text-rose-500 font-bold">{obl.penaltyRisk}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
