import { Building2, Users, UserCheck, ShieldCheck, MapPin, Calendar, GitFork, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export function EmploymentOrgTab({ employee, allEmployees }) {
  const manager = allEmployees.find((e) => e.full_name === employee?.manager_name) || {
    full_name: employee?.manager_name || "Sarah Jenkins",
    job_title: "VP of People & HR Ops",
    department: "Executive",
    email: "s.jenkins@staffroom.io",
  };

  const directReports = allEmployees.filter((e) => e.manager_name === employee?.full_name);

  return (
    <div className="space-y-6">
      {/* Job & Org Details */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-500" />
          Job Profile & Placement
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Job Title</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{employee?.job_title}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5 block">{employee?.department}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Employment Type</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{employee?.employment_type || "Full-Time Permanent"}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Branch</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">Austin Tech Campus (HQ)</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Work Model</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">Hybrid (3 Days Office / 2 Remote)</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Cost Center Code</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">CC-HR-9042</span>
          </div>
        </div>
      </div>

      {/* Reporting Structure Visualizer */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <GitFork className="w-4 h-4 text-indigo-500" />
            Organizational Reporting Line
          </h3>
          <Link
            to={createPageUrl("OrgChart")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View Full Company Org Chart</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="max-w-xl mx-auto space-y-4">
          {/* Manager Node */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                SJ
              </div>
              <div>
                <p className="text-[10px] uppercase font-extrabold text-slate-400">Reports To (Manager)</p>
                <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{manager.full_name}</p>
                <p className="text-xs text-slate-500 font-semibold">{manager.job_title}</p>
              </div>
            </div>
          </div>

          <div className="w-0.5 h-6 bg-indigo-300 dark:bg-indigo-800 mx-auto" />

          {/* Current Employee Node */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border-2 border-indigo-500 flex items-center justify-between shadow-md shadow-indigo-200/50 dark:shadow-none">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                {employee?.full_name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white">
                  Active Subject Profile
                </span>
                <p className="font-extrabold text-slate-900 dark:text-slate-100 text-base mt-0.5">{employee?.full_name}</p>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{employee?.job_title}</p>
              </div>
            </div>
          </div>

          <div className="w-0.5 h-6 bg-indigo-300 dark:bg-indigo-800 mx-auto" />

          {/* Direct Reports List */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
              Direct Reports ({directReports.length})
            </p>

            {directReports.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 font-medium">
                No direct reports currently assigned to this employee.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {directReports.map((r) => (
                  <Link
                    key={r.id}
                    to={createPageUrl("EmployeeProfile", { id: r.id })}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-indigo-300 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                      {r.full_name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">{r.full_name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{r.job_title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
