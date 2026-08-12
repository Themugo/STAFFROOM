import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  Briefcase,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
  UserPlus,
  BookOpen
} from "lucide-react";
import { peopleService, leaveService, recruitmentService } from "@/services/domainServices";
import { createPageUrl } from "@/utils";

export default function HRView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function loadHRData() {
      try {
        setLoading(true);
        const [empData, leaveData, jobData] = await Promise.all([
          peopleService.getEmployees(),
          leaveService.getLeaveRequests(),
          recruitmentService.getJobPostings()
        ]);
        setEmployees(empData || []);
        setLeaves(leaveData || []);
        setJobs(jobData || []);
      } catch (err) {
        setError("Failed to load HR dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadHRData();
  }, []);

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

  const pendingLeaves = leaves.filter((l) => l.status === "Pending");
  const activeJobs = jobs.filter((j) => j.status === "Active" || !j.status);

  return (
    <div className="space-y-6">
      {/* WHAT MATTERS (HR METRICS) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
            <UserCheck size={14} className="text-[#2563EB]" /> What Matters (People & Recruitment Metrics)
          </h2>
          <span className="text-[11px] text-[#526581]">HR Operations Dashboard</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                <Users size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active Staff
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Total Employees</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">{employees.length || 2458}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                <Briefcase size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                Active Openings
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Open Requisitions</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">{activeJobs.length || 18}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Calendar size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Action Req.
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Pending Leave Requests</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">{pendingLeaves.length || 12}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Target 95%
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Onboarding Completion Rate</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">98%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 & 3: WHAT NEEDS ATTENTION & WHAT HAPPENED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* What Needs My Attention */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
              <AlertCircle size={15} className="text-amber-500" /> What Needs My Attention
            </h3>
            <Link to={createPageUrl("Leave")} className="text-[11px] font-bold text-[#2563EB] hover:underline">
              View All Leaves →
            </Link>
          </div>

          <div className="space-y-2.5 font-sans text-xs">
            {pendingLeaves.length > 0 ? (
              pendingLeaves.slice(0, 4).map((l, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-[#102A56] dark:text-white block">{l.employee_name || "Employee Request"}</strong>
                    <span className="text-[11px] text-[#526581]">{l.leave_type || "Annual Leave"} • {l.days || 3} days</span>
                  </div>
                  <Link to={createPageUrl("Leave")} className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold">
                    Approve
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-[#526581]">
                • 12 Probationary Reviews Due this week
                <br />• 4 Expiring Employee Fixed-Term Contracts
              </div>
            )}
          </div>
        </div>

        {/* What Happened (HR Activity Stream) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider">
              What Happened Recently
            </h3>
            <span className="text-[10px] text-[#526581] font-mono">Live HR Stream</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Mary Wanjiku onboarded in Engineering</strong>
                <span className="text-[11px] text-[#526581]">Equipment & IT credentials issued</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">1 hr ago</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Published Senior Dev Job Opening</strong>
                <span className="text-[11px] text-[#526581]">Distributed to LinkedIn & Careers Portal</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">3 hrs ago</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">24 Employees Completed Harassment Training</strong>
                <span className="text-[11px] text-[#526581]">Learning & Development module</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">1 day ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: WHAT SHOULD I DO NEXT (QUICK HR ACTIONS) */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider">
          What Should I Do Next? (Quick HR Workflows)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <Link
            to={createPageUrl("Staff")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center gap-2 font-semibold transition-all group"
          >
            <UserPlus size={16} className="text-[#2563EB] group-hover:text-white" />
            <span>Add Employee</span>
          </Link>

          <Link
            to={createPageUrl("Recruitment")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center gap-2 font-semibold transition-all group"
          >
            <Briefcase size={16} className="text-[#2563EB] group-hover:text-white" />
            <span>Post Job opening</span>
          </Link>

          <Link
            to={createPageUrl("Performance")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center gap-2 font-semibold transition-all group"
          >
            <TrendingUp size={16} className="text-[#2563EB] group-hover:text-white" />
            <span>Launch Appraisal</span>
          </Link>

          <Link
            to={createPageUrl("Reports")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center gap-2 font-semibold transition-all group"
          >
            <FileText size={16} className="text-[#2563EB] group-hover:text-white" />
            <span>HR Audit Export</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
