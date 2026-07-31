import { X, Mail, Phone, MapPin, Calendar, Building2, User, ExternalLink, Palmtree, DollarSign, Laptop, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "@/components/ui/StatusBadge";

export default function EmployeeQuickPreviewDrawer({ employee, onClose, onEdit }) {
  if (!employee) return null;

  const initials = employee.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-200">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Employee Profile</span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Avatar & Identity */}
            <div className="mt-6 text-center space-y-3">
              <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{employee.full_name}</h2>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{employee.job_title}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <StatusBadge status={employee.status || "Active"} />
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                    {employee.department || "Engineering"}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="mt-6 space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{employee.email || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" /> Phone
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.phone || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Location
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.location || "HQ - Austin, TX"}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Hire Date
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.hire_date || "2024-01-15"}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-indigo-500" /> Base Salary
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ${(employee.base_salary || 95000).toLocaleString()}/yr
                </span>
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-center">
                <p className="text-[10px] uppercase font-bold text-indigo-400">Leave Balance</p>
                <p className="text-base font-extrabold text-indigo-700 dark:text-indigo-300 mt-0.5">18 Days</p>
              </div>
              <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-center">
                <p className="text-[10px] uppercase font-bold text-sky-400">Assigned Assets</p>
                <p className="text-base font-extrabold text-sky-700 dark:text-sky-300 mt-0.5">3 Items</p>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <Link
              to={createPageUrl("EmployeeProfile", { id: employee.id })}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition-colors"
            >
              <span>Open Full 360° Workspace</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Edit Employee Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
