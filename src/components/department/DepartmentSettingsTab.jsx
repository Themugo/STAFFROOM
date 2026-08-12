import React, { useState } from 'react'
import {
  Settings, ShieldCheck, Lock, Sliders, Clock, Layers, History,
  Save, AlertTriangle, CheckCircle2, UserCheck, Key
} from 'lucide-react'

export default function DepartmentSettingsTab({ currentDept, isElevatedRole, showSuccess }) {
  const [maxBudgetClaim, setMaxBudgetClaim] = useState('2500')
  const [maxOvertimeHours, setMaxOvertimeHours] = useState('15')
  const [autoApproveSwaps, setAutoApproveSwaps] = useState(true)
  const [requireDualSignoff, setRequireDualSignoff] = useState(false)

  const [auditLogs, setAuditLogs] = useState([
    { id: 'al-1', action: 'WORKFLOW_RULE_UPDATED', description: 'Updated Expense Claim Threshold to $500', user: currentDept.head || 'Sarah Jenkins', timestamp: '2026-08-08 08:30:12', scope: `${currentDept.code} Workspace` },
    { id: 'al-2', action: 'DELEGATION_MODIFIED', description: 'Assigned temporary approval authority to Alex Rivers', user: currentDept.head || 'Sarah Jenkins', timestamp: '2026-08-07 16:15:00', scope: `${currentDept.code} Manager Authority` },
    { id: 'al-3', action: 'SOP_PUBLISHED', description: 'Published Engineering Coding SOP v2.4', user: 'Alex Rivers', timestamp: '2026-08-05 11:42:19', scope: `${currentDept.code} Docs` },
    { id: 'al-4', action: 'ROSTER_OVERRIDDEN', description: 'Overrode Mon Shift Assignment for Carlos Ruiz', user: currentDept.head || 'Sarah Jenkins', timestamp: '2026-08-03 09:10:05', scope: `${currentDept.code} Duty Schedule` },
  ])

  const handleSaveSettings = (e) => {
    e.preventDefault()
    const newLog = {
      id: `al-${Date.now()}`,
      action: 'SETTINGS_UPDATED',
      description: `Updated approval threshold ($${maxBudgetClaim}) & max overtime (${maxOvertimeHours} hrs)`,
      user: currentDept.head || 'Sarah Jenkins',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      scope: `${currentDept.code} Workspace`
    }
    setAuditLogs([newLog, ...auditLogs])
    showSuccess(`Settings saved & logged to ${currentDept.name} Department Audit Trail!`)
  }

  return (
    <div className="space-y-6">
      {/* Policy Inheritance & Bounds Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Database-Enforced Security
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <Settings size={18} className="text-indigo-600 dark:text-indigo-400" />
              {currentDept.name} Workspace Governance & Thresholds
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Department managers can adjust local parameters within Organization Policy limits.
            </p>
          </div>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleSaveSettings} className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="label">Manager Single-Signoff Expense Cap ($)</label>
              <input
                type="number"
                value={maxBudgetClaim}
                onChange={(e) => setMaxBudgetClaim(e.target.value)}
                className="input font-mono"
              />
              <p className="text-[10px] text-slate-400">
                Global Org Maximum Limit: <strong>$10,000</strong> (Enforced by Org Admin)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="label">Max Weekly Overtime Limit (Hours / Member)</label>
              <input
                type="number"
                value={maxOvertimeHours}
                onChange={(e) => setMaxOvertimeHours(e.target.value)}
                className="input font-mono"
              />
              <p className="text-[10px] text-slate-400">
                Global Org Maximum Limit: <strong>20 Hours</strong> (Enforced by Labor Policy)
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoApproveSwaps}
                onChange={(e) => setAutoApproveSwaps(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-slate-900 dark:text-white">Auto-approve Peer Shift Swaps if skill qualifications match</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requireDualSignoff}
                onChange={(e) => setRequireDualSignoff(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-slate-900 dark:text-white">Require Dual Signoff for high-priority task reassignment</span>
            </label>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer shadow-sm">
              <Save size={15} /> Save Department Settings
            </button>
          </div>
        </form>
      </div>

      {/* Dedicated Department Audit Logs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History size={18} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {currentDept.name} Department Audit Trail
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{auditLogs.length} Scoped Audit Entries</span>
        </div>

        <div className="space-y-2.5">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                    {log.action}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{log.description}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">By {log.user} • Scope: {log.scope}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
