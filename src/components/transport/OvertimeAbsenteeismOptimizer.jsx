import React, { useState } from 'react'
import {
  Clock,
  UserX,
  Zap,
  TrendingUp,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Users,
  AlertTriangle,
  FileText,
  Building2,
  DollarSign
} from 'lucide-react'

export const SAMPLE_OVERTIME_WORKERS = [
  {
    id: 'OT-01',
    name: 'Samuel Kiprop',
    department: 'IT Systems Infrastructure',
    clockOut: '21:15 PM',
    overtimeHours: '3.2 hrs',
    supervisorApproval: 'Approved (Eng. Mutua)',
    dropOffZone: 'Kasarani - Thika Road Cluster',
    status: 'SHUTTLE_ASSIGNED',
    shuttleId: 'FLEET-VAN-02'
  },
  {
    id: 'OT-02',
    name: 'Mercy Njeri',
    department: 'Hospital Emergency Ward',
    clockOut: '22:00 PM',
    overtimeHours: '4.0 hrs',
    supervisorApproval: 'Approved (Dr. Muthoni)',
    dropOffZone: 'Kilimani - Ngong Road Cluster',
    status: 'SHUTTLE_ASSIGNED',
    shuttleId: 'FLEET-VAN-02'
  },
  {
    id: 'OT-03',
    name: 'David Korir',
    department: 'Finance Month-End Audit',
    clockOut: '20:45 PM',
    overtimeHours: '2.5 hrs',
    supervisorApproval: 'Pending HR Verification',
    dropOffZone: 'South B - Airport North',
    status: 'PENDING_APPROVAL',
    shuttleId: null
  }
]

export const SAMPLE_ABSENTEEISM_LOGS = [
  {
    id: 'ABS-101',
    name: 'Catherine Odhiambo',
    department: 'Customer Success',
    assignedRoute: 'ROUTE-WEST-01 (Westlands)',
    reason: 'Approved Annual Leave',
    detectedAt: '05:45 AM Today',
    routeOptimizedAction: 'Removed Stop #3 (Lavington Stage). Saved 4.2 km fuel.'
  },
  {
    id: 'ABS-102',
    name: 'John Kiptoo',
    department: 'Operations',
    assignedRoute: 'ROUTE-EAST-02 (Kilimani)',
    reason: 'Sick Leave Reported',
    detectedAt: '06:10 AM Today',
    routeOptimizedAction: 'Removed Stop #5 (Yaya Centre). Bypassed traffic node.'
  },
  {
    id: 'ABS-103',
    name: 'Faith Chebet',
    department: 'Marketing',
    assignedRoute: 'ROUTE-SOUTH-03 (Mombasa Rd)',
    reason: 'Remote Work / WFH Day',
    detectedAt: '06:00 AM Today',
    routeOptimizedAction: 'Merged Stop #2 with Stop #3. Saved 12 mins ETA.'
  }
]

export default function OvertimeAbsenteeismOptimizer({ onNotify }) {
  const [overtimeList, setOvertimeList] = useState(SAMPLE_OVERTIME_WORKERS)
  const [absenteeismLogs, setAbsenteeismLogs] = useState(SAMPLE_ABSENTEEISM_LOGS)
  const [isOptimizing, setIsOptimizing] = useState(false)

  const handleRunMorningOptimizer = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      setIsOptimizing(false)
      if (onNotify) {
        onNotify('Morning Absenteeism Route Optimizer executed: 3 absent/leave waypoints purged. Saved KSh 4,800 in fuel and 22 mins total travel time!')
      }
    }, 1200)
  }

  const handleApproveOvertimeShuttle = (otId) => {
    setOvertimeList(prev =>
      prev.map(item =>
        item.id === otId
          ? {
              ...item,
              status: 'SHUTTLE_ASSIGNED',
              supervisorApproval: 'Approved (HR System)',
              shuttleId: 'FLEET-VAN-02'
            }
          : item
      )
    )
    if (onNotify) onNotify(`Overtime transport approved for ${otId}! Assigned to Evening Drop Shuttle FLEET-VAN-02.`)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono text-[11px] font-bold mb-1">
              <Zap size={13} /> Automated Operational Efficiency Engine
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Overtime Detection & Morning Absenteeism Route Optimizer
            </h3>
            <p className="text-xs text-slate-500">
              Detects late-working employees from biometric clock-outs & supervisor approvals to generate night drop manifests. Purges absent/leave workers every morning to eliminate empty detours.
            </p>
          </div>

          <button
            onClick={handleRunMorningOptimizer}
            disabled={isOptimizing}
            className="btn-primary bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-4 rounded-2xl flex items-center gap-2 text-xs shadow-md cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isOptimizing ? 'animate-spin' : ''} />
            {isOptimizing ? 'Recalculating Routes...' : 'Run Morning Route Cleansing (06:00 AM)'}
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 space-y-1">
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold uppercase block">Overtime Late Drops</span>
            <strong className="text-lg font-bold text-slate-900 dark:text-white">{overtimeList.length} Personnel</strong>
            <span className="text-[10px] text-slate-500 block">Biometric Clock-Out Verified</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1">
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase block">Morning Absenteeism Purges</span>
            <strong className="text-lg font-bold text-slate-900 dark:text-white">{absenteeismLogs.length} Stops Purged</strong>
            <span className="text-[10px] text-slate-500 block">Leave & Remote Sync Active</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase block">Fuel & Distance Savings</span>
            <strong className="text-lg font-bold text-slate-900 dark:text-white">KSh 14,200 / wk</strong>
            <span className="text-[10px] text-slate-500 block">42.8 km Zero-Traffic Savings</span>
          </div>
        </div>
      </div>

      {/* Overtime Transport Auto-Detection Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock size={18} className="text-purple-600 dark:text-purple-400" />
          Overtime & Late Night Staff Transport Auto-Detection ({overtimeList.length})
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-3">Employee & Dept</th>
                <th className="py-3 px-3">Clock-Out Time</th>
                <th className="py-3 px-3">Overtime Duration</th>
                <th className="py-3 px-3">Supervisor Approval</th>
                <th className="py-3 px-3">Drop-off Zone Cluster</th>
                <th className="py-3 px-3">Shuttle Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {overtimeList.map((ot) => (
                <tr key={ot.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 dark:text-white block">{ot.name}</strong>
                    <span className="text-[10px] text-slate-400 font-mono block">{ot.department}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-purple-600 dark:text-purple-400">{ot.clockOut}</td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{ot.overtimeHours}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{ot.supervisorApproval}</td>
                  <td className="py-3 px-3 font-mono text-indigo-600 dark:text-indigo-400">{ot.dropOffZone}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ot.status === 'SHUTTLE_ASSIGNED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {ot.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {ot.status !== 'SHUTTLE_ASSIGNED' && (
                      <button
                        onClick={() => handleApproveOvertimeShuttle(ot.id)}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-[11px] cursor-pointer"
                      >
                        Approve Drop
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Morning Absenteeism Route Cleansing Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserX size={18} className="text-rose-600 dark:text-rose-400" />
          Morning Leave / Absenteeism Route Cleansing Audit
        </h3>

        <div className="space-y-3">
          {absenteeismLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 dark:text-white">{log.name}</strong>
                  <span className="text-slate-400 font-mono">({log.department})</span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-bold font-mono">
                    {log.reason}
                  </span>
                </div>
                <div className="text-slate-500 font-mono text-[11px]">
                  Assigned Route: <strong className="text-indigo-600 dark:text-indigo-400">{log.assignedRoute}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] shrink-0">
                ⚡ <strong>Optimization:</strong> {log.routeOptimizedAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
