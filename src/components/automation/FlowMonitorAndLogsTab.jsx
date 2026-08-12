import React from 'react'
import { useAutomation } from '@/contexts/AutomationContext'
import { Activity, CheckCircle2, Clock, Zap, AlertTriangle, RotateCcw, ShieldCheck } from 'lucide-react'

export default function FlowMonitorAndLogsTab({ onNotify }) {
  const { flows, logs } = useAutomation()

  const totalRuns = flows.reduce((acc, f) => acc + f.totalRuns, 0)
  const totalHoursSaved = flows.reduce((acc, f) => acc + f.timeSavedHours, 0)

  return (
    <div className="space-y-6">
      {/* METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-bold uppercase">Active Automations</span>
            <Zap size={16} className="text-amber-500" />
          </div>
          <strong className="text-2xl font-black text-slate-900 dark:text-white">
            {flows.filter((f) => f.status === 'Active').length} / {flows.length}
          </strong>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-bold uppercase">Total Executions</span>
            <Activity size={16} className="text-indigo-500" />
          </div>
          <strong className="text-2xl font-black text-slate-900 dark:text-white">
            {totalRuns.toLocaleString()}
          </strong>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-bold uppercase">Success SLA</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <strong className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            99.4%
          </strong>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono font-bold uppercase">Estimated Time Saved</span>
            <Clock size={16} className="text-cyan-500" />
          </div>
          <strong className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
            {totalHoursSaved} Hours
          </strong>
        </div>
      </div>

      {/* EXECUTION AUDIT LOGS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">
              Real-Time Execution Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              Granular telemetry and payload logs for every automated trigger execution
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold flex items-center gap-1">
            <ShieldCheck size={14} /> Audit Logging Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase">
                <th className="pb-3 font-bold">Execution ID</th>
                <th className="pb-3 font-bold">Timestamp</th>
                <th className="pb-3 font-bold">Automation Flow</th>
                <th className="pb-3 font-bold">Triggered Event</th>
                <th className="pb-3 font-bold">Latency</th>
                <th className="pb-3 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">{log.id}</td>
                  <td className="py-3 text-slate-500">{log.timestamp}</td>
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{log.flowName}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{log.triggerBy}</td>
                  <td className="py-3 text-slate-500">{log.duration}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        log.status === 'Success'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {log.status}
                    </span>
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
