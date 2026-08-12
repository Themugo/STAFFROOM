import React from 'react'
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  Award,
  BarChart2,
  ArrowUpRight,
  ShieldCheck,
  Target
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

export default function ProductivityInsights() {
  const weeklyVelocityData = [
    { day: 'Mon', completed: 18, target: 15 },
    { day: 'Tue', completed: 24, target: 20 },
    { day: 'Wed', completed: 31, target: 25 },
    { day: 'Thu', completed: 28, target: 25 },
    { day: 'Fri', completed: 35, target: 30 },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Workplace Productivity & SLA Insights
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personal & team task velocity, approval SLAs, and time saved through StaffRoom automation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-[11px] font-bold flex items-center gap-1">
            <ArrowUpRight size={14} /> +18.4% Efficiency MoM
          </span>
        </div>
      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Tasks Completed
          </span>
          <div className="flex items-baseline justify-between">
            <strong className="text-2xl font-black text-slate-900 dark:text-white">136</strong>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">100% Target</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Avg Approval SLA
          </span>
          <div className="flex items-baseline justify-between">
            <strong className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              2.4 hrs
            </strong>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">-45 mins vs target</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Automation Hours Saved
          </span>
          <div className="flex items-baseline justify-between">
            <strong className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              42 hrs
            </strong>
            <span className="text-[10px] font-mono text-slate-400 font-bold">This Month</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Focus Score
          </span>
          <div className="flex items-baseline justify-between">
            <strong className="text-2xl font-black text-purple-600 dark:text-purple-400">
              92 / 100
            </strong>
            <span className="text-[10px] font-mono text-purple-600 font-bold">Optimal</span>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Weekly Task Execution Velocity vs Goal
        </h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyVelocityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
              }}
            />
            <Bar dataKey="completed" fill="#6366f1" radius={[8, 8, 0, 0]} name="Completed Tasks" />
            <Bar dataKey="target" fill="#cbd5e1" radius={[8, 8, 0, 0]} name="Daily Goal" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
