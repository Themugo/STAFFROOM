import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, LayoutDashboard, UserCircle, Search, Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import CommandPalette from "@/components/navigation/CommandPalette";
import SEO from "@/components/common/SEO";

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F9FD] text-[#102A43] font-sans antialiased flex">
      {/* Protect private application pages from indexing */}
      <SEO title={`${currentPageName || 'Workspace'} | STAFFROOM Platform`} noindex={true} />

      {/* Sidebar Layout Shell Component */}
      <Sidebar
        currentPageName={currentPageName}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#102A43]/40 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Layout Content Shell */}
      <div className={cn("flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 pb-16 md:pb-0", sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[250px]")}>
        {/* Header Layout Shell Component */}
        <Header
          currentPageName={currentPageName}
          setSidebarOpen={setSidebarOpen}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        {/* Primary Page Body View */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col gap-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DCE6F2] flex items-center justify-around py-2 px-3 shadow-lg">
        <Link
          to={createPageUrl("Dashboard")}
          className={cn(
            "flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors",
            currentPageName === "Dashboard" ? "text-[#2563EB]" : "text-[#52677F]"
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          to={createPageUrl("SelfService")}
          className={cn(
            "flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors",
            currentPageName === "SelfService" ? "text-[#2563EB]" : "text-[#52677F]"
          )}
        >
          <UserCircle className="w-5 h-5" />
          <span>My Work</span>
        </Link>
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-[#52677F]"
        >
          <Search className="w-5 h-5 text-[#2563EB]" />
          <span>Search</span>
        </button>
        <Link
          to={createPageUrl("Announcements")}
          className={cn(
            "flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors",
            currentPageName === "Announcements" ? "text-[#2563EB]" : "text-[#52677F]"
          )}
        >
          <Bell className="w-5 h-5" />
          <span>Alerts</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-[#52677F]"
        >
          <Menu className="w-5 h-5" />
          <span>More</span>
        </button>
      </div>

      {/* Global Command Palette */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={setCommandPaletteOpen} />

      {/* Floating AI Workforce Copilot Assistant */}
      {currentPageName !== "AICopilot" && (
        <Link
          to={createPageUrl("AICopilot")}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-lg shadow-[#2563EB]/25 border border-white/20 transition-all hover:scale-105 active:scale-95 group"
          title="Open AI Workforce Copilot"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="hidden sm:inline">Ask AI Copilot</span>
        </Link>
      )}
    </div>
  );
}
