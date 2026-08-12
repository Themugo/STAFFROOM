import React, { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import {
  Clock,
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  Sliders,
  Sparkles,
  AlertTriangle,
  Building2,
  MapPin,
  Calendar,
  Filter,
  Check,
  X
} from 'lucide-react'

export const SHIFT_TYPES = [
  { id: 'MORNING', label: 'Morning Shift', hours: '06:00 AM - 02:00 PM', defaultTransportNeeded: true },
  { id: 'AFTERNOON', label: 'Afternoon Shift', hours: '02:00 PM - 10:00 PM', defaultTransportNeeded: true },
  { id: 'NIGHT', label: 'Night Shift', hours: '10:00 PM - 06:00 AM', defaultTransportNeeded: true },
  { id: 'WEEKEND', label: 'Weekend Shift', hours: '08:00 AM - 05:00 PM', defaultTransportNeeded: false },
  { id: 'HOLIDAY', label: 'Public Holiday Shift', hours: '08:00 AM - 05:00 PM', defaultTransportNeeded: true },
  { id: 'EMERGENCY_CALL', label: 'Emergency On-Call', hours: 'Ad-hoc / On-Demand', defaultTransportNeeded: true },
  { id: 'OVERTIME', label: 'Approved Overtime', hours: 'Post-18:00 PM', defaultTransportNeeded: true }
]

export const INITIAL_POLICIES = [
  {
    id: 'POL-01',
    name: 'Late Night Safety Mandate',
    description: 'Mandatory drop-off transport for female staff leaving after 20:00 PM.',
    conditionType: 'FEMALE_AFTER_8PM',
    status: 'ACTIVE',
    affectedDept: 'All Departments',
    minDistanceKm: 0,
    priority: 'HIGH'
  },
  {
    id: 'POL-02',
    name: 'Night Shift Mandatory Coverage',
    description: 'All night shift personnel (10 PM - 6 AM) provided door-to-door transport.',
    conditionType: 'NIGHT_SHIFT_ONLY',
    status: 'ACTIVE',
    affectedDept: 'Operations, IT, Hospital, Security',
    minDistanceKm: 0,
    priority: 'HIGH'
  },
  {
    id: 'POL-03',
    name: 'Commute Radius Threshold (> 8 km)',
    description: 'Employees residing beyond 8 km from office are eligible for corporate shuttle route.',
    conditionType: 'DISTANCE_THRESHOLD',
    status: 'ACTIVE',
    affectedDept: 'All Departments',
    minDistanceKm: 8,
    priority: 'STANDARD'
  },
  {
    id: 'POL-04',
    name: 'Essential Medical & Emergency Call-Out',
    description: 'Doctors, nurses, and IT infrastructure engineers on call receive priority VIP transport.',
    conditionType: 'ESSENTIAL_STAFF',
    status: 'ACTIVE',
    affectedDept: 'Hospital Medical Staff, Engineering',
    minDistanceKm: 0,
    priority: 'EMERGENCY'
  },
  {
    id: 'POL-05',
    name: 'Executive & Senior Management Protocol',
    description: 'Executives (Grade 15+) receive dedicated transport allocation.',
    conditionType: 'GRADE_BASED',
    status: 'ACTIVE',
    affectedDept: 'Executive Office',
    minDistanceKm: 0,
    priority: 'VIP'
  }
]

export const SAMPLE_EMPLOYEE_ELIGIBILITY = [
  {
    id: 'EMP-101',
    name: 'Dr. Jane Muthoni',
    department: 'Hospital Staff (Medical)',
    grade: 'Grade 14 - Senior Specialist',
    shift: 'Night Shift',
    clockOutTime: '06:00 AM',
    distanceKm: 12.5,
    gender: 'Female',
    eligible: true,
    matchingRule: 'Night Shift Mandatory + Essential Staff'
  },
  {
    id: 'EMP-102',
    name: 'Amina Zainab',
    department: 'Finance & Accounting',
    grade: 'Grade 8 - Accountant',
    shift: 'Overtime',
    clockOutTime: '20:30 PM',
    distanceKm: 9.2,
    gender: 'Female',
    eligible: true,
    matchingRule: 'Female Staff after 8PM + Distance > 8km'
  },
  {
    id: 'EMP-103',
    name: 'Brian Omondi',
    department: 'Sales & Marketing',
    grade: 'Grade 6 - Rep',
    shift: 'Morning Shift',
    clockOutTime: '17:00 PM',
    distanceKm: 4.1,
    gender: 'Male',
    eligible: false,
    matchingRule: 'Under 8km Radius & Standard Day Shift'
  },
  {
    id: 'EMP-104',
    name: 'Kevin Otieno',
    department: 'Engineering & IT',
    grade: 'Grade 11 - Lead Systems',
    shift: 'Emergency On-Call',
    clockOutTime: '02:15 AM',
    distanceKm: 15.0,
    gender: 'Male',
    eligible: true,
    matchingRule: 'Essential On-Call Infrastructure Duty'
  }
]

export default function ShiftEligibilityManager({ onNotify }) {
  const toast = useToast()
  const [shifts] = useState(SHIFT_TYPES)
  const [policies, setPolicies] = useState(INITIAL_POLICIES)
  const [staffEligibility, setStaffEligibility] = useState(SAMPLE_EMPLOYEE_ELIGIBILITY)
  const [activeShiftFilter, setActiveShiftFilter] = useState('ALL')
  const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState(false)

  const [newPolicy, setNewPolicy] = useState({
    name: '',
    description: '',
    conditionType: 'DISTANCE_THRESHOLD',
    affectedDept: 'All Departments',
    minDistanceKm: 8,
    priority: 'STANDARD'
  })

  const handleAddPolicySubmit = (e) => {
    e.preventDefault()
    if (!newPolicy.name) {
      toast.error('Policy name is required.')
      return
    }

    const created = {
      id: `POL-${Math.floor(10 + Math.random() * 90)}`,
      ...newPolicy,
      status: 'ACTIVE'
    }

    setPolicies(prev => [created, ...prev])
    if (onNotify) onNotify(`Transport Eligibility Policy "${created.name}" created and applied!`)
    setIsAddPolicyModalOpen(false)
    setNewPolicy({
      name: '',
      description: '',
      conditionType: 'DISTANCE_THRESHOLD',
      affectedDept: 'All Departments',
      minDistanceKm: 8,
      priority: 'STANDARD'
    })
  }

  const togglePolicyStatus = (polId) => {
    setPolicies(prev =>
      prev.map(p =>
        p.id === polId
          ? { ...p, status: p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : p
      )
    )
    if (onNotify) onNotify(`Policy ${polId} status toggled.`)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Shift & Policy Engine */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold mb-1">
              <Sparkles size={13} /> Kenya Enterprise Shift & Eligibility Rules Engine
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Shift Operations & Transport Eligibility Management
            </h3>
            <p className="text-xs text-slate-500">
              Automatically evaluates shift rosters, late night safety mandates, distance thresholds, and employee grades to determine transport entitlement.
            </p>
          </div>

          <button
            onClick={() => setIsAddPolicyModalOpen(true)}
            className="btn-primary bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-2xl flex items-center gap-2 text-xs shadow-md cursor-pointer shrink-0"
          >
            <Plus size={16} /> Create Eligibility Policy
          </button>
        </div>

        {/* Shift Badges Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs pt-2">
          {shifts.map((s) => (
            <div
              key={s.id}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
            >
              <div>
                <strong className="text-slate-900 dark:text-white text-[11px] block">{s.label}</strong>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{s.hours}</span>
              </div>
              <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded ${
                s.defaultTransportNeeded
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                {s.defaultTransportNeeded ? 'Transport Mandatory' : 'Optional'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Eligibility Policies */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders size={18} className="text-indigo-600 dark:text-indigo-400" />
          Active Transport Eligibility Policies ({policies.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {policies.map((pol) => (
            <div
              key={pol.id}
              className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-[10px]">
                    {pol.id}
                  </span>
                  <strong className="text-slate-900 dark:text-white text-xs block">{pol.name}</strong>
                  <span className="text-[10px] text-slate-400 font-mono">{pol.affectedDept}</span>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  pol.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                }`}>
                  {pol.status}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{pol.description}</p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[11px]">
                <span className="font-mono text-slate-400">Rule: {pol.conditionType}</span>
                <button
                  onClick={() => togglePolicyStatus(pol.id)}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                >
                  Toggle Rule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Employee Shift Eligibility Roster */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
            Shift Roster Transport Entitlement Audit Log ({staffEligibility.length})
          </h3>

          <div className="flex items-center gap-1.5 font-mono text-xs overflow-x-auto">
            <span className="text-slate-400 font-bold shrink-0">Shift Filter:</span>
            {['ALL', 'Night Shift', 'Overtime', 'Emergency On-Call', 'Morning Shift'].map((sf) => (
              <button
                key={sf}
                onClick={() => setActiveShiftFilter(sf)}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeShiftFilter === sf
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {sf}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                <th className="py-3 px-3">Employee Name & Grade</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Shift & Clock-Out</th>
                <th className="py-3 px-3">Distance & Gender</th>
                <th className="py-3 px-3">Entitlement Status</th>
                <th className="py-3 px-3">Matching Policy Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {staffEligibility
                .filter(s => activeShiftFilter === 'ALL' || s.shift === activeShiftFilter)
                .map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <strong className="text-slate-900 dark:text-white block">{emp.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono block">{emp.grade}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{emp.department}</td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{emp.shift}</span>
                      <span className="text-[10px] text-slate-400 block">{emp.clockOutTime}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                      <span>{emp.distanceKm} km</span> • <span>{emp.gender}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        emp.eligible
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {emp.eligible ? <Check size={12} /> : <X size={12} />}
                        {emp.eligible ? 'APPROVED FOR TRANSPORT' : 'INELIGIBLE'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-500 font-mono">{emp.matchingRule}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE POLICY MODAL */}
      {isAddPolicyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders size={18} className="text-indigo-600 dark:text-indigo-400" />
              Configure New Transport Policy
            </h3>

            <form onSubmit={handleAddPolicySubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Policy Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Factory Night Shift Medical Coverage"
                  value={newPolicy.name}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Condition Rule Type</label>
                <select
                  value={newPolicy.conditionType}
                  onChange={(e) => setNewPolicy({ ...newPolicy, conditionType: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  <option value="DISTANCE_THRESHOLD">Commute Distance Radius (&gt; X km)</option>
                  <option value="NIGHT_SHIFT_ONLY">Night Shift Mandatory (10PM-6AM)</option>
                  <option value="FEMALE_AFTER_8PM">Female Staff Leaving After 8:00 PM</option>
                  <option value="ESSENTIAL_STAFF">Essential Medical / On-Call Staff</option>
                  <option value="GRADE_BASED">Grade / Executive Designation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Department Scope</label>
                <input
                  type="text"
                  placeholder="e.g. All Departments / Hospital / IT"
                  value={newPolicy.affectedDept}
                  onChange={(e) => setNewPolicy({ ...newPolicy, affectedDept: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Explain operational rationale..."
                  value={newPolicy.description}
                  onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPolicyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
