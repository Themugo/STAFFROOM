import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Menu,
  X,
  Building2,
  ChevronRight,
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
  Scale
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { label: "Staff", icon: Users, page: "Staff" },
  { label: "Payroll", icon: DollarSign, page: "Payroll" },
  { label: "Attendance", icon: CalendarCheck, page: "Attendance" },
  { label: "Leave", icon: Palmtree, page: "Leave" },
  { label: "Documents", icon: FileText, page: "Documents" },
  { label: "Benefits", icon: Heart, page: "Benefits" },
  { label: "Performance", icon: TrendingUp, page: "Performance" },
  { label: "Calibration", icon: SlidersHorizontal, page: "Calibration" },
  { label: "Promotions", icon: ArrowUpCircle, page: "Promotions" },
  { label: "Budget", icon: PieChart, page: "Budget" },
  { label: "Benchmarking", icon: Scale, page: "Benchmarking" },
  { label: "Onboarding", icon: ListChecks, page: "Onboarding" },
  { label: "Org Chart", icon: GitBranch, page: "OrgChart" },
  { label: "Signatures", icon: FilePen, page: "Signatures" },
  { label: "Self-Service", icon: UserCircle, page: "SelfService" },
  { label: "Reports", icon: FileBarChart2, page: "Reports" },
  { label: "Settings", icon: Settings, page: "Settings" },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        :root {
          --navy: #0F1B2D;
          --navy-mid: #1A2D45;
          --gold: #D4A843;
          --gold-light: #F0C96B;
        }
      `}</style>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300",
          "md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{ background: "var(--navy)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gold)" }}>
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">StaffCore</p>
            <p className="text-white/40 text-xs">Management Suite</p>
          </div>
          <button
            className="ml-auto md:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ label, icon: Icon, page }) => {
            const active = currentPageName === page;
            return (
              <Link
                key={page}
                to={createPageUrl(page)}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  active
                    ? "text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
                style={active ? { background: "var(--navy-mid)", boxShadow: "inset 3px 0 0 var(--gold)" } : {}}
              >
                <Icon className={cn("w-4 h-4", active ? "text-amber-400" : "group-hover:text-white/70")} />
                <span className="text-sm font-medium">{label}</span>
                {active && <ChevronRight className="w-3 h-3 ml-auto text-amber-400/60" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-white/20 text-xs">© 2026 StaffCore</p>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center gap-4">
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-semibold text-gray-900">
            {navItems.find(n => n.page === currentPageName)?.label || currentPageName}
          </h1>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}