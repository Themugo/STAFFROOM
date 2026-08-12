import React, { useState } from 'react'
import {
  Database, ShieldCheck, CheckCircle2, Lock, GitBranch,
  Search, Filter, BookOpen, Layers, Key, FileText, Activity
} from 'lucide-react'

const DATA_CATALOG = [
  { entity: 'EmployeeMaster', domain: 'HR & Staff', sensitivity: 'PII / CONFIDENTIAL', owner: 'Chief HR Officer', qualityScore: '99.8%', retention: '10 Years' },
  { entity: 'PayrollTransactions', domain: 'Finance', sensitivity: 'RESTRICTED FINANCIAL', owner: 'Chief Financial Officer', qualityScore: '100.0%', retention: '7 Years (Tax Statutory)' },
  { entity: 'FleetTelematicsLogs', domain: 'Transport', sensitivity: 'INTERNAL OPERATIONAL', owner: 'Head of Transport', qualityScore: '98.4%', retention: '3 Years' },
  { entity: 'BiometricAttendance', domain: 'Time & Attendance', sensitivity: 'PII / BIOMETRIC', owner: 'Security Director', qualityScore: '99.5%', retention: '5 Years' },
  { entity: 'ProcurementInvoices', domain: 'Procurement', sensitivity: 'CONFIDENTIAL', owner: 'Head of Procurement', qualityScore: '99.1%', retention: '7 Years' }
]

export default function DataGovernanceCatalog() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Database size={13} className="text-purple-400" /> Enterprise Data Governance & Quality Engine
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Database className="text-purple-400" /> Data Catalog, Lineage & Quality Control
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Govern enterprise data entities, enforce statutory data quality validation rules, trace lineage from source systems to executive dashboards, and maintain retention schedules.
            </p>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
          <BookOpen size={15} className="text-purple-500" /> Core Enterprise Data Entities
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3">Entity Name</th>
                <th className="py-2.5 px-3">Domain</th>
                <th className="py-2.5 px-3">Sensitivity</th>
                <th className="py-2.5 px-3">Data Owner</th>
                <th className="py-2.5 px-3">Quality Score</th>
                <th className="py-2.5 px-3">Retention Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DATA_CATALOG.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{item.entity}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{item.domain}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {item.sensitivity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{item.owner}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.qualityScore}</td>
                  <td className="py-3 px-3 text-slate-500">{item.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
