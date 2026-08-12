import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Calendar,
  Layers,
  UserCheck
} from "lucide-react";
import { createPageUrl } from "@/utils";

export default function TeamLeadView() {
  return (
    <div className="space-y-6">
      {/* WHAT MATTERS (TEAM SPRINT & SHIFT COVERAGE) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
            <Users size={14} className="text-[#2563EB]" /> What Matters (Team Lead Operations)
          </h2>
          <span className="text-[11px] text-[#526581]">Sprint & Shift Overview</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <UserCheck size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                10/10 On Duty
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Daily Team Presence</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">100%</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                <Layers size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Sprint 14
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Task Sprint Progress</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">78%</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Clock size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                2 Pending
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Unassigned Sprint Tasks</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">2</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Calendar size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Fully Covered
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Weekly Shift Coverage</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT NEEDS ATTENTION & WHAT HAPPENED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
              <AlertCircle size={15} className="text-[#2563EB]" /> What Needs My Attention
            </h3>
            <span className="text-[10px] text-[#526581]">Team Action Items</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">2 Backlog Tasks Require Owner Assignment</strong>
                <span className="text-[11px] text-[#526581]">Backend API Integration & Unit Testing</span>
              </div>
              <Link to={createPageUrl("ProjectManagement")} className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold">
                Assign
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Shift Swap Request: Alex & Brian</strong>
                <span className="text-[11px] text-[#526581]">Friday Night Shift Coverage Swap</span>
              </div>
              <Link to={createPageUrl("DutyRoster")} className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold">
                Approve Swap
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider">
              What Happened Recently
            </h3>
            <span className="text-[10px] text-[#526581] font-mono">Team Standup Stream</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Daily Morning Standup Completed</strong>
                <span className="text-[11px] text-[#526581]">10 Team members present, 0 blockers logged</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">08:30 AM</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">8 Sprint Tasks Marked Complete</strong>
                <span className="text-[11px] text-[#526581]">Verified by QA testing suite</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">Yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT SHOULD I DO NEXT */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider">
          What Should I Do Next? (Team Lead Workflows)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <Link
            to={createPageUrl("ProjectManagement")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold transition-all group"
          >
            <span>Assign Backlog Sprint Tasks</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={createPageUrl("Attendance")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold transition-all group"
          >
            <span>Verify Shift Attendance Logs</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={createPageUrl("DutyRoster")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold transition-all group"
          >
            <span>Review Shift Swap Applications</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
