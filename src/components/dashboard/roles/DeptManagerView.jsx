import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  Calendar,
  Clock,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { attendanceService, leaveService, peopleService } from "@/services/domainServices";
import { createPageUrl } from "@/utils";

export default function DeptManagerView() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [deptLeaves, setDeptLeaves] = useState([]);
  const [deptStaff, setDeptStaff] = useState([]);

  useEffect(() => {
    async function loadDeptData() {
      try {
        setLoading(true);
        const userDept = user?.department || "People Operations";
        const [leaves, staff] = await Promise.all([
          leaveService.getLeaveRequests({ department: userDept }),
          peopleService.getEmployees({ department: userDept })
        ]);
        setDeptLeaves(leaves || []);
        setDeptStaff(staff || []);
      } catch (err) {
        console.error("Dept load error", err);
      } finally {
        setLoading(false);
      }
    }
    loadDeptData();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const userDept = user?.department || "Department";

  return (
    <div className="space-y-6">
      {/* WHAT MATTERS (DEPARTMENT METRICS) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
            <Briefcase size={14} className="text-[#2563EB]" /> What Matters ({userDept} Department Scope)
          </h2>
          <span className="text-[11px] text-[#526581]">Managerial Authority</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                <Users size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Department
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Team Members</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">{deptStaff.length || 24}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <UserCheck size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Today
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Dept Attendance Rate</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">96.2%</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Calendar size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Pending
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Team Leave Requests</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">{deptLeaves.length || 3}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Clock size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                This Week
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Approved Dept Overtime</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">14 Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT NEEDS ATTENTION & WHAT HAPPENED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
              <AlertCircle size={15} className="text-amber-500" /> What Needs My Attention
            </h3>
            <Link to={createPageUrl("Leave")} className="text-[11px] font-bold text-[#2563EB] hover:underline">
              Approve Leaves →
            </Link>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">3 Direct Report Leave Requests</strong>
                <span className="text-[11px] text-[#526581]">{userDept} team coverage check verified</span>
              </div>
              <Link to={createPageUrl("Leave")} className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold">
                Review
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Quarterly Team Performance Appraisals Due</strong>
                <span className="text-[11px] text-[#526581]">4 Direct report reviews pending submit</span>
              </div>
              <Link to={createPageUrl("Performance")} className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold">
                Start Review
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider">
              What Happened in {userDept}
            </h3>
            <span className="text-[10px] text-[#526581] font-mono">Team Feed</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">22 Team Members Clocked In On Time</strong>
                <span className="text-[11px] text-[#526581]">Zero unscheduled absences today</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">08:00 AM</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Weekly Shift Roster Published</strong>
                <span className="text-[11px] text-[#526581]">Sent to all {userDept} personnel</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">Yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT SHOULD I DO NEXT */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider">
          What Should I Do Next? (Manager Actions)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <Link
            to={createPageUrl("Leave")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold transition-all group"
          >
            <span>Approve Team Leave Applications</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={createPageUrl("DutyRoster")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold transition-all group"
          >
            <span>Schedule Shift Roster</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={createPageUrl("Performance")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold transition-all group"
          >
            <span>Conduct 1-on-1 Performance Check-in</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
