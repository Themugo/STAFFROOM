import React, { useState } from 'react'
import {
  Target, Plus, CheckCircle2, AlertTriangle, TrendingUp, BarChart3,
  Award, ShieldCheck, User, Sparkles
} from 'lucide-react'

export default function DepartmentKpisTab({ currentDept, showSuccess }) {
  const [okrs, setOkrs] = useState([
    { id: 'okr-1', title: 'Maintain 99.95% System Uptime & Incident Resolution SLA', owner: 'David Miller', progress: 88, target: '99.95%', status: 'ON_TRACK', quarter: 'Q3 2026' },
    { id: 'okr-2', title: 'Reduce Average Support Ticket First Response Time to < 12 Mins', owner: 'Alex Rivers', progress: 94, target: '12 mins', status: 'ON_TRACK', quarter: 'Q3 2026' },
    { id: 'okr-3', title: 'Complete FY27 Operating Budget & Headcount Planning', owner: 'Sarah Jenkins', progress: 55, target: '100%', status: 'AT_RISK', quarter: 'Q3 2026' }
  ])

  const [modalOpen, setModalOpen] = useState(false)
  const [okrForm, setOkrForm] = useState({ title: '', owner: 'David Miller', target: '100%' })

  const handleCreateOkr = (e) => {
    e.preventDefault()
    if (!okrForm.title) return
    const newOkr = {
      id: `okr-${Date.now()}`,
      title: okrForm.title,
      owner: okrForm.owner,
      progress: 0,
      target: okrForm.target || '100%',
      status: 'ON_TRACK',
      quarter: 'Q3 2026'
    }
    setOkrs([newOkr, ...okrs])
    setModalOpen(false)
    setOkrForm({ title: '', owner: 'David Miller', target: '100%' })
    showSuccess(`New KPI objective "${newOkr.title}" set for ${currentDept.name}.`)
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target size={18} className="text-indigo-600 dark:text-indigo-400" />
              {currentDept.name} Key Performance Indicators & OKRs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Strategic quarterly objectives, key result targets, and progress tracking for {currentDept.name}.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
          >
            <Plus size={15} /> Set Department Objective
          </button>
        </div>
      </div>

      {/* OKRs List */}
      <div className="space-y-4">
        {okrs.map((okr) => (
          <div key={okr.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                  {okr.quarter}
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{okr.title}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto ${
                okr.status === 'AT_RISK' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {okr.status}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Key Result Progress</span>
                <span className="font-bold text-slate-900 dark:text-white">{okr.progress}% (Target: {okr.target})</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${okr.progress < 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${okr.progress}%` }} />
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono pt-1">
              <span>KR Owner: <strong className="text-slate-700 dark:text-slate-300">{okr.owner}</strong></span>
              <button
                onClick={() => {
                  const newProg = Math.min(100, okr.progress + 10)
                  setOkrs(okrs.map(o => o.id === okr.id ? { ...o, progress: newProg } : o))
                  showSuccess(`Updated OKR progress for "${okr.title}" to ${newProg}%.`)
                }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                + Increment Progress
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Department Objective</h3>
            <form onSubmit={handleCreateOkr} className="space-y-3">
              <div>
                <label className="label">Objective Title *</label>
                <input
                  className="input"
                  value={okrForm.title}
                  onChange={(e) => setOkrForm({ ...okrForm, title: e.target.value })}
                  placeholder="e.g. Expand EMEA Operations Capacity"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Key Result Target</label>
                  <input
                    className="input"
                    value={okrForm.target}
                    onChange={(e) => setOkrForm({ ...okrForm, target: e.target.value })}
                    placeholder="100%"
                  />
                </div>
                <div>
                  <label className="label">KR Owner</label>
                  <input
                    className="input"
                    value={okrForm.owner}
                    onChange={(e) => setOkrForm({ ...okrForm, owner: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Set Objective</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
