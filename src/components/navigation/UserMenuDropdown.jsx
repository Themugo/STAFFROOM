import { useState } from "react";
import { User, Sun, Moon, Settings, Shield, LogOut, ChevronDown, Laptop } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function UserMenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth() || {};
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    setIsOpen(false);
    navigate(createPageUrl("SelfService"));
  };

  const initials = (user?.first_name?.[0] || "S") + (user?.last_name?.[0] || "J");

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
          {initials}
        </div>
        <span className="hidden md:inline font-bold text-xs text-slate-800 dark:text-slate-100 max-w-[100px] truncate">
          {user?.full_name || "Sarah Jenkins"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 z-50 w-64 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* User Profile Summary */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
              <p className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{user?.full_name || "Sarah Jenkins"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || "sarah.j@staffroom.com"}</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {user?.job_title || "HR Director"}
              </span>
            </div>

            {/* Menu Links */}
            <div className="py-1">
              <Link
                to={createPageUrl("SelfService")}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <User className="w-4 h-4 text-indigo-500" />
                <span>My Profile & Portal</span>
              </Link>
              <Link
                to={createPageUrl("Settings")}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4 text-indigo-500" />
                <span>Account Preferences</span>
              </Link>
            </div>

            {/* Theme Toggle Button */}
            <div className="py-1 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                  <span>{theme === "dark" ? "Light Appearance" : "Dark Appearance"}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400">{theme}</span>
              </button>
            </div>

            {/* Logout */}
            <div className="py-1 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
