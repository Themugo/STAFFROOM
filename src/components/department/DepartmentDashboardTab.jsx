import React from 'react'
import {
  Users, CheckSquare, Briefcase, ShieldCheck, Clock, MessageSquare, Activity,
  Calendar, ArrowUpRight, DollarSign, CheckCircle2, AlertTriangle, Plus, ChevronRight
} from 'lucide-react'
import { StatCard } from '../ui'
import { initials } from '../../lib/format'

export default function DepartmentDashboardTab({
  currentDept,
  tasks,
  projects,
  approvals,
  announcements,
  onOpenModal,
  onApproveRequest,
  onNavigateTab
}) {
  const pendingApprovals = approvals.filter(a => a.status === 'PENDING')
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length
  const totalTasks = tasks.length
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Stat Card Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label={`${currentDept.code} Headcount`}
          value={currentDept.memberCount || 28}
          color="indigo"
        />
        <StatCard
          icon={CheckSquare}
          label="Tasks In Progress"
          value={tasks.filter(t => t.status === 'IN_PROGRESS').length}
          color="emerald"
        />
        <StatCard
          icon={Briefcase}
          label="Active Projects"
          value={projects.length}
          color="purple"
        />
        <StatCard
          icon={ShieldCheck}
          label="Pending Approvals"
          value={pendingApprovals.length}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Operational Feed (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule & Operational Milestones */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today's Operational Schedule & Shift Shifts
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{currentDept.name} Daily Operations Briefing</p>
                    <p className="text-slate-400 text-[11px]">09:00 AM - 09:30 AM • Operations Hub Room A</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">Active Now</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Shift Handover & Duty Roster Sync</p>
                    <p className="text-slate-400 text-[11px]">02:00 PM - 02:30 PM • Duty Station 2</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-[10px]">Scheduled</span>
              </div>
            </div>
          </div>

          {/* Pending Approvals Queue */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Manager Approval Queue</h3>
              </div>
              <button
                onClick={() => onNavigateTab('approvals')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                View Approval Center <ChevronRight size={14} />
              </button>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-xs text-slate-400">
                No pending manager approvals for {currentDept.name}.
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingApprovals.map((app) => (
                  <div key={app.id} className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{app.applicant}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">{app.type}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">{app.amountOrDays} • Submitted {app.date}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => onApproveRequest(app.id, false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => onApproveRequest(app.id, true)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 cursor-pointer shadow-sm"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Projects Tracker */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase size={18} className="text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Projects & Milestones</h3>
              </div>
              <button
                onClick={() => onNavigateTab('projects')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Gantt & Projects <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.health === 'HEALTHY' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {p.health}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${p.completion}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Lead: {p.lead}</span>
                    <span>{p.completion}% Complete • Committed: ${p.spent.toLocaleString()} / ${p.budget.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Widget Column */}
        <div className="space-y-6">
          {/* Department Leader Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/30 flex items-center justify-center font-black text-indigo-200 border border-indigo-400/30 text-lg shrink-0">
                {initials(currentDept.head || 'DH')}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-indigo-300 tracking-wider">Department Head</span>
                <h4 className="text-base font-bold">{currentDept.head || 'Department Manager'}</h4>
                <p className="text-xs text-indigo-200/80">{currentDept.code} Leadership</p>
              </div>
            </div>
            <p className="text-xs text-indigo-100/70 leading-relaxed border-t border-indigo-800/60 pt-3">
              {currentDept.description || 'Managing operational excellence, compliance, team capacity, and project delivery.'}
            </p>
          </div>

          {/* Department Announcements Feed */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Department Comms</h3>
              </div>
              <button onClick={() => onOpenModal('announcement')} className="text-xs text-indigo-600 font-bold hover:underline">
                + Post
              </button>
            </div>

            <div className="space-y-3">
              {announcements.map((anc) => (
                <div key={anc.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{anc.title}</span>
                    {anc.pinned && <span className="text-[10px] text-amber-500 font-bold uppercase">Pinned</span>}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">{anc.content}</p>
                  <div className="text-[10px] text-slate-400 font-mono pt-1">By {anc.author} • {anc.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Capacity Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" />
              Roster & Shift Attendance
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50">
                <span className="text-base font-black text-emerald-700 dark:text-emerald-400 block">88%</span>
                <span className="text-[10px] text-slate-500 font-medium">On Duty</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50">
                <span className="text-base font-black text-indigo-700 dark:text-indigo-400 block">8%</span>
                <span className="text-[10px] text-slate-500 font-medium">Remote</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50">
                <span className="text-base font-black text-amber-700 dark:text-amber-400 block">4%</span>
                <span className="text-[10px] text-slate-500 font-medium">On Leave</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
