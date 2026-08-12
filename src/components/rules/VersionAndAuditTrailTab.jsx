import React from 'react'
import { useBusinessRules } from '@/contexts/BusinessRulesContext'
import {
  History,
  RotateCcw,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  FileCheck,
  Download
} from 'lucide-react'

export default function VersionAndAuditTrailTab({ onNotify }) {
  const { auditLog } = useBusinessRules()

  const handleRollback = (log) => {
    if (onNotify) onNotify(`Initiated rollback request for rule ${log.ruleId} to ${log.version}`)
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <History size={13} className="text-cyan-400" />
            Rule Version Control & Compliance Change Audit Trail
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Immutable Policy Audit Log & Version History
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Track every modification, approval threshold change, and statutory rule update with user sign-offs and one-click version rollback.
          </p>
        </div>

        <button
          onClick={() => onNotify && onNotify('Exported full Governance Audit Report PDF')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <FileCheck size={14} /> Export Audit Log PDF
        </button>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock size={16} className="text-indigo-600" />
          Chronological Policy Change Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 font-mono text-[10px] uppercase text-slate-400">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Target Rule</th>
                <th className="p-3">Action</th>
                <th className="p-3">Version</th>
                <th className="p-3">Modified By</th>
                <th className="p-3">Reason / Justification</th>
                <th className="p-3 text-right">Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {auditLog.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-400 font-bold">{log.id}</td>
                  <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="p-3">
                    <strong className="block text-slate-900 dark:text-white">{log.ruleName}</strong>
                    <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">{log.ruleId}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-600">{log.action}</td>
                  <td className="p-3 font-mono font-bold text-slate-600 dark:text-slate-300">{log.version}</td>
                  <td className="p-3 font-bold text-slate-700 dark:text-slate-300">{log.user}</td>
                  <td className="p-3 text-slate-500 max-w-xs">{log.reason}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleRollback(log)}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-mono font-bold cursor-pointer inline-flex items-center gap-1"
                    >
                      <RotateCcw size={12} /> Rollback
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
