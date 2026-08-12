import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionContext";
import RoleSelector, { ROLES } from "@/components/dashboard/RoleSelector";
import ExecutiveView from "@/components/dashboard/roles/ExecutiveView";
import HRView from "@/components/dashboard/roles/HRView";
import FinanceView from "@/components/dashboard/roles/FinanceView";
import OperationsView from "@/components/dashboard/roles/OperationsView";
import DeptManagerView from "@/components/dashboard/roles/DeptManagerView";
import TeamLeadView from "@/components/dashboard/roles/TeamLeadView";
import EmployeeHomeView from "@/components/dashboard/roles/EmployeeHomeView";
import PlatformAdminView from "@/components/dashboard/roles/PlatformAdminView";
import WidgetErrorBoundary from "@/components/common/WidgetErrorBoundary";
import { Sliders, Sparkles, Building2, User } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { roleLevel } = usePermissions();

  // Helper to determine initial role dashboard
  const getDefaultRoleView = () => {
    const rawRole = (user?.role || "").toLowerCase();
    const dept = (user?.department || "").toLowerCase();

    if (rawRole.includes("owner") || rawRole.includes("super_admin") || rawRole.includes("system owner")) {
      return "executive";
    }
    if (rawRole.includes("platform") || rawRole.includes("it_admin")) {
      return "platform_admin";
    }
    if (rawRole.includes("hr") || dept.includes("hr") || dept.includes("people")) {
      return "hr";
    }
    if (rawRole.includes("payroll") || rawRole.includes("finance") || dept.includes("finance")) {
      return "finance";
    }
    if (rawRole.includes("operations") || dept.includes("operations") || dept.includes("transport")) {
      return "operations";
    }
    if (rawRole.includes("department admin") || rawRole.includes("manager")) {
      return "dept_manager";
    }
    if (rawRole.includes("team lead") || rawRole.includes("lead")) {
      return "team_lead";
    }
    return "employee";
  };

  const [activeRole, setActiveRole] = useState(getDefaultRoleView);

  useEffect(() => {
    setActiveRole(getDefaultRoleView());
  }, [user]);

  // Map role ID to View Component
  const renderRoleDashboard = () => {
    switch (activeRole) {
      case "executive":
        return <ExecutiveView />;
      case "hr":
        return <HRView />;
      case "finance":
        return <FinanceView />;
      case "operations":
        return <OperationsView />;
      case "dept_manager":
        return <DeptManagerView />;
      case "team_lead":
        return <TeamLeadView />;
      case "employee":
        return <EmployeeHomeView />;
      case "platform_admin":
        return <PlatformAdminView />;
      default:
        return <ExecutiveView />;
    }
  };

  const currentRoleObj = ROLES.find((r) => r.id === activeRole) || ROLES[0];

  return (
    <div className="space-y-6 pb-12 font-sans text-[#102A43] dark:text-slate-100">
      {/* GREETING & ROLE SWITCHER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE6F2] dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#102A43] dark:text-white">
              Good morning, {user?.first_name || user?.full_name?.split(" ")[0] || "Wambui"} 👋
            </h1>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EAF3FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 border border-[#2563EB]/20 hidden sm:inline-block">
              {currentRoleObj.label} Dashboard
            </span>
          </div>
          <p className="text-xs text-[#52677F] dark:text-slate-400 mt-0.5">
            {currentRoleObj.desc}
          </p>
        </div>

        {/* ROLE VIEW SELECTOR */}
        <RoleSelector currentRole={activeRole} onSelectRole={setActiveRole} />
      </div>

      {/* RENDER TAILORED ROLE DASHBOARD */}
      <WidgetErrorBoundary title={`${currentRoleObj.label} Dashboard View`}>
        {renderRoleDashboard()}
      </WidgetErrorBoundary>
    </div>
  );
}
