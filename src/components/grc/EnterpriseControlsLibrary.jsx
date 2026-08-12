import React, { useState } from 'react'
import {
  ShieldCheck, Lock, CheckCircle2, AlertTriangle, RefreshCw,
  Sliders, Search, Filter, Cpu, Layers, GitBranch, ArrowUpRight
} from 'lucide-react'

const CONTROLS_DATA = [
  {
    id: 'CTL-AUTO-101',
    name: 'Dual Approval for Payments Above $10,000',
    type: 'Preventive',
    automation: 'Automated',
    riskLinked: 'RSK-FIN-02 (Uncapped Overtime / Payroll & Supplier Overpayments)',
    policyLinked: 'POL-FIN-004 (Procurement & Payment Delegation Policy)',
    department: 'Finance & Accounts',
    systemLinked: 'ERP & Payroll Engine',
    frequency: 'Continuous (Real-Time)',
    testingStatus: 'PASSED (100% Effective)',
    lastTested: '2026-08-01'
  },
  {
    id: 'CTL-AUTO-102',
    name: 'Biometric Attendance Geofencing & Liveness Check',
    type: 'Preventive',
    automation: 'Automated',
    riskLinked: 'RSK-CYBER-03 (Unauthorized Attendance Access)',
    policyLinked: 'POL-HR-012 (Time & Attendance Policy)',
    department: 'Human Resources & Facilities',
    systemLinked: 'StaffRoom Attendance Biometrics',
    frequency: 'Continuous',
    testingStatus: 'PASSED (99.4% Effective)',
    lastTested: '2026-07-28'
  },
  {
    id: 'CTL-DET-201',
    name: 'Weekly Overtime Variance Reconciliation Report',
    type: 'Detective',
    automation: 'Semi-Automated',
    riskLinked: 'RSK-FIN-02 (Uncapped Overtime Spike)',
    policyLinked: 'POL-HR-008 (Overtime & Shift Differential Policy)',
    department: 'Logistics & HR',
    systemLinked: 'Workforce Analytics & Intelligence',
    frequency: 'Weekly',
    testingStatus: 'PASSED',
    lastTested: '2026-08-02'
  },
  {
    id: 'CTL-MAN-301',
    name: 'Physical Warehouse Night Shift Asset Inspection Walkthrough',
    type: 'Detective',
    automation: 'Manual',
    riskLinked: 'RSK-HS-06 (Warehouse Night Safety Non-Compliance)',
    policyLinked: 'POL-HSE-002 (Occupational Health & Safety Manual)',
    department: 'Facilities & Security',
    systemLinked: 'Physical Logbook & HSE App',
    frequency: 'Daily (Nightly)',
    testingStatus: 'NEEDS_REVIEW',
    lastTested: '2026-07-25'
  },
  {
    id: 'CTL-COR-401',
    name: 'Automated Immediate Account Lockout on 3 Failed Auth Attempts',
    type: 'Corrective',
    automation: 'Automated',
    riskLinked: 'RSK-CYBER-03 (Privileged Access Breach)',
    policyLinked: 'POL-IT-001 (Cybersecurity & Access Control)',
    department: 'IT & InfoSec',
    systemLinked: 'Identity & Access Manager (IAM)',
    frequency: 'Event-Driven',
    testingStatus: 'PASSED',
    lastTested: '2026-08-03'
  }
]

export default function EnterpriseControlsLibrary() {
  const [controls, setControls] = useState(CONTROLS_DATA)
  const [filterType, setFilterType] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredControls = controls.filter(c => {
    const matchesType = filterType === 'ALL' || c.type === filterType || c.automation === filterType
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit mb-2">
              <ShieldCheck size={13} className="text-emerald-400" /> Enterprise Internal Controls Library
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" /> Internal Controls Framework & Testing Matrix
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Preventive, Detective, and Corrective controls mapped directly to risk registers, operational policies, department owners, and core software systems.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
              142 Active Controls Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search controls by ID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'Preventive', 'Detective', 'Corrective', 'Automated', 'Manual'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  filterType === t
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls List Grid */}
      <div className="space-y-3">
        {filteredControls.map((ctl) => {
          const isPassed = ctl.testingStatus.includes('PASSED')

          return (
            <div
              key={ctl.id}
              className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{ctl.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {ctl.type} Control
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {ctl.automation}
                  </span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isPassed ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}>
                  {ctl.testingStatus}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">{ctl.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-xs text-slate-600 dark:text-slate-300">
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200 block text-[10px] uppercase font-mono">Linked Risk:</strong>
                    <span>{ctl.riskLinked}</span>
                  </div>
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200 block text-[10px] uppercase font-mono">Linked Policy:</strong>
                    <span>{ctl.policyLinked}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-500 font-mono">
                <div>Owner Dept: <strong className="text-slate-800 dark:text-slate-200">{ctl.department}</strong></div>
                <div>System: <strong className="text-slate-800 dark:text-slate-200">{ctl.systemLinked}</strong></div>
                <div>Freq: <strong className="text-slate-800 dark:text-slate-200">{ctl.frequency}</strong></div>
                <div>Last Tested: <strong className="text-slate-800 dark:text-slate-200">{ctl.lastTested}</strong></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
