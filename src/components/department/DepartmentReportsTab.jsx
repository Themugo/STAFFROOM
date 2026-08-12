import React from 'react'
import {
  FileText, BarChart3, Download, CheckCircle2, Clock, ShieldCheck,
  TrendingUp, FileUp, Sparkles, AlertCircle
} from 'lucide-react'

export default function DepartmentReportsTab({ currentDept, showSuccess }) {
  const reportsList = [
    { id: 'rep-1', title: `${currentDept.name} Monthly Operational Performance Summary`, period: 'July 2026', status: 'VERIFIED', size: '2.4 MB', metrics: 'Shift fulfillment 98%, Task SLA 94%' },
    { id: 'rep-2', title: `${currentDept.code} Budget Variance & Line Item Audit`, period: 'Q2 2026', status: 'VERIFIED', size: '1.8 MB', metrics: 'Under budget by $8,400' },
    { id: 'rep-3', title: `${currentDept.name} SOP & Compliance Audit Trail`, period: 'H1 2026', status: 'COMPLIANT', size: '3.1 MB', metrics: 'Zero security policy violations' }
  ]

  const handleDownloadReport = (title) => {
    showSuccess(`Generated report "${title}". Download initiated.`)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-indigo-600 dark:text-indigo-400" />
              {currentDept.name} Operational Reports & Analytics Archive
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Audited operational logs, compliance reports, and shift productivity statements.
            </p>
          </div>

          <button
            onClick={() => handleDownloadReport(`${currentDept.name} Comprehensive Operational Report`)}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
          >
            <Download size={15} /> Generate Comprehensive Report
          </button>
        </div>
      </div>

      {/* Reports Archive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportsList.map((rep) => (
          <div key={rep.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                  {rep.period}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> {rep.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{rep.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">{rep.metrics}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">{rep.size} • PDF</span>
              <button
                onClick={() => handleDownloadReport(rep.title)}
                className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 cursor-pointer"
              >
                <Download size={12} /> Export
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
