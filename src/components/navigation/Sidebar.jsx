import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionContext";
import OrganizationSwitcher from "./OrganizationSwitcher";
import UserProfile from "./UserProfile";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  ChevronRight,
  ChevronDown,
  FileBarChart2,
  CalendarCheck,
  Settings,
  Palmtree,
  FileText,
  Heart,
  TrendingUp,
  GitBranch,
  ListChecks,
  UserCircle,
  FilePen,
  SlidersHorizontal,
  ArrowUpCircle,
  PieChart,
  Scale,
  Search,
  Star,
  Sparkles,
  Command,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  BookOpen,
  Calendar,
  Briefcase,
  MessageSquare,
  Code,
  Rocket,
  ShoppingCart,
  Boxes,
  Target,
  Crown,
  Globe,
  Share2,
  Database,
  Store,
  Bus,
  Palette,
  Sliders,
  Zap,
  X,
  Shield,
  Bell,
  CheckSquare,
  Building2
} from "lucide-react";

export const CATEGORIZED_NAV_GROUPS = [
  {
    title: "Primary",
    items: [
      { label: "Overview", icon: LayoutDashboard, page: "Dashboard", perm: "dashboard:overview:read" },
      { label: "My Work", icon: UserCircle, page: "SelfService", perm: "employees:self:read" },
      { label: "Notifications", icon: Bell, page: "Announcements", perm: "communication:announcements:read" },
    ],
  },
  {
    title: "Workforce",
    items: [
      { label: "Staff Directory", icon: Users, page: "Staff", perm: "employees:all:read" },
      { label: "Org Chart", icon: GitBranch, page: "OrgChart", perm: "employees:all:read" },
      { label: "Departments", icon: Building2, page: "Departments", perm: "departments:all:read" },
    ],
  },
  {
    title: "Time & Attendance",
    items: [
      { label: "Attendance", icon: CalendarCheck, page: "Attendance", perm: "attendance:self:read" },
      { label: "Duty Roster & Shifts", icon: Calendar, page: "DutyRoster", perm: "roster:self:read" },
    ],
  },
  {
    title: "Leave",
    items: [
      { label: "Leave Requests", icon: Palmtree, page: "Leave", perm: "leave:self:read" },
      { label: "Approval Center", icon: CheckSquare, page: "ApprovalCenter", perm: "leave:all:approve" },
    ],
  },
  {
    title: "Recruitment & Onboarding",
    items: [
      { label: "ATS & Recruitment", icon: Briefcase, page: "Recruitment", perm: "recruitment:all:read" },
      { label: "Onboarding", icon: ListChecks, page: "Onboarding", perm: "recruitment:all:read" },
    ],
  },
  {
    title: "Payroll & Finance",
    items: [
      { label: "Payroll", icon: DollarSign, page: "Payroll", perm: "payroll:self:read" },
      { label: "Budget", icon: PieChart, page: "Budget", perm: "payroll:all:read" },
      { label: "Procurement", icon: ShoppingCart, page: "Procurement", perm: "expenses:all:read" },
    ],
  },
  {
    title: "Performance & Talent",
    items: [
      { label: "Performance", icon: TrendingUp, page: "Performance", perm: "employees:all:read" },
      { label: "Goals & Strategy", icon: Target, page: "StrategyManagement", perm: "employees:all:read" },
      { label: "Benefits", icon: Heart, page: "Benefits", perm: "employees:all:read" },
      { label: "Learning & Dev", icon: BookOpen, page: "LearningDevelopment", perm: "employees:all:read" },
    ],
  },
  {
    title: "Documents",
    items: [
      { label: "Documents Repository", icon: FileText, page: "Documents", perm: "employees:self:read" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Transport & Fleet", icon: Bus, page: "TransportManagement", perm: "employees:all:read" },
      { label: "Asset Management", icon: Boxes, page: "AssetManagement", perm: "employees:all:read" },
    ],
  },
  {
    title: "Governance",
    items: [
      { label: "Policy Center", icon: BookOpen, page: "PolicyCenter", perm: "leave:policies:manage" },
      { label: "Compliance & Risk", icon: Scale, page: "GovernanceRiskCompliance", perm: "security:audit:read" },
      { label: "Audit Log", icon: ShieldCheck, page: "QAHardeningAudit", perm: "security:audit:read" },
      { label: "Security Center", icon: Shield, page: "SecurityCenter", perm: "security:center:read" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Workforce Analytics", icon: FileBarChart2, page: "WorkforceAnalytics", perm: "dashboard:analytics:read" },
      { label: "Reports", icon: FileBarChart2, page: "Reports", perm: "dashboard:overview:read" },
      { label: "AI Copilot", icon: Sparkles, page: "AICopilot", perm: "ai:copilot:use" },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Integration Hub", icon: Share2, page: "IntegrationHub", perm: "settings:organization:manage" },
      { label: "Organization", icon: Building2, page: "OrganizationSettings", perm: "settings:organization:manage" },
      { label: "Users & Roles", icon: Shield, page: "Users", perm: "users:all:read" },
      { label: "System Settings", icon: Settings, page: "Settings", perm: "settings:organization:manage" },
    ],
  },
];

export default function Sidebar({
  currentPageName,
  sidebarCollapsed,
  setSidebarCollapsed,
  sidebarOpen,
  setSidebarOpen,
  onOpenCommandPalette
}) {
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const { user } = useAuth() || {};
  const { hasPermission, hasModuleAccess } = usePermissions() || {};

  const userRole = user?.role || "Staff Member";
  const normalizedRole = userRole.toLowerCase();

  const isStaffOnly =
    normalizedRole.includes("staff") ||
    normalizedRole.includes("employee");

  const isDeptManager =
    normalizedRole.includes("dept") ||
    normalizedRole.includes("manager") ||
    normalizedRole.includes("team lead");

  const isHR = normalizedRole.includes("hr") || normalizedRole.includes("people");
  const isFinance = normalizedRole.includes("finance") || normalizedRole.includes("payroll");
  const isExecutive = normalizedRole.includes("executive") || normalizedRole.includes("ceo") || normalizedRole.includes("owner");
  const isAdmin = normalizedRole.includes("admin") || normalizedRole.includes("system");

  function isItemAuthorized(item) {
    if (isAdmin || isExecutive) return true;
    if (isStaffOnly) {
      const allowedForStaff = [
        "Dashboard", "SelfService", "Announcements", "Attendance", "DutyRoster",
        "Leave", "Benefits", "LearningDevelopment", "Documents", "PolicyCenter", "AICopilot"
      ];
      return allowedForStaff.includes(item.page);
    }
    if (isDeptManager) {
      const allowedForManager = [
        "Dashboard", "SelfService", "Announcements", "Staff", "OrgChart", "Departments",
        "Attendance", "DutyRoster", "Leave", "ApprovalCenter", "Performance",
        "StrategyManagement", "Benefits", "LearningDevelopment", "Documents",
        "TransportManagement", "AssetManagement", "Budget", "Procurement",
        "PolicyCenter", "GovernanceRiskCompliance", "QAHardeningAudit",
        "WorkforceAnalytics", "Reports", "AICopilot"
      ];
      return allowedForManager.includes(item.page);
    }
    if (isHR) {
      const allowedForHR = [
        "Dashboard", "SelfService", "Announcements", "Staff", "OrgChart", "Departments",
        "Attendance", "DutyRoster", "Leave", "ApprovalCenter", "Recruitment", "Onboarding",
        "Performance", "StrategyManagement", "Benefits", "LearningDevelopment", "Documents",
        "TransportManagement", "AssetManagement", "PolicyCenter", "GovernanceRiskCompliance",
        "QAHardeningAudit", "WorkforceAnalytics", "Reports", "AICopilot"
      ];
      return allowedForHR.includes(item.page);
    }
    if (isFinance) {
      const allowedForFinance = [
        "Dashboard", "SelfService", "Announcements", "Payroll", "Budget", "Procurement",
        "ExpenseClaims", "Reports", "ApprovalCenter", "Documents", "AICopilot"
      ];
      return allowedForFinance.includes(item.page);
    }
    // Fail-closed security boundary for unrecognized/unverified roles
    return false;
  }

  const filteredNavGroups = CATEGORIZED_NAV_GROUPS.map(group => {
    const validItems = group.items.filter(isItemAuthorized);
    return { ...group, items: validItems };
  }).filter(group => group.items.length > 0);

  const toggleGroup = (groupTitle) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-[#DCE6F2] transition-all duration-300 shadow-sm font-sans text-[#102A43]",
        sidebarCollapsed ? "w-[72px]" : "w-[250px]",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* Brand Header */}
      <div className="p-3.5 flex items-center justify-between border-b border-[#DCE6F2] bg-white">
        <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2.5 group overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm shadow-[#2563EB]/20">
            SR
          </div>
          {!sidebarCollapsed && (
            <div className="animate-in fade-in duration-200 min-w-0">
              <span className="text-[#102A43] font-extrabold text-sm tracking-tight block uppercase truncate">
                StaffRoom
              </span>
              <span className="text-[10px] text-[#2563EB] font-bold uppercase tracking-wider block -mt-0.5">
                Enterprise OS
              </span>
            </div>
          )}
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex p-1.5 text-[#52677F] hover:text-[#2563EB] hover:bg-[#F3F7FC] rounded-xl transition-colors cursor-pointer"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
          <button
            className="md:hidden text-[#52677F] hover:text-[#102A43] p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Workspace Selector */}
      <OrganizationSwitcher isCollapsed={sidebarCollapsed} />

      {/* Global Command Search Button */}
      <div className="px-3 py-1">
        <button
          onClick={onOpenCommandPalette}
          className={cn(
            "w-full flex items-center justify-between p-2 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] border border-[#DCE6F2] text-[#52677F] hover:text-[#2563EB] text-xs transition-colors cursor-pointer",
            sidebarCollapsed && "justify-center"
          )}
          title="Search StaffRoom... (⌘K)"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            {!sidebarCollapsed && <span className="font-medium text-[#52677F]">Search StaffRoom...</span>}
          </div>
          {!sidebarCollapsed && (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white text-[10px] font-bold text-[#7890A8] border border-[#DCE6F2]">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          )}
        </button>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-3 overflow-y-auto custom-scrollbar">
        {filteredNavGroups.map((group) => {
          const isCollapsed = collapsedGroups[group.title];
          return (
            <div key={group.title}>
              {!sidebarCollapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full px-2.5 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#7890A8] hover:text-[#102A43] transition-colors cursor-pointer"
                >
                  <span>{group.title}</span>
                  {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}

              {(!isCollapsed || sidebarCollapsed) && (
                <div className="space-y-0.5 mt-1">
                  {group.items.map(({ label, icon: Icon, page }) => {
                    const active = currentPageName === page;
                    return (
                      <Link
                        key={page}
                        to={createPageUrl(page)}
                        onClick={() => setSidebarOpen(false)}
                        title={sidebarCollapsed ? label : undefined}
                        className={cn(
                          "group/nav flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all",
                          sidebarCollapsed && "justify-center px-2",
                          active
                            ? "bg-[#EAF3FF] text-[#2563EB] font-bold border-l-3 border-[#2563EB]"
                            : "text-[#52677F] hover:bg-[#F3F7FC] hover:text-[#102A43]"
                        )}
                      >
                        <Icon className={cn("w-4 h-4 shrink-0 transition-colors", active ? "text-[#2563EB]" : "text-[#7890A8] group-hover/nav:text-[#102A43]")} />
                        {!sidebarCollapsed && <span className="truncate flex-1">{label}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Profile / Role Footer */}
      <div className="p-3 border-t border-[#DCE6F2] bg-[#F6F9FD]">
        <UserProfile collapsed={sidebarCollapsed} userRole={userRole} />
      </div>
    </aside>
  );
}
