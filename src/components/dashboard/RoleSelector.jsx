import { Crown, UserCheck, DollarSign, Settings, Briefcase, Users, User, ShieldCheck } from "lucide-react";

export const ROLES = [
  { id: "executive", label: "Executive", icon: Crown, desc: "Org-level strategic intelligence, revenue metrics & executive retention" },
  { id: "hr", label: "HR", icon: UserCheck, desc: "Headcount growth, open requisitions, turnover & onboarding" },
  { id: "finance", label: "Finance & Payroll", icon: DollarSign, desc: "Payroll disbursements, statutory returns & expense approvals" },
  { id: "operations", label: "Operations", icon: Settings, desc: "Fleet utilization, facility tickets & asset registers" },
  { id: "dept_manager", label: "Dept Manager", icon: Briefcase, desc: "Department attendance, team leave approvals & budget variance" },
  { id: "team_lead", label: "Team Lead", icon: Users, desc: "Shift coverage, task sprint progress & team daily attendance" },
  { id: "employee", label: "Employee Home", icon: User, desc: "Personal portal, attendance clock-in, leave balances & payslips" },
  { id: "platform_admin", label: "Platform Admin", icon: ShieldCheck, desc: "System health, API latency, tenant logs & platform configs" },
];

export default function RoleSelector({ currentRole, onSelectRole }) {
  return (
    <div className="flex items-center gap-1.5 bg-[#F6F9FD] dark:bg-slate-900 p-1.5 rounded-2xl border border-[#DCE6F2] dark:border-slate-800 overflow-x-auto custom-scrollbar">
      <span className="text-[10px] uppercase font-bold text-[#52677F] dark:text-slate-400 px-2 shrink-0 hidden sm:inline">
        View As:
      </span>
      {ROLES.map((role) => {
        const Icon = role.icon;
        const active = currentRole === role.id;
        return (
          <button
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              active
                ? "bg-[#2563EB] text-white shadow-2xs font-bold"
                : "text-[#52677F] dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-[#102A43] dark:hover:text-white"
            }`}
            title={role.desc}
          >
            <Icon className={`w-3.5 h-3.5 ${active ? "text-white" : "text-[#52677F] dark:text-slate-400"}`} />
            <span>{role.label}</span>
          </button>
        );
      })}
    </div>
  );
}
