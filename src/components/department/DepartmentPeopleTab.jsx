import React, { useState } from 'react'
import {
  Users, UserCheck, Shield, Award, Activity, Plus, Search, Mail, Phone,
  CheckCircle2, Clock, Zap, Download, RefreshCw
} from 'lucide-react'
import { initials } from '../../lib/format'

export default function DepartmentPeopleTab({ currentDept, showSuccess }) {
  const [search, setSearch] = useState('')
  const [delegateModal, setDelegateModal] = useState(false)
  const [delegateUser, setDelegateUser] = useState('Alex Rivers')
  const [delegateActive, setDelegateActive] = useState(false)

  const defaultMembers = [
    { id: 'm-1', name: currentDept.head || 'Sarah Jenkins', role: 'Department Manager', email: `${(currentDept.code || 'dept').toLowerCase()}.head@staffroom.io`, workload: 80, capacity: 'Normal', status: 'In Office', skills: ['Leadership', 'Budgeting', 'Strategy', 'Compliance'], shifts: 'Morning (08:00 - 16:30)' },
    { id: 'm-2', name: 'Alex Rivers', role: 'Senior Operations Lead', email: 'alex.rivers@staffroom.io', workload: 92, capacity: 'High Load', status: 'In Office', skills: ['Architecture', 'Workflow Design', 'Security SOP'], shifts: 'Morning (08:00 - 16:30)' },
    { id: 'm-3', name: 'Emma Watson', role: 'Department Specialist', email: 'emma.watson@staffroom.io', workload: 65, capacity: 'Available', status: 'Remote', skills: ['Process Control', 'Analytics', 'Reporting'], shifts: 'Flexi (09:00 - 17:30)' },
    { id: 'm-4', name: 'Carlos Ruiz', role: 'Staff Analyst', email: 'carlos.ruiz@staffroom.io', workload: 78, capacity: 'Normal', status: 'In Office', skills: ['Data Engineering', 'Resource Audit'], shifts: 'Evening (14:00 - 22:30)' },
    { id: 'm-5', name: 'Maya Lin', role: 'Junior Operations Associate', email: 'maya.lin@staffroom.io', workload: 45, capacity: 'Available', status: 'In Office', skills: ['Documentation', 'Onboarding'], shifts: 'Morning (08:00 - 16:30)' }
  ]

  const filteredMembers = defaultMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  )

  const handleSetDelegation = (e) => {
    e.preventDefault()
    setDelegateActive(true)
    setDelegateModal(false)
    showSuccess(`Approval delegation active: ${delegateUser} assigned temporary manager authority for ${currentDept.name}.`)
  }

  return (
    <div className="space-y-6">
      {/* Top Controls & Delegation Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
              {currentDept.name} Personnel & Team Roster
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage member workload, skills, capacity, and manager approval delegation.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDelegateModal(true)}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <Shield size={14} className="text-amber-500" />
              {delegateActive ? 'Delegation Active' : 'Delegate Manager Authority'}
            </button>
            <button
              onClick={() => showSuccess('Department roster report downloaded.')}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} /> Export Directory
            </button>
          </div>
        </div>

        {/* Delegation Status Alert if Active */}
        {delegateActive && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Manager Authority Delegated:</strong> {delegateUser} currently holds approval authority for {currentDept.name}.
              </span>
            </div>
            <button
              onClick={() => { setDelegateActive(false); showSuccess('Delegation revoked.') }}
              className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline"
            >
              Revoke Delegation
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${currentDept.name} team members by name or title...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Personnel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((m) => (
          <div key={m.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                  {initials(m.name)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{m.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">{m.role}</p>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                m.capacity === 'High Load' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {m.capacity}
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Workload Capacity:</span>
                <span className="font-bold text-slate-900 dark:text-white">{m.workload}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${m.workload > 85 ? 'bg-rose-500' : 'bg-indigo-600'}`} style={{ width: `${m.workload}%` }} />
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              <p className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400" /> {m.email}</p>
              <p className="flex items-center gap-1.5"><Clock size={12} className="text-slate-400" /> Shift: {m.shifts}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Competencies</span>
              <div className="flex flex-wrap gap-1">
                {m.skills.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delegation Modal */}
      {delegateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield size={18} className="text-amber-500" />
              Delegate Manager Approval Authority
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Temporarily transfer {currentDept.name} approval authority (purchase claims, leave, shift swaps) to a senior department member.
            </p>

            <form onSubmit={handleSetDelegation} className="space-y-4">
              <div>
                <label className="label">Select Delegate Member *</label>
                <select
                  value={delegateUser}
                  onChange={(e) => setDelegateUser(e.target.value)}
                  className="input"
                >
                  <option value="Alex Rivers">Alex Rivers (Senior Operations Lead)</option>
                  <option value="Emma Watson">Emma Watson (Department Specialist)</option>
                  <option value="Carlos Ruiz">Carlos Ruiz (Staff Analyst)</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
                Delegated actions will be logged with a <strong className="text-slate-900 dark:text-white">[DELEGATED_AUTHORITY]</strong> tag in the {currentDept.code} Department Audit Trail.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setDelegateModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Confirm Delegation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
