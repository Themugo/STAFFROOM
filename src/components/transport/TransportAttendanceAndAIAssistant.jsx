import React, { useState } from 'react'
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Sparkles,
  Bot,
  TrendingDown,
  DollarSign,
  Fuel,
  Activity,
  AlertTriangle,
  RefreshCw,
  Check,
  X
} from 'lucide-react'

export const SAMPLE_ATTENDANCE_LOGS = [
  {
    id: 'ATT-301',
    passenger: 'Esther Njoki',
    department: 'Hospital Medical Staff',
    pickupStop: 'Westlands Mall Stage',
    expectedTime: '06:15 AM',
    status: 'BOARDED',
    notificationSent: 'SMS Alert Dispatched'
  },
  {
    id: 'ATT-302',
    passenger: 'Felix Otieno',
    department: 'NGO Field Team',
    pickupStop: 'Yaya Centre Stage',
    expectedTime: '06:30 AM',
    status: 'MISSED_PICKUP',
    notificationSent: 'App Push + SMS Warning'
  },
  {
    id: 'ATT-303',
    passenger: 'Winnie Chepngetich',
    department: 'Finance',
    pickupStop: 'South B Shopping Center',
    expectedTime: '06:45 AM',
    status: 'LATE',
    notificationSent: 'Driver Delay Alert'
  },
  {
    id: 'ATT-304',
    passenger: 'Geoffrey Mutua',
    department: 'Factory Operations',
    pickupStop: 'Thika Highway Junction',
    expectedTime: '07:00 AM',
    status: 'CANCELLED',
    notificationSent: 'Cancellation Confirmed'
  }
]

export const AI_RECOMMENDATIONS = [
  {
    id: 'REC-01',
    title: 'Consolidate Westlands Morning Route (Save 18% Fuel)',
    category: 'Route Merging',
    impact: 'High Cost Reduction',
    details: 'Attendance data shows 35% no-show rate on Westlands Stop #4. Merge Stops #3 and #4 into a single hub at Westlands Mall stage to bypass 12 mins traffic.',
    status: 'RECOMMENDED'
  },
  {
    id: 'REC-02',
    title: 'Swap 33-Seater Bus with 14-Seater Van for Night Shift',
    category: 'Fleet Swap',
    impact: 'KSh 8,500 / trip Saved',
    details: 'Tonight shift roster has 11 headcount. Replace 33-seater bus KCB 412A with 14-seater van KDD 891B to cut fuel burn by half.',
    status: 'RECOMMENDED'
  },
  {
    id: 'REC-03',
    title: 'Pre-dispatch Extra Shuttle for Mombasa Road Traffic',
    category: 'Traffic Avoidance',
    impact: 'Prevent 30-min Delay',
    details: 'Live GIS detects major congestion on Bellevue Flyover. Reroute South-Bound Shuttle via Southern Bypass.',
    status: 'RECOMMENDED'
  }
]

export default function TransportAttendanceAndAIAssistant({ onNotify }) {
  const [attendanceLogs, setAttendanceLogs] = useState(SAMPLE_ATTENDANCE_LOGS)
  const [aiRecs, setAiRecs] = useState(AI_RECOMMENDATIONS)
  const [activeTab, setActiveTab] = useState('ATTENDANCE')

  const handleApplyRecommendation = (recId) => {
    setAiRecs(prev =>
      prev.map(r => r.id === recId ? { ...r, status: 'APPLIED' } : r)
    )
    if (onNotify) {
      onNotify(`AI Optimization ${recId} applied successfully to live dispatch schedule!`)
    }
  }

  const handleStatusChange = (attId, newStatus) => {
    setAttendanceLogs(prev =>
      prev.map(a => a.id === attId ? { ...a, status: newStatus } : a)
    )
    if (onNotify) onNotify(`Attendance status updated for ${attId} to ${newStatus}.`)
  }

  return (
    <div className="space-y-6">
      {/* Sub-tab Toggle */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-mono font-bold">
        <button
          onClick={() => setActiveTab('ATTENDANCE')}
          className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'ATTENDANCE'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <Users size={16} /> Live Transport Attendance & Notifications
        </button>
        <button
          onClick={() => setActiveTab('AI_ASSISTANT')}
          className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'AI_ASSISTANT'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <Sparkles size={16} /> AI Transport Operational Assistant
        </button>
        <button
          onClick={() => setActiveTab('COST_KPI')}
          className={`px-4 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'COST_KPI'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <DollarSign size={16} /> Cost & Utilization Analytics
        </button>
      </div>

      {/* TAB 1: ATTENDANCE */}
      {activeTab === 'ATTENDANCE' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
                Passenger Pickup Attendance & Automated SMS/App Dispatch
              </h3>
              <p className="text-xs text-slate-500">
                Track boarding verification at every stop. Trigger automated SMS pickup reminders, delay notifications, and no-show alerts.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-3">Passenger & Dept</th>
                  <th className="py-3 px-3">Pickup Stop Stage</th>
                  <th className="py-3 px-3">Expected Time</th>
                  <th className="py-3 px-3">Boarding Status</th>
                  <th className="py-3 px-3">Notification Status</th>
                  <th className="py-3 px-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {attendanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <strong className="text-slate-900 dark:text-white block">{log.passenger}</strong>
                      <span className="text-[10px] text-slate-400 font-mono block">{log.department}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{log.pickupStop}</td>
                    <td className="py-3 px-3 font-mono text-indigo-600 dark:text-indigo-400">{log.expectedTime}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'BOARDED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : log.status === 'MISSED_PICKUP'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : log.status === 'LATE'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] font-mono text-slate-500">{log.notificationSent}</td>
                    <td className="py-3 px-3 text-right font-mono text-[10px]">
                      <select
                        value={log.status}
                        onChange={(e) => handleStatusChange(log.id, e.target.value)}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold cursor-pointer"
                      >
                        <option value="BOARDED">BOARDED</option>
                        <option value="MISSED_PICKUP">MISSED PICKUP</option>
                        <option value="LATE">LATE</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AI ASSISTANT */}
      {activeTab === 'AI_ASSISTANT' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot size={18} className="text-indigo-600 dark:text-indigo-400" />
              AI Transport Operational Assistant Recommendations
            </h3>
            <p className="text-xs text-slate-500">
              Real-time machine intelligence suggestions for pickup merges, vehicle size swaps, traffic bypasses, and cost reductions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiRecs.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-[10px] font-bold">
                      {rec.category}
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                      {rec.impact}
                    </span>
                  </div>

                  <strong className="text-sm font-bold text-slate-900 dark:text-white block leading-snug">
                    {rec.title}
                  </strong>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    {rec.details}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-mono text-[10px] text-slate-400">{rec.status}</span>
                  {rec.status !== 'APPLIED' ? (
                    <button
                      onClick={() => handleApplyRecommendation(rec.id)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer text-[11px]"
                    >
                      Apply Recommendation
                    </button>
                  ) : (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                      <Check size={14} /> Applied
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COST & KPI */}
      {activeTab === 'COST_KPI' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign size={18} className="text-emerald-600 dark:text-emerald-400" />
              Enterprise Transport Financial & Fleet Utilization KPIs
            </h3>
            <p className="text-xs text-slate-500">
              Detailed breakdown of fuel expenditure, maintenance, cost per employee, and department allocation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Monthly Fuel Expenditure</span>
              <strong className="text-lg font-bold text-slate-900 dark:text-white">KSh 482,000</strong>
              <span className="text-[10px] text-emerald-600 font-mono block">↓ 12% vs Last Month</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Avg Cost Per Employee</span>
              <strong className="text-lg font-bold text-slate-900 dark:text-white">KSh 3,450 / mo</strong>
              <span className="text-[10px] text-slate-500 font-mono block">Within HR Budget Ceiling</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Fleet Utilization Rate</span>
              <strong className="text-lg font-bold text-indigo-600 dark:text-indigo-400">89.4%</strong>
              <span className="text-[10px] text-slate-500 font-mono block">Peak Shift Efficiency</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">On-Time Pickup Rate</span>
              <strong className="text-lg font-bold text-emerald-600 dark:text-emerald-400">96.8%</strong>
              <span className="text-[10px] text-slate-500 font-mono block">0.2% Missed Stops</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
