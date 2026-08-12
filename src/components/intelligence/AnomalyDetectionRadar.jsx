import React, { useState } from 'react'
import {
  ShieldAlert, AlertTriangle, CheckCircle2, RefreshCw, Filter,
  DollarSign, Clock, Users, Truck, Boxes, Building2, Search,
  Eye, Check, X, ShieldCheck, Zap
} from 'lucide-react'

const ANOMALIES = [
  {
    id: 'anom-payroll-1',
    category: 'Payroll & Tax',
    severity: 'CRITICAL',
    title: 'Overtime Calculation Spike (+140% Variance)',
    timestamp: '10 minutes ago',
    module: 'Payroll Engine',
    details: 'Mombasa Warehouse Night Shift logged 180 total overtime hours in a single night. Standard benchmark is 45 hours.',
    impact: '$4,200 Unplanned Payroll Exposure',
    status: 'OPEN'
  },
  {
    id: 'anom-expense-2',
    category: 'Expense Claims',
    severity: 'HIGH',
    title: 'Duplicate Vendor Receipt Detected',
    timestamp: '28 minutes ago',
    module: 'Procurement & Finance',
    details: 'Two identical fuel receipts ($680 each) submitted for Vehicle KDC 114P under different driver accounts within 15 minutes.',
    impact: 'Potential Duplicate Payment',
    status: 'OPEN'
  },
  {
    id: 'anom-attendance-3',
    category: 'Attendance & Biometrics',
    severity: 'MEDIUM',
    title: 'Off-Hours Biometric Access Anomaly',
    timestamp: '1 hour ago',
    module: 'Attendance Intelligence',
    details: 'Biometric clock-in recorded at Kisumu Regional Office at 02:14 AM on Sunday without prior overtime authorization.',
    impact: 'Security Policy Review Required',
    status: 'OPEN'
  },
  {
    id: 'anom-fleet-4',
    category: 'Transport & Fleet',
    severity: 'MEDIUM',
    title: 'Zero-Utilization Fleet Asset (Idle Fleet)',
    timestamp: '3 hours ago',
    module: 'Transport Management',
    details: 'Van KDA 991X has remained stationary at Nairobi Depot for 21 consecutive days while active dispatch requests remain queued.',
    impact: '$2,100 Monthly Idle Depreciation Cost',
    status: 'RESOLVED'
  },
  {
    id: 'anom-supplier-5',
    category: 'Supplier & Vendors',
    severity: 'HIGH',
    title: 'Duplicate Vendor Bank Account Mapping',
    timestamp: '5 hours ago',
    module: 'Procurement',
    details: 'Newly registered vendor "Apex Tech Solutions" shares identical IBAN bank details with existing supplier "Summit Logistics Ltd".',
    impact: 'Potential Vendor Fraud / Conflict of Interest',
    status: 'OPEN'
  }
]

export default function AnomalyDetectionRadar() {
  const [anomalies, setAnomalies] = useState(ANOMALIES)
  const [filterSeverity, setFilterSeverity] = useState('ALL')

  const resolveAnomaly = (id) => {
    setAnomalies(anomalies.map(a => a.id === id ? { ...a, status: 'RESOLVED' } : a))
  }

  const filteredAnomalies = anomalies.filter(a => {
    if (filterSeverity === 'ALL') return true
    return a.severity === filterSeverity
  })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 w-fit mb-2">
              <ShieldAlert size={13} className="text-rose-400 animate-pulse" /> Real-Time Automated Anomaly Detection
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="text-rose-400" /> Operational Anomaly Radar & Fraud Prevention
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Continuous monitoring across payroll spikes, duplicate expense receipts, off-hours biometric activity, duplicate vendor IBANs, and idle fleet assets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-2 rounded-2xl bg-rose-500/20 text-rose-300 font-mono font-bold text-xs border border-rose-500/30 flex items-center gap-1.5">
              <AlertTriangle size={14} /> 4 Active Open Anomalies
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                filterSeverity === sev
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {sev === 'ALL' ? 'All Anomalies' : `${sev} Severity`}
            </button>
          ))}
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-3">
        {filteredAnomalies.map(anom => {
          const isOpen = anom.status === 'OPEN'
          const isCritical = anom.severity === 'CRITICAL'
          const isHigh = anom.severity === 'HIGH'

          return (
            <div
              key={anom.id}
              className={`card p-5 bg-white dark:bg-slate-900 border rounded-3xl space-y-3 shadow-xs transition-all ${
                isOpen
                  ? isCritical
                    ? 'border-rose-400 dark:border-rose-800/80 bg-rose-50/20 dark:bg-rose-950/10'
                    : isHigh
                    ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10'
                    : 'border-slate-200 dark:border-slate-800'
                  : 'border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    isCritical
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      : isHigh
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {anom.severity}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {anom.timestamp} • {anom.module}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isOpen ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {anom.status}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">
                  {anom.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {anom.details}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">
                  Impact: {anom.impact}
                </span>

                {isOpen && (
                  <button
                    onClick={() => resolveAnomaly(anom.id)}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 w-fit"
                  >
                    <CheckCircle2 size={13} className="text-emerald-400" /> Verify & Resolve Anomaly
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
