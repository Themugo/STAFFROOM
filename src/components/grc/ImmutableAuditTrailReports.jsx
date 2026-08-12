import React, { useState } from 'react'
import {
  Lock, ShieldCheck, Download, FileText, CheckCircle2,
  Clock, Hash, Key, Eye, ShieldAlert, Sparkles
} from 'lucide-react'

const AUDIT_TRAIL_LOGS = [
  {
    id: 'LOG-88401',
    timestamp: '2026-08-03 18:42:10 UTC',
    actor: 'system.governance@staffroom.internal',
    action: 'POLICY_ACKNOWLEDGEMENT_SIGNED',
    details: 'Employee #4102 digitally signed POL-IT-001 (Information Security Policy v4.0)',
    ipAddress: '197.232.88.14',
    checksum: 'a8f59e12b704c32e9a71d8f310011b62a'
  },
  {
    id: 'LOG-88402',
    timestamp: '2026-08-03 17:15:02 UTC',
    actor: 'david.finance@staffroom.internal',
    action: 'SOD_OVERRIDE_REQUESTED',
    details: 'Requested override for PO-9912 approval. Dual authorization required.',
    ipAddress: '197.232.88.19',
    checksum: 'c4e101a8892f3e80012b65103a22f990a'
  },
  {
    id: 'LOG-88403',
    timestamp: '2026-08-03 15:30:22 UTC',
    actor: 'ciso.sec@staffroom.internal',
    action: 'CONTROL_TESTING_PASSED',
    details: 'CTL-AUTO-101 (Dual Approval > $10k) verified automatically by system harness.',
    ipAddress: '10.0.4.102',
    checksum: 'f9011b65e2394a110034a889c20188bc1'
  }
]

export default function ImmutableAuditTrailReports() {
  const [logs, setLogs] = useState(AUDIT_TRAIL_LOGS)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Lock size={13} className="text-emerald-400" /> Immutable Cryptographic Audit Log & Board Reporting
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" /> Immutable Audit Trail & Board Risk Package Generator
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Cryptographically verified audit logs with SHA-256 hash checksums. Generate board risk reports, audit committee packages, and evidence bundles.
            </p>
          </div>

          <button className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-lg shrink-0">
            <Download size={15} /> Export Board Risk Package
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Hash size={16} className="text-emerald-500" /> Cryptographic Immutable Audit Log Stream
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Actor Email</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Event Details</th>
                <th className="py-2.5 px-3">SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{log.id}</td>
                  <td className="py-3 px-3 text-slate-500">{log.timestamp}</td>
                  <td className="py-3 px-3 text-indigo-600 dark:text-indigo-400">{log.actor}</td>
                  <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">{log.action}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{log.details}</td>
                  <td className="py-3 px-3 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{log.checksum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
