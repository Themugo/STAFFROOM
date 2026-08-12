import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Menu,
  Search,
  Sparkles,
  Shield,
  X,
  ChevronRight,
  Filter,
  User,
  FileText,
  Briefcase,
  ListChecks,
  DollarSign
} from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";
import DepartmentSelector from "@/components/shared/DepartmentSelector";
import NotificationsPopover from "./NotificationsPopover";
import TaskCenterPopover from "./TaskCenterPopover";
import QuickCreateMenu from "./QuickCreateMenu";
import UserMenuDropdown from "./UserMenuDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { GLOBAL_SEARCH_ITEMS } from "@/data/globalSearchData";

export default function Header({
  currentPageName,
  setSidebarOpen,
  onOpenCommandPalette
}) {
  const { user } = useAuth() || {};
  const userRole = user?.role || "Staff Member";
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const searchContainerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = GLOBAL_SEARCH_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "ALL" || item.type === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    return (
      matchesCategory &&
      (item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)))
    );
  });

  const handleSelectResult = (item) => {
    navigate(createPageUrl(item.page));
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="h-14 md:h-16 bg-white border-b border-[#DCE6F2] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 font-sans text-[#102A43]">
      {/* Left Section: Mobile Menu, Breadcrumbs & Scope Selector */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <button
          className="md:hidden p-2 text-[#52677F] hover:bg-[#F3F7FC] rounded-xl transition-colors cursor-pointer"
          onClick={() => setSidebarOpen(true)}
          aria-label="Toggle Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* StaffRoom Mobile Mark */}
        <Link to={createPageUrl("Dashboard")} className="md:hidden flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-black text-xs">
            SR
          </div>
          <span className="font-extrabold text-xs tracking-tight text-[#102A43] uppercase">STAFFROOM</span>
        </Link>

        <div className="hidden lg:block">
          <Breadcrumbs currentPageName={currentPageName} />
        </div>

        <div className="hidden lg:block border-l border-[#DCE6F2] h-4 mx-1" />

        <DepartmentSelector className="hidden xl:inline-block" />
      </div>

      {/* Center/Right Section: Interactive Global Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div ref={searchContainerRef} className="relative hidden md:block">
          {/* Interactive Top Nav Search Bar Input */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-[#2563EB] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search HR modules, staff profiles, SOPs..."
              className="w-64 lg:w-80 pl-8 pr-12 py-1.5 rounded-xl bg-[#F6F9FD] focus:bg-white text-[#102A43] placeholder-[#7890A8] text-xs font-semibold border border-[#DCE6F2] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 p-0.5 text-[#7890A8] hover:text-[#102A43] rounded-md"
              >
                <X size={12} />
              </button>
            ) : (
              <kbd
                onClick={onOpenCommandPalette}
                className="absolute right-2 px-1.5 py-0.5 rounded bg-white text-[10px] font-bold text-[#7890A8] border border-[#DCE6F2] cursor-pointer hover:border-[#2563EB]"
                title="Open Command Palette (⌘K)"
              >
                ⌘K
              </kbd>
            )}
          </div>

          {/* Instant Dropdown Search Results Card */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-96 sm:w-[480px] bg-white rounded-2xl border border-[#DCE6F2] shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Category Filter Chips Header */}
              <div className="flex items-center gap-1 p-2 bg-[#F6F9FD] border-b border-[#DCE6F2] overflow-x-auto custom-scrollbar">
                {[
                  { id: "ALL", label: "All" },
                  { id: "Module", label: "Modules" },
                  { id: "Employee", label: "Staff Profiles" },
                  { id: "SOP", label: "SOP Docs" },
                  { id: "Action", label: "Actions" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-[#2563EB] text-white"
                        : "bg-white text-[#52677F] hover:bg-[#EAF3FF] hover:text-[#2563EB] border border-[#DCE6F2]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Results List */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {filteredItems.length > 0 ? (
                  filteredItems.slice(0, 8).map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectResult(item)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#EAF3FF] transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              item.type === "Module"
                                ? "bg-[#2563EB]/10 text-[#2563EB]"
                                : item.type === "Employee"
                                ? "bg-indigo-100 text-indigo-700"
                                : item.type === "SOP"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs text-[#102A43] group-hover:text-[#2563EB] truncate">
                                {item.title}
                              </span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase shrink-0 ${
                                  item.type === "Module"
                                    ? "bg-[#EAF3FF] text-[#2563EB]"
                                    : item.type === "Employee"
                                    ? "bg-indigo-50 text-indigo-700"
                                    : item.type === "SOP"
                                    ? "bg-amber-50 text-amber-800"
                                    : "bg-emerald-50 text-emerald-800"
                                }`}
                              >
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#52677F] truncate">{item.description}</p>
                          </div>
                        </div>

                        <ChevronRight
                          size={14}
                          className="text-[#7890A8] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-transform shrink-0"
                        />
                      </button>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-[#52677F]">
                    No search results found for <span className="font-bold">"{searchQuery}"</span>
                  </div>
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="p-2 bg-[#F6F9FD] border-t border-[#DCE6F2] flex items-center justify-between text-[10px] font-bold text-[#52677F]">
                <span>Showing top search matches</span>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    if (onOpenCommandPalette) onOpenCommandPalette();
                  }}
                  className="text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Palette</span>
                  <kbd className="bg-white px-1 rounded border border-[#DCE6F2] text-[9px]">⌘K</kbd>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 text-[#52677F] hover:bg-[#F3F7FC] hover:text-[#2563EB] rounded-xl transition-colors cursor-pointer border border-[#DCE6F2]"
          title="Search StaffRoom"
        >
          <Search className="w-4 h-4 text-[#2563EB]" />
        </button>

        {/* Active Role Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF3FF] border border-[#2563EB]/20 text-[11px] font-bold text-[#2563EB]">
          <Shield className="w-3 h-3 text-[#2563EB]" />
          <span className="truncate max-w-[120px]">{userRole}</span>
        </div>

        {/* AI Copilot Header Trigger */}
        <Link
          to={createPageUrl("AICopilot")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF3FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-[#2563EB]/20 text-xs font-bold transition-all"
          title="Open AI Workforce Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB] group-hover:text-white animate-pulse" />
          <span className="hidden sm:inline">AI Copilot</span>
        </Link>

        {/* Quick Actions */}
        <QuickCreateMenu />

        {/* Task & Approvals */}
        <TaskCenterPopover />

        {/* Notifications */}
        <NotificationsPopover />

        {/* User Profile */}
        <UserMenuDropdown />
      </div>
    </header>
  );
}
