import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Receipt,
  Download
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { attendanceService, leaveService, payrollService } from "@/services/domainServices";
import { createPageUrl } from "@/utils";

export default function EmployeeHomeView() {
  const { user } = useAuth();
  const [clockedIn, setClockedIn] = useState(true);
  const [clockTime, setClockTime] = useState("07:58 AM");
  const [loading, setLoading] = useState(false);

  const handleClockToggle = async () => {
    setLoading(true);
    setTimeout(() => {
      setClockedIn(!clockedIn);
      setClockTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* WELCOME HERO + CLOCK IN BANNER */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">Employee Personal Portal</span>
          <h2 className="text-xl font-black text-[#102A56] dark:text-white mt-1">
            Welcome back, {user?.first_name || user?.full_name || "Employee"} 👋
          </h2>
          <p className="text-xs text-[#526581] dark:text-slate-400 mt-0.5">
            {user?.job_title || "Staff Member"} • {user?.department || "Department"}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#F5F8FC] dark:bg-slate-800 p-3 rounded-xl border border-[#E4EAF3] dark:border-slate-700">
          <div className="text-right">
            <span className="text-[10px] font-bold text-[#526581] dark:text-slate-400 uppercase block">Attendance Status</span>
            <span className={`text-xs font-bold font-mono ${clockedIn ? "text-emerald-600" : "text-slate-500"}`}>
              {clockedIn ? `Clocked In at ${clockTime}` : "Clocked Out"}
            </span>
          </div>

          <button
            onClick={handleClockToggle}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-white ${
              clockedIn ? "bg-rose-600 hover:bg-rose-500" : "bg-[#2563EB] hover:bg-blue-500"
            }`}
          >
            {loading ? "Processing..." : clockedIn ? "Clock Out" : "Clock In Now"}
          </button>
        </div>
      </div>

      {/* WHAT MATTERS (MY PERSONAL METRICS) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
            <User size={14} className="text-[#2563EB]" /> What Matters (My Overview)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                <Calendar size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Annual Leave
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">My Leave Balance</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">18 Days</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Clock size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                This Month
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Punctuality Score</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">100%</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <FileText size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                In Progress
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">My Assigned Tasks</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">4</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <DollarSign size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                May 2026 Ready
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Latest Payslip</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">Available</span>
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
            <span className="text-[10px] text-[#526581]">Personal Actions</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Acknowledge Updated HR Policy v4.2</strong>
                <span className="text-[11px] text-[#526581]">Remote work & overtime guidelines</span>
              </div>
              <Link to={createPageUrl("KnowledgeBase")} className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold">
                Read Policy
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Annual Self-Appraisal Due</strong>
                <span className="text-[11px] text-[#526581]">Performance review section 1</span>
              </div>
              <Link to={createPageUrl("Performance")} className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold">
                Complete
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider">
              My Recent Activity
            </h3>
            <span className="text-[10px] text-[#526581] font-mono">Personal Feed</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Clocked In at {clockTime}</strong>
                <span className="text-[11px] text-[#526581]">Location: Office Portal</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">Today</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">May 2026 Payslip Issued</strong>
                <span className="text-[11px] text-[#526581]">Verified by Finance Dept</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">Yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT SHOULD I DO NEXT (EMPLOYEE QUICK ACTIONS) */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider">
          What Should I Do Next? (Quick Self-Service)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <Link
            to={createPageUrl("Leave")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center gap-2 font-semibold transition-all group"
          >
            <Calendar size={16} className="text-[#2563EB] group-hover:text-white" />
            <span>Apply for Leave</span>
          </Link>

          <Link
            to={createPageUrl("Payroll")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center gap-2 font-semibold transition-all group"
          >
            <Download size={16} className="text-[#2563EB] group-hover:text-white" />
            <span>View Payslip</span>
          </Link>

          <Link
            to={createPageUrl("Expenses")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center gap-2 font-semibold transition-all group"
          >
            <Receipt size={16} className="text-[#2563EB] group-hover:text-white" />
            <span>Submit Claim</span>
          </Link>

          <Link
            to={createPageUrl("DutyRoster")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center gap-2 font-semibold transition-all group"
          >
            <Clock size={16} className="text-[#2563EB] group-hover:text-white" />
            <span>My Shift Roster</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
