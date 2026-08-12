import React from 'react'
import { useKnowledge } from '@/contexts/KnowledgeContext'
import {
  ShieldCheck,
  BarChart3,
  Search,
  Clock,
  History,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  Activity
} from 'lucide-react'

export default function GovernanceAndAnalyticsTab() {
  const { documents, auditLog } = useKnowledge()

  const totalDocs = documents.length
  const totalViews = documents.reduce((acc, d) => acc + (d.views || 0), 0)
  const publishedDocs = documents.filter((d) => d.status === 'Published').length

  return (
    <div className="space-y-6">
      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Documents</span>
          <strong className="text-2xl font-black text-slate-900 dark:text-white block">{totalDocs}</strong>
          <span className="text-[10px] font-mono text-emerald-600 font-bold">100% Governance Compliance</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Knowledge Reads</span>
          <strong className="text-2xl font-black text-slate-900 dark:text-white block">{totalViews}</strong>
          <span className="text-[10px] font-mono text-indigo-600 font-bold">+28% Reads this month</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Active Published SOPs</span>
          <strong className="text-2xl font-black text-emerald-600 block">{publishedDocs}</strong>
          <span className="text-[10px] font-mono text-slate-400">Ratified by Governance</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Search Success Rate</span>
          <strong className="text-2xl font-black text-indigo-600 block">96.8%</strong>
          <span className="text-[10px] font-mono text-emerald-600 font-bold">AI Graph Index Active</span>
        </div>
      </div>

      {/* AUDIT LOG & RETENTION VAULT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AUDIT TRAIL */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <History size={18} className="text-indigo-600" />
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              Complete Knowledge Audit Trail
            </h3>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto">
            {auditLog.map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                <div className="flex justify-between items-center font-mono text-[10px] text-slate-400">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{log.action} • {log.docId}</span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200">{log.note}</p>
                <span className="text-[10px] font-mono text-slate-400 block">Performed by: {log.user} ({log.version})</span>
              </div>
            ))}
          </div>
        </div>

        {/* CLASSIFICATION & SECURITY MATRIX */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldCheck size={18} className="text-emerald-600" />
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              Security Classification & Retention Policies
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <strong className="block text-indigo-900 dark:text-indigo-200 font-bold">Public Knowledge</strong>
                <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-300">Employee Handbooks, External Guidelines</span>
              </div>
              <span className="font-mono font-bold text-xs">Retention: 7 Years</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <strong className="block text-slate-900 dark:text-white font-bold">Internal Operations</strong>
                <span className="text-[10px] font-mono text-slate-400">SOPs, Work Instructions, Department Manuals</span>
              </div>
              <span className="font-mono font-bold text-xs">Retention: 10 Years</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex justify-between items-center">
              <div>
                <strong className="block text-rose-900 dark:text-rose-200 font-bold">Confidential & Restricted</strong>
                <span className="text-[10px] font-mono text-rose-700 dark:text-rose-300">Runbooks, Audit Frameworks, Board Minutes</span>
              </div>
              <span className="font-mono font-bold text-xs text-rose-800">Indefinite Retention</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
