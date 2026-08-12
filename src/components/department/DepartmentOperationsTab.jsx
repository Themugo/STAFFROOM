import React, { useState } from 'react'
import {
  Briefcase, CheckSquare, Clock, AlertTriangle, ShieldCheck, HardDrive,
  Plus, Search, CheckCircle2, ChevronRight, RefreshCw, Box, Truck
} from 'lucide-react'

export default function DepartmentOperationsTab({ currentDept, showSuccess }) {
  const [activeSubTab, setActiveSubTab] = useState('assets') // 'assets', 'schedule', 'logistics'
  const [assetSearch, setAssetSearch] = useState('')

  const [assets, setAssets] = useState([
    { id: 'ast-1', name: 'MacBook Pro M3 Max 64GB', category: 'Hardware', serial: 'SN-ENG-9821', assignedTo: 'David Miller', condition: 'EXCELLENT', status: 'IN_USE' },
    { id: 'ast-2', name: '4K UltraWide Monitor 38"', category: 'Hardware', serial: 'SN-DISP-4402', assignedTo: 'Alex Rivers', condition: 'GOOD', status: 'IN_USE' },
    { id: 'ast-3', name: 'High-Speed Thermal Label Printer', category: 'Equipment', serial: 'SN-LOG-1109', assignedTo: 'Unassigned (Ops Room)', condition: 'EXCELLENT', status: 'AVAILABLE' },
    { id: 'ast-4', name: 'Secure Encrypted HSM Key Hardware', category: 'Security', serial: 'SN-SEC-0081', assignedTo: 'Sarah Jenkins', condition: 'EXCELLENT', status: 'IN_USE' }
  ])

  const [schedules, setSchedules] = useState([
    { id: 'sch-1', title: 'Daily Infrastructure Health Check', frequency: 'Daily (08:00)', owner: 'DevOps Team', status: 'COMPLETED' },
    { id: 'sch-2', title: 'Weekly Backup Integrity Verification', frequency: 'Mondays (10:00)', owner: 'Alex Rivers', status: 'IN_PROGRESS' },
    { id: 'sch-3', title: 'Monthly Workplace Safety Audit', frequency: 'Monthly 1st', owner: 'Facility Lead', status: 'PENDING' }
  ])

  const filteredAssets = assets.filter(a =>
    a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
    a.serial.toLowerCase().includes(assetSearch.toLowerCase())
  )

  const handleToggleSchedule = (id) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, status: s.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' } : s))
    showSuccess('Operational checklist updated.')
  }

  return (
    <div className="space-y-6">
      {/* Tab Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold">
          {[
            { id: 'assets', label: 'Department Assets & Gear', icon: HardDrive },
            { id: 'schedule', label: 'Operational Routine & Schedule', icon: Clock },
            { id: 'logistics', label: 'Facilities & Logistics', icon: Truck }
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeSubTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                  active ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => showSuccess('Asset registration modal opened.')}
          className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus size={14} /> Register Asset
        </button>
      </div>

      {/* SUBTAB 1: ASSETS */}
      {activeSubTab === 'assets' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{currentDept.name} Inventory & Hardware</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Track company assets assigned strictly to {currentDept.name}.</p>
            </div>
            <input
              type="text"
              placeholder="Search assets by name or serial #..."
              value={assetSearch}
              onChange={(e) => setAssetSearch(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssets.map((ast) => (
              <div key={ast.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{ast.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">{ast.category}</span>
                  </div>
                  <p className="text-slate-400 font-mono text-[11px]">Serial: {ast.serial}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Assigned to: <strong className="text-slate-900 dark:text-white">{ast.assignedTo}</strong></p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    ast.status === 'IN_USE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {ast.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Cond: {ast.condition}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: OPERATIONAL SCHEDULE */}
      {activeSubTab === 'schedule' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Department Routine Checklists & Standard Tasks</h3>
          <div className="space-y-2.5">
            {schedules.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleSchedule(s.id)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${
                      s.status === 'COMPLETED' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {s.status === 'COMPLETED' && <CheckCircle2 size={14} />}
                  </button>
                  <div>
                    <span className={`font-bold ${s.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {s.title}
                    </span>
                    <p className="text-[11px] text-slate-400">Frequency: {s.frequency} • Owner: {s.owner}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  s.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: LOGISTICS */}
      {activeSubTab === 'logistics' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Department Facilities & Workstation Dispatch</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage seating, facility requests, and specialized workplace infrastructure.</p>
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2">
            <span className="font-bold text-indigo-900 dark:text-indigo-200">Workstation Zone Allocation</span>
            <p className="text-indigo-800/80 dark:text-indigo-300">
              {currentDept.name} is allocated <strong>Floor 3 • Wing B (Desks 301-335)</strong>. 28 desks currently occupied, 7 desks available for new onboarding.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
