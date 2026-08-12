import { useState } from "react";
import { User, Settings, LogOut, ChevronDown, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function UserMenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth() || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    setIsOpen(false);
    navigate(createPageUrl("SelfService"));
  };

  const name = user?.full_name || "Sarah Jenkins";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] border border-[#DCE6F2] transition-colors cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white font-black text-xs flex items-center justify-center">
          {initials}
        </div>
        <span className="hidden md:inline font-bold text-xs text-[#102A43] max-w-[110px] truncate">
          {name}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[#7890A8]" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 z-50 w-64 bg-white rounded-2xl border border-[#DCE6F2] shadow-xl p-2 space-y-1">
            {/* Profile Summary */}
            <div className="p-3 border-b border-[#DCE6F2] bg-[#F6F9FD] rounded-xl">
              <p className="font-extrabold text-xs text-[#102A43]">{name}</p>
              <p className="text-[11px] text-[#52677F] truncate">{user?.email || "sarah.j@staffroom.com"}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Shield className="w-3 h-3 text-[#2563EB]" />
                <span className="text-[10px] font-bold text-[#2563EB] uppercase">
                  {user?.role || "Staff Member"}
                </span>
              </div>
            </div>

            {/* Menu Links */}
            <div className="py-1">
              <Link
                to={createPageUrl("SelfService")}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#52677F] hover:bg-[#EAF3FF] hover:text-[#2563EB] transition-colors"
              >
                <User className="w-4 h-4 text-[#2563EB]" />
                <span>My Profile & Portal</span>
              </Link>
              <Link
                to={createPageUrl("Settings")}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#52677F] hover:bg-[#EAF3FF] hover:text-[#2563EB] transition-colors"
              >
                <Settings className="w-4 h-4 text-[#2563EB]" />
                <span>Account Preferences</span>
              </Link>
            </div>

            {/* Logout */}
            <div className="py-1 border-t border-[#DCE6F2]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#D94B61] hover:bg-rose-50 transition-colors cursor-pointer"
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
