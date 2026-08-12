import React, { useState } from 'react'
import {
  TrendingUp,
  Download,
  FileText,
  DollarSign,
  Bus,
  Users,
  Clock,
  PieChart,
  BarChart2,
  CheckCircle2,
  Sparkles,
  Calendar
} from 'lucide-react'

export const REPORT_TYPES = [
  { id: 'RPT-1', name: 'Daily Dispatch Register', description: 'Complete log of vehicle departures, drivers, and odometer readings.' },
  { id: 'RPT-2', name: 'Vehicle Booking Report', description: 'Detailed breakdown of employee requisitions, purposes, and approval logs.' },
  { id: 'RPT-3', name: 'Driver Schedule & Roster', description: 'Shift rosters, driving hours, and rest period compliance audits.' },
  { id: 'RPT-4', name: 'Trip History & Telematics Log', description: 'Historical GPS trajectories, travel times, and speed logs.' },
  { id: 'RPT-5', name: 'Department Transport Usage Report', description: 'Transport expenditure and trip volumes grouped by cost center.' },
  { id: 'RPT-6', name: 'Vehicle Utilization Report', description: 'Fleet capacity efficiency, idle time percentages, and maintenance downtime.' },
  { id: 'RPT-7', name: 'Monthly Transport Cost & Fuel Audit', description: 'Comprehensive fuel receipts, mileage costs, and budget vs actuals.' }
]

export default function TransportAnalyticsReports({ onNotify }) {
  const [downloadingRptId, setDownloadingRptId] = useState(null)

  const handleDownloadReport = (rpt) => {
    setDownloadingRptId(rpt.id)
    setTimeout(() => {
      setDownloadingRptId(null)
      if (onNotify) onNotify(`${rpt.name} generated & exported to PDF/Excel!`)
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle Utilization</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">88.4%</span>
            <span className="text-[11px] font-bold text-emerald-600">+3.2% vs Last Mo.</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">Avg Idle Time: 11.2%</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Cost Per Trip</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">$34.20</span>
            <span className="text-[11px] font-bold text-emerald-600">-12% (Trip Consolidation)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">Avg $1.15 per km</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Approval Speed</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">18 Mins</span>
            <span className="text-[11px] font-bold text-blue-600">Auto-Rules Active</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">Avg Dispatch: 12 Mins</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Trip Volume</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">142 Trips</span>
            <span className="text-[11px] font-bold text-purple-600">98.5% Completion</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">Cancelled: 1.5%</span>
        </div>
      </div>

      {/* Exportable Official Reports Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={20} className="text-indigo-600 dark:text-indigo-400" />
              Executive Logistics & Fleet Audit Reports
            </h3>
            <p className="text-xs text-slate-500">Generate formatted PDF and Excel transport reports for internal audit and financial reconciliation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {REPORT_TYPES.map((rpt) => (
            <div
              key={rpt.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center gap-3 transition-all hover:border-indigo-300"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{rpt.id}</span>
                  <strong className="text-slate-900 dark:text-white text-xs">{rpt.name}</strong>
                </div>
                <p className="text-[11px] text-slate-500">{rpt.description}</p>
              </div>

              <button
                disabled={downloadingRptId === rpt.id}
                onClick={() => handleDownloadReport(rpt)}
                className="btn-primary bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 text-xs shadow-sm"
              >
                <Download size={13} />
                {downloadingRptId === rpt.id ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
