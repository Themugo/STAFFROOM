import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
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
  Plus,
  Clock,
  Sparkles,
  Command,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  BookOpen,
  Calendar,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import CommandPalette from "@/components/navigation/CommandPalette";
import NotificationsPopover from "@/components/navigation/NotificationsPopover";
import TaskCenterPopover from "@/components/navigation/TaskCenterPopover";
import QuickCreateMenu from "@/components/navigation/QuickCreateMenu";
import OrganizationSwitcher from "@/components/navigation/OrganizationSwitcher";
import UserMenuDropdown from "@/components/navigation/UserMenuDropdown";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

const NAV_GROUPS = [
  {
    title: "Core Workforce",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
      { label: "Staff Directory", icon: Users, page: "Staff" },
      { label: "Approval Hub", icon: ShieldCheck, page: "ApprovalCenter" },
      { label: "Org Chart", icon: GitBranch, page: "OrgChart" },
      { label: "Onboarding", icon: ListChecks, page: "Onboarding" },
      { label: "Self-Service", icon: UserCircle, page: "SelfService" },
    ],
  },
  {
    title: "Time & Operations",
    items: [
      { label: "Attendance Logs", icon: CalendarCheck, page: "Attendance" },
      { label: "Leave Planner", icon: Palmtree, page: "Leave" },
      { label: "Duty Roster & Shifts", icon: Calendar, page: "DutyRoster" },
    ],
  },
  {
    title: "Financials & Payroll",
    items: [
      { label: "Payroll & Tasks", icon: DollarSign, page: "Payroll" },
      { label: "Budget Planner", icon: PieChart, page: "Budget" },
      { label: "Benchmarking", icon: Scale, page: "Benchmarking" },
    ],
  },
  {
    title: "Talent & Growth",
    items: [
      { label: "Recruitment ATS", icon: Briefcase, page: "Recruitment" },
      { label: "Performance", icon: TrendingUp, page: "Performance" },
      { label: "Calibration", icon: SlidersHorizontal, page: "Calibration" },
      { label: "Promotions", icon: ArrowUpCircle, page: "Promotions" },
      { label: "Benefits", icon: Heart, page: "Benefits" },
    ],
  },
  {
    title: "Governance & Policies",
    items: [
      { label: "Policy Center", icon: BookOpen, page: "PolicyCenter" },
      { label: "Documents", icon: FileText, page: "Documents" },
      { label: "Signatures", icon: FilePen, page: "Signatures" },
      { label: "Reports & Audit", icon: FileBarChart2, page: "Reports" },
      { label: "Settings", icon: Settings, page: "Settings" },
    ],
  },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [pinnedPages, setPinnedPages] = useState(() => {
    try {
      const saved = localStorage.getItem("staffroom_pinned");
      return saved ? JSON.parse(saved) : ["Dashboard", "Staff", "Payroll", "Attendance"];
    } catch {
      return ["Dashboard", "Staff", "Payroll", "Attendance"];
    }
  });

  const { user } = useAuth() || {};
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem("staffroom_pinned", JSON.stringify(pinnedPages));
    } catch {
      // Ignore write errors
    }
  }, [pinnedPages]);

  const togglePin = (e, page) => {
    e.preventDefault();
    e.stopPropagation();
    setPinnedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  const toggleGroup = (groupTitle) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  const allItems = NAV_GROUPS.flatMap((g) => g.items);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 shadow-2xl",
          sidebarCollapsed ? "w-20" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
          <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3 group overflow-hidden">
            <div className="w-9 h-9 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:bg-indigo-500 transition-all shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="animate-in fade-in duration-200">
                <span className="text-white font-extrabold text-lg tracking-tight block">STAFFROOM</span>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block -mt-1">Enterprise HR</span>
              </div>
            )}
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
            <button
              className="md:hidden text-slate-400 hover:text-white p-1"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Organization Switcher Component */}
        <OrganizationSwitcher isCollapsed={sidebarCollapsed} />

        {/* Global Search Trigger in Sidebar */}
        <div className="px-3 py-1">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className={cn(
              "w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer",
              sidebarCollapsed && "justify-center"
            )}
            title="Quick Search (Ctrl+K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400 shrink-0" />
              {!sidebarCollapsed && <span>Quick Search...</span>}
            </div>
            {!sidebarCollapsed && (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-bold text-slate-400 border border-slate-700">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            )}
          </button>
        </div>

        {/* Navigation Items (Grouped & Scrollable) */}
        <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Pinned Favorites Section */}
          {pinnedPages.length > 0 && (
            <div>
              {!sidebarCollapsed && (
                <div className="px-3 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Pinned Favorites</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </div>
              )}
              <div className="space-y-0.5 mt-1">
                {pinnedPages.map((page) => {
                  const item = allItems.find((i) => i.page === page);
                  if (!item) return null;
                  const Icon = item.icon;
                  const active = currentPageName === page;
                  return (
                    <Link
                      key={page}
                      to={createPageUrl(page)}
                      onClick={() => setSidebarOpen(false)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={cn(
                        "group/nav flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                        sidebarCollapsed && "justify-center px-2",
                        active
                          ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30"
                          : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 shrink-0", active ? "text-indigo-400" : "text-slate-400 group-hover/nav:text-slate-200")} />
                      {!sidebarCollapsed && <span className="truncate flex-1">{item.label}</span>}
                      {!sidebarCollapsed && (
                        <button
                          onClick={(e) => togglePin(e, page)}
                          className="opacity-0 group-hover/nav:opacity-100 p-0.5 hover:text-amber-400 transition-opacity"
                          title="Unpin"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </button>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Grouped Modules */}
          {NAV_GROUPS.map((group) => {
            const isCollapsed = collapsedGroups[group.title];
            return (
              <div key={group.title}>
                {!sidebarCollapsed && (
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="w-full px-3 py-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <span>{group.title}</span>
                    {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}

                {(!isCollapsed || sidebarCollapsed) && (
                  <div className="space-y-0.5 mt-1">
                    {group.items.map(({ label, icon: Icon, page }) => {
                      const active = currentPageName === page;
                      const isPinned = pinnedPages.includes(page);
                      return (
                        <Link
                          key={page}
                          to={createPageUrl(page)}
                          onClick={() => setSidebarOpen(false)}
                          title={sidebarCollapsed ? label : undefined}
                          className={cn(
                            "group/nav flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all",
                            sidebarCollapsed && "justify-center px-2",
                            active
                              ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30 shadow-xs"
                              : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                          )}
                        >
                          <Icon className={cn("w-4 h-4 shrink-0", active ? "text-indigo-400" : "text-slate-400 group-hover/nav:text-slate-200")} />
                          {!sidebarCollapsed && <span className="truncate flex-1">{label}</span>}
                          {!sidebarCollapsed && (
                            <button
                              onClick={(e) => togglePin(e, page)}
                              className={cn(
                                "opacity-0 group-hover/nav:opacity-100 p-0.5 hover:text-amber-400 transition-opacity cursor-pointer",
                                isPinned && "opacity-100 text-amber-400"
                              )}
                              title={isPinned ? "Unpin from top" : "Pin to top"}
                            >
                              <Star className={cn("w-3.5 h-3.5", isPinned ? "fill-amber-400 text-amber-400" : "text-slate-500")} />
                            </button>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={cn("flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300", sidebarCollapsed ? "md:ml-20" : "md:ml-64")}>
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <Breadcrumbs currentPageName={currentPageName} />
          </div>

          <div className="flex items-center gap-3">
            {/* Global Search Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-[10px] font-bold border border-slate-200 dark:border-slate-700 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Quick Action Button */}
            <QuickCreateMenu />

            {/* Task Center & Approvals */}
            <TaskCenterPopover />

            {/* Notifications Popover */}
            <NotificationsPopover />

            {/* User Profile Menu */}
            <UserMenuDropdown />
          </div>
        </header>

        {/* Body View */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col gap-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={setCommandPaletteOpen} />
    </div>
  );
}
