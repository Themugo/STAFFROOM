import {
  User,
  CheckCircle2,
  Clock,
  Palmtree,
  Laptop,
  TrendingUp,
  FileText,
  Calendar,
  AlertTriangle,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  DollarSign
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

export function OverviewTab({ employee, leaveRequests, assets, documents, payrollRecords, attendance, timeline }) {
  return (
    <div className="space-y-6">
      {/* 360 Degree KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leave Balance</span>
            <div className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Palmtree className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">18 Days</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Annual leave accrued</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Assets</span>
            <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">{assets?.length || 4} Items</p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">Hardware & Licenses</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Performance Rating</span>
            <div className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">4.8 / 5.0</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">Exceeds Expectations</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Document Health</span>
            <div className="p-2 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">{documents?.length || 4} Verified</p>
          <p className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold mt-0.5">All Compliance Clear</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Employment Summary & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employment Details Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-500" />
              Employment & Role Snapshot
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Manager</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
                  {employee?.manager_name || "Sarah Jenkins (VP of HR)"}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Department & Branch</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
                  {employee?.department || "HR"} • Austin Main HQ
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Date Hired</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
                  {employee?.hire_date || "2024-01-15"}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Compensation</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">
                  ${(employee?.base_salary || 95000).toLocaleString()} / year
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Recent Career Milestones & Events
            </h3>

            <div className="space-y-3">
              {(timeline || []).slice(0, 3).map((item) => (
                <div key={item.id} className="flex gap-3 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{item.event}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{item.date}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Status Widgets */}
        <div className="space-y-6">
          {/* Attendance Snapshot */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Attendance Snapshot
            </h3>
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Today's Status</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Clocked In at 08:54 AM</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                On Time
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Monthly Punctuality:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">98.5%</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Work Location:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Remote / HQ Hybrid</span>
              </div>
            </div>
          </div>

          {/* Pending Approvals & Next Steps */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Upcoming Milestones
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-800 dark:text-slate-200">Annual Performance Review</p>
                <p className="text-[11px] text-slate-400">Scheduled for November 15, 2026</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-800 dark:text-slate-200">Security Training Renewal</p>
                <p className="text-[11px] text-slate-400">Due in 45 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
