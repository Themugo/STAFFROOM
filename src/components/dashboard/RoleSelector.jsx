import { Crown, UserCheck, DollarSign, Briefcase, User, Sparkles } from "lucide-react";

export const ROLES = [
  { id: "ceo", label: "CEO / Executive View", icon: Crown, desc: "Global headcount, high-level financials & org health" },
  { id: "hrm", label: "HR Director View", icon: UserCheck, desc: "Attendance rate, leave approvals & onboarding queue" },
  { id: "payroll", label: "Payroll Officer View", icon: DollarSign, desc: "Disbursements, pending runs & budget compliance" },
  { id: "dept_manager", label: "Dept Manager View", icon: Briefcase, desc: "Team presence, performance reviews & leave balance" },
  { id: "employee", label: "Employee View", icon: User, desc: "Personal portal, time-off requests & payslips" },
];

export default function RoleSelector({ currentRole, onSelectRole }) {
  return (
    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl overflow-x-auto custom-scrollbar">
      {ROLES.map((role) => {
        const Icon = role.icon;
        const active = currentRole === role.id;
        return (
          <button
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              active
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/60 dark:border-slate-700/60"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
            title={role.desc}
          >
            <Icon className={`w-3.5 h-3.5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
            <span>{role.label.split(" ")[0]} View</span>
          </button>
        );
      })}
    </div>
  );
}
