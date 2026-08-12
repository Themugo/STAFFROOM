import React, { useState } from 'react'
import {
  Scale, ShieldCheck, CheckCircle2, AlertTriangle, FileText,
  Building2, Layers, Search, Filter, Plus, ChevronRight
} from 'lucide-react'

const FRAMEWORKS = [
  {
    id: 'FW-LABOUR-01',
    name: 'Kenya Labour Laws & Employment Act (Cap 226)',
    category: 'Labour Regulations',
    complianceScore: 98.2,
    requirementsTotal: 45,
    requirementsCompliant: 44,
    status: 'COMPLIANT',
    owner: 'Chief HR Officer',
    lastAudit: '2026-06-30'
  },
  {
    id: 'FW-TAX-02',
    name: 'KRA Income Tax, PAYE, SHIF, NSSF & Housing Levy Statutory Requirements',
    category: 'Tax Requirements',
    complianceScore: 100.0,
    requirementsTotal: 28,
    requirementsCompliant: 28,
    status: 'FULL_COMPLIANCE',
    owner: 'Chief Financial Officer',
    lastAudit: '2026-07-31'
  },
  {
    id: 'FW-ISO-03',
    name: 'ISO/IEC 27001:2022 Information Security Management System',
    category: 'ISO Standards',
    complianceScore: 94.6,
    requirementsTotal: 93,
    requirementsCompliant: 88,
    status: 'COMPLIANT',
    owner: 'CISO / IT Security',
    lastAudit: '2026-05-15'
  },
  {
    id: 'FW-PROC-04',
    name: 'Public Procurement and Asset Disposal Act (PPADA)',
    category: 'Procurement Policies',
    complianceScore: 96.0,
    requirementsTotal: 30,
    requirementsCompliant: 29,
    status: 'COMPLIANT',
    owner: 'Head of Procurement',
    lastAudit: '2026-04-10'
  },
  {
    id: 'FW-DPA-05',
    name: 'Data Protection Act 2019 (ODPC Kenya Compliance)',
    category: 'Privacy & Legal',
    complianceScore: 95.8,
    requirementsTotal: 24,
    requirementsCompliant: 23,
    status: 'COMPLIANT',
    owner: 'Legal Counsel',
    lastAudit: '2026-06-12'
  }
]

export default function ComplianceCenterFrameworks() {
  const [frameworks, setFrameworks] = useState(FRAMEWORKS)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Scale size={13} className="text-cyan-400" /> Statutory & Regulatory Compliance Engine
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Scale className="text-cyan-400" /> Enterprise Compliance Frameworks & Statutory Mapping
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Continuous monitoring of Labour Regulations, Tax Statutes (KRA, SHIF, NSSF), ISO Standards, Procurement Mandates, and Custom Regulatory Frameworks.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/30">
            Overall Compliance Score: 96.8%
          </div>
        </div>
      </div>

      {/* Frameworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {frameworks.map((fw) => (
          <div
            key={fw.id}
            className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">{fw.category}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {fw.status}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white">{fw.name}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Owner: <strong className="text-slate-800 dark:text-slate-200">{fw.owner}</strong>
              </p>
            </div>

            {/* Compliance Score Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300">Compliance Rate</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">{fw.complianceScore}% ({fw.requirementsCompliant}/{fw.requirementsTotal} Controls Met)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${fw.complianceScore}%` }} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[10px] font-mono text-slate-500">
              <span>Framework Code: {fw.id}</span>
              <span>Last External Audit: {fw.lastAudit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
