import React, { useState } from 'react';
import {
  Briefcase,
  ListChecks,
  DollarSign,
  Users,
  CalendarCheck,
  TrendingUp,
  LayoutDashboard,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import UserProfile from '../navigation/UserProfile';

export const CORE_MODULES = [
  {
    id: 'ats',
    name: 'ATS & Recruitment',
    category: 'Talent Acquisition',
    icon: Briefcase,
    badge: '12 Active Jobs',
    description: 'Applicant tracking, job requisitions, candidate pipeline & interview scheduling'
  },
  {
    id: 'onboarding',
    name: 'Employee Onboarding',
    category: 'Talent Acquisition',
    icon: ListChecks,
    badge: '5 New Hires',
    description: 'Task checklists, document collection, IT provisioning & probation tracking'
  },
  {
    id: 'payroll',
    name: 'Payroll & Compensation',
    category: 'Finance & Operations',
    icon: DollarSign,
    badge: 'Aug Run Prepared',
    description: 'Salary disbursement, tax deductions, payslips & statutory compliance'
  },
  {
    id: 'directory',
    name: 'Workforce Directory',
    category: 'People Ops',
    icon: Users,
    badge: '148 Staff',
    description: 'Employee profiles, org hierarchy, departments & contact information'
  },
  {
    id: 'attendance',
    name: 'Time & Attendance',
    category: 'People Ops',
    icon: CalendarCheck,
    badge: '98% On-time',
    description: 'Clock-in logs, duty rosters, shift management & leave approvals'
  },
  {
    id: 'performance',
    name: 'Performance & Talent',
    category: 'Growth',
    icon: TrendingUp,
    badge: 'Q3 Reviews Open',
    description: 'KPI tracking, 360 appraisals, goal setting & career development'
  }
];

export default function SidebarWorkspaceLayout({
  children,
  activeModuleId = 'ats',
  onSelectModule,
  userName = 'Admin User',
  userRole = 'HR Director',
  notificationsCount = 3
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeModule = CORE_MODULES.find(m => m.id === activeModuleId) || CORE_MODULES[0];

  return (
    <div className="min-h-screen bg-[#F6F9FD] text-[#102A43] font-sans flex flex-col md:flex-row antialiased selection:bg-[#2563EB] selection:text-white">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#102A43]/50 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-[#DCE6F2] transition-all duration-300 shadow-xs shrink-0",
          sidebarCollapsed ? "w-[72px]" : "w-[260px]",
          mobileMenuOpen ? "translate-x-0 w-[280px]" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#DCE6F2] bg-white">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-[#2563EB]/25 shrink-0">
              SR
            </div>
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div className="min-w-0">
                <span className="text-[#102A43] font-black text-sm uppercase tracking-wider block truncate">
                  STAFFROOM
                </span>
                <span className="text-[10px] text-[#2563EB] font-bold uppercase tracking-widest block -mt-0.5">
                  Enterprise HR
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex p-1.5 text-[#52677F] hover:text-[#2563EB] hover:bg-[#F3F7FC] rounded-lg transition-colors cursor-pointer"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-[#52677F] hover:text-[#102A43] p-1.5 rounded-lg hover:bg-[#F3F7FC]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Quick Search */}
        {(!sidebarCollapsed || mobileMenuOpen) && (
          <div className="p-3 border-b border-[#DCE6F2]/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7890A8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#F6F9FD] border border-[#DCE6F2] rounded-xl text-xs text-[#102A43] placeholder-[#7890A8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {(!sidebarCollapsed || mobileMenuOpen) && (
            <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#7890A8]">
              Core Modules
            </p>
          )}

          {CORE_MODULES.filter(m => !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase())).map((module) => {
            const Icon = module.icon;
            const isActive = module.id === activeModuleId;

            return (
              <button
                key={module.id}
                onClick={() => {
                  if (onSelectModule) onSelectModule(module.id);
                  setMobileMenuOpen(false);
                }}
                title={sidebarCollapsed ? module.name : undefined}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group text-left",
                  sidebarCollapsed && !mobileMenuOpen && "justify-center px-2",
                  isActive
                    ? "bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20"
                    : "text-[#52677F] hover:bg-[#F3F7FC] hover:text-[#102A43]"
                )}
              >
                <Icon size={18} className={cn("shrink-0 transition-colors", isActive ? "text-white" : "text-[#7890A8] group-hover:text-[#2563EB]")} />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate">{module.name}</span>
                      {module.badge && (
                        <span className={cn(
                          "px-1.5 py-0.5 text-[9px] font-bold rounded-md shrink-0",
                          isActive ? "bg-white/20 text-white" : "bg-[#EAF3FF] text-[#2563EB]"
                        )}>
                          {module.badge}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="p-3 border-t border-[#DCE6F2] bg-[#F6F9FD]">
          <UserProfile
            collapsed={sidebarCollapsed && !mobileMenuOpen}
            userName={userName}
            userRole={userRole}
          />
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Workspace Bar */}
        <header className="h-16 bg-white border-b border-[#DCE6F2] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-[#52677F] hover:text-[#102A43] hover:bg-[#F3F7FC] rounded-xl transition-colors cursor-pointer"
            >
              <Menu size={20} />
            </button>

            {/* Active Workspace Title & Category */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-[#102A43] tracking-tight">
                  {activeModule.name}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#2563EB] text-[10px] font-bold">
                  {activeModule.category}
                </span>
              </div>
              <p className="text-xs text-[#52677F] hidden md:block">
                {activeModule.description}
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <button className="relative p-2 text-[#52677F] hover:text-[#2563EB] hover:bg-[#F3F7FC] rounded-xl transition-colors cursor-pointer">
              <Bell size={18} />
              {notificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444]" />
              )}
            </button>

            <div className="h-6 w-[1px] bg-[#DCE6F2] mx-1 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#52677F] bg-[#F6F9FD] px-3 py-1.5 rounded-xl border border-[#DCE6F2]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>System Online</span>
            </div>
          </div>
        </header>

        {/* Central Workspace Content Render Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6">
          {children ? (
            children
          ) : (
            <div className="bg-white rounded-2xl border border-[#DCE6F2] p-8 shadow-xs flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-[#EAF3FF] text-[#2563EB] flex items-center justify-center mb-4 shadow-sm">
                {React.createElement(activeModule.icon, { size: 32 })}
              </div>
              <h2 className="text-xl font-extrabold text-[#102A43] mb-2">
                {activeModule.name} Workspace
              </h2>
              <p className="text-sm text-[#52677F] max-w-md mb-6">
                {activeModule.description}. Connect your data hooks or pass children elements to populate this central workspace.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white font-bold text-xs shadow-md shadow-[#2563EB]/20">
                <Sparkles size={14} />
                <span>Central Workspace Ready</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
