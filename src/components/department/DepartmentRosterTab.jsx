import React, { useState } from 'react'
import {
  Calendar, Clock, Users, ArrowLeftRight, CheckCircle2, Plus, Download,
  AlertTriangle, ShieldCheck, UserCheck, RefreshCw
} from 'lucide-react'

export default function DepartmentRosterTab({ currentDept, showSuccess }) {
  const [shiftSwaps, setShiftSwaps] = useState([
    { id: 'sw-1', requester: 'Alex Rivers', originalShift: 'Mon Aug 10 (Night Shift)', targetPeer: 'Emma Watson', targetShift: 'Tue Aug 11 (Morning Shift)', status: 'PENDING' },
    { id: 'sw-2', requester: 'Carlos Ruiz', originalShift: 'Wed Aug 12 (On-Call)', targetPeer: 'Maya Lin', targetShift: 'Thu Aug 13 (Day Shift)', status: 'APPROVED' }
  ])

  const [modalOpen, setModalOpen] = useState(false)
  const [shiftForm, setShiftForm] = useState({
    member: 'Alex Rivers',
    day: 'Monday',
    shiftType: 'Morning (08:00 - 16:30)'
  })

  const weeklyMatrix = [
    { name: 'Sarah Jenkins', role: 'HOD', Mon: 'Day', Tue: 'Day', Wed: 'Day', Thu: 'Day', Fri: 'Day' },
    { name: 'Alex Rivers', role: 'Senior Operations Lead', Mon: 'Morning', Tue: 'Morning', Wed: 'Night', Thu: 'Night', Fri: 'OFF' },
    { name: 'Emma Watson', role: 'Specialist', Mon: 'Morning', Tue: 'Morning', Wed: 'Day', Thu: 'Day', Fri: 'Day' },
    { name: 'Carlos Ruiz', role: 'Analyst', Mon: 'Night', Tue: 'Night', Wed: 'OFF', Thu: 'On-Call', Fri: 'Day' },
    { name: 'Maya Lin', role: 'Associate', Mon: 'Day', Tue: 'Day', Wed: 'Day', Thu: 'Day', Fri: 'Day' }
  ]

  const handleApproveSwap = (id, approved) => {
    setShiftSwaps(shiftSwaps.map(s => s.id === id ? { ...s, status: approved ? 'APPROVED' : 'REJECTED' } : s))
    showSuccess(`Shift swap request ${approved ? 'approved' : 'rejected'}.`)
  }

  const handleCreateShift = (e) => {
    e.preventDefault()
    setModalOpen(false)
    showSuccess(`Duty shift assigned: ${shiftForm.member} -> ${shiftForm.day} (${shiftForm.shiftType}).`)
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600 dark:text-indigo-400" />
              {currentDept.name} Duty Roster & Shift Schedule
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Weekly shift fulfillment: <strong>96.4%</strong> • Total Overtime Allocated: <strong>14.5 hrs</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Assign Shift
            </button>
            <button
              onClick={() => showSuccess('Weekly shift roster exported.')}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} /> Export Roster
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Shift Matrix Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 overflow-x-auto">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Weekly Duty Roster Schedule</h4>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono">
              <th className="py-2.5 px-3">Team Member</th>
              <th className="py-2.5 px-2">Mon</th>
              <th className="py-2.5 px-2">Tue</th>
              <th className="py-2.5 px-2">Wed</th>
              <th className="py-2.5 px-2">Thu</th>
              <th className="py-2.5 px-2">Fri</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {weeklyMatrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-3">
                  <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
                  <p className="text-[10px] text-slate-400">{row.role}</p>
                </td>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => {
                  const shift = row[day]
                  let badgeStyle = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  if (shift === 'Night') badgeStyle = 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                  if (shift === 'On-Call') badgeStyle = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  if (shift === 'OFF') badgeStyle = 'bg-slate-100 text-slate-400 dark:bg-slate-800'

                  return (
                    <td key={day} className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold block text-center ${badgeStyle}`}>
                        {shift}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shift Swap Requests Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ArrowLeftRight size={16} className="text-indigo-600" />
          Shift Swap Approval Queue
        </h4>

        <div className="space-y-3">
          {shiftSwaps.map((sw) => (
            <div key={sw.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{sw.requester}</span>
                  <span className="text-slate-400 font-mono">swapping with</span>
                  <span className="font-bold text-slate-900 dark:text-white">{sw.targetPeer}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {sw.originalShift} ↔ {sw.targetShift}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {sw.status === 'PENDING' ? (
                  <>
                    <button onClick={() => handleApproveSwap(sw.id, false)} className="btn-secondary text-xs py-1.5 px-3 cursor-pointer">Reject</button>
                    <button onClick={() => handleApproveSwap(sw.id, true)} className="btn-primary text-xs py-1.5 px-3 cursor-pointer">Approve Swap</button>
                  </>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {sw.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Assign Duty Shift</h3>
            <form onSubmit={handleCreateShift} className="space-y-3">
              <div>
                <label className="label">Team Member</label>
                <select className="input" value={shiftForm.member} onChange={(e) => setShiftForm({ ...shiftForm, member: e.target.value })}>
                  <option value="Alex Rivers">Alex Rivers</option>
                  <option value="Emma Watson">Emma Watson</option>
                  <option value="Carlos Ruiz">Carlos Ruiz</option>
                  <option value="Maya Lin">Maya Lin</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Day</label>
                  <select className="input" value={shiftForm.day} onChange={(e) => setShiftForm({ ...shiftForm, day: e.target.value })}>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="label">Shift Type</label>
                  <select className="input" value={shiftForm.shiftType} onChange={(e) => setShiftForm({ ...shiftForm, shiftType: e.target.value })}>
                    <option value="Morning (08:00 - 16:30)">Morning</option>
                    <option value="Evening (14:00 - 22:30)">Evening</option>
                    <option value="Night (22:00 - 06:30)">Night</option>
                    <option value="On-Call Duty">On-Call</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Confirm Shift</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
