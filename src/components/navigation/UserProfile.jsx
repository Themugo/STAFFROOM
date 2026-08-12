import React, { useState } from 'react';
import {
  User,
  Settings,
  Shield,
  SlidersHorizontal,
  Bell,
  Moon,
  Sun,
  LogOut,
  ChevronUp,
  ExternalLink,
  Check,
  Building2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function UserProfile({
  collapsed = false,
  userName: customName,
  userRole: customRole,
  avatarUrl: customAvatar,
  department: customDepartment,
  className
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const { user, logout } = useAuth() || {};
  const navigate = useNavigate();

  const name = customName || user?.full_name || "Sarah Jenkins";
  const role = customRole || user?.role || "HR Director";
  const department = customDepartment || user?.department || "People Operations";
  const avatar = customAvatar || user?.avatar_url;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    if (logout) logout();
    setIsSettingsOpen(false);
    navigate(createPageUrl("SelfService"));
  };

  return (
    <div className={cn("relative", className)}>
      {/* Settings Popover Drawer */}
      {isSettingsOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-xs"
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className={cn(
            "absolute z-50 bg-white rounded-2xl border border-[#DCE6F2] shadow-xl p-3 w-72 space-y-3 animate-in fade-in zoom-in-95 duration-150",
            collapsed ? "left-full bottom-0 ml-3" : "bottom-full left-0 mb-3"
          )}>
            {/* Header / Current User Summary */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2]">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-10 h-10 rounded-xl object-cover border border-white shadow-xs shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-xs text-[#102A43] truncate">{name}</p>
                <p className="text-[10px] text-[#52677F] truncate">{user?.email || "sarah.j@staffroom.com"}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#EAF3FF] text-[#2563EB] text-[9px] font-bold uppercase">
                    <Shield size={10} />
                    {role}
                  </span>
                  <span className="text-[10px] text-[#7890A8] truncate">• {department}</span>
                </div>
              </div>
            </div>

            {/* Quick Settings Toggles */}
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-extrabold text-[#7890A8] uppercase tracking-wider">
                Quick Preferences
              </p>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-[#52677F] hover:bg-[#F3F7FC] hover:text-[#102A43] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {darkMode ? <Moon size={15} className="text-[#2563EB]" /> : <Sun size={15} className="text-[#F59E0B]" />}
                  <span>Appearance</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F6F9FD] text-[#52677F] border border-[#DCE6F2]">
                  {darkMode ? "Dark" : "Light"}
                </span>
              </button>

              {/* Notification Toggle */}
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-[#52677F] hover:bg-[#F3F7FC] hover:text-[#102A43] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Bell size={15} className="text-[#2563EB]" />
                  <span>Desktop Alerts</span>
                </div>
                <div className={cn(
                  "w-8 h-4 rounded-full transition-colors relative p-0.5 cursor-pointer",
                  notificationsEnabled ? "bg-[#2563EB]" : "bg-[#DCE6F2]"
                )}>
                  <div className={cn(
                    "w-3 h-3 rounded-full bg-white transition-transform shadow-xs",
                    notificationsEnabled && "translate-x-4"
                  )} />
                </div>
              </button>
            </div>

            {/* Settings & Profile Navigation */}
            <div className="pt-2 border-t border-[#DCE6F2] space-y-1">
              <Link
                to={createPageUrl("SelfService")}
                onClick={() => setIsSettingsOpen(false)}
                className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-[#52677F] hover:bg-[#EAF3FF] hover:text-[#2563EB] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <User size={15} className="text-[#2563EB]" />
                  <span>My Employee Portal</span>
                </div>
                <ExternalLink size={12} className="text-[#7890A8]" />
              </Link>

              <Link
                to={createPageUrl("Settings")}
                onClick={() => setIsSettingsOpen(false)}
                className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-[#52677F] hover:bg-[#EAF3FF] hover:text-[#2563EB] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Settings size={15} className="text-[#2563EB]" />
                  <span>System Settings</span>
                </div>
                <ExternalLink size={12} className="text-[#7890A8]" />
              </Link>
            </div>

            {/* Sign Out Action */}
            <div className="pt-2 border-t border-[#DCE6F2]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-[#D94B61] hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Trigger Card */}
      {collapsed ? (
        <div className="flex items-center justify-center">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            title={`${name} (${role}) - Click for Settings`}
            className="p-1 rounded-xl hover:bg-[#EAF3FF] transition-colors cursor-pointer group relative"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-9 h-9 rounded-xl object-cover border border-[#DCE6F2] group-hover:border-[#2563EB]"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shadow-xs">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white border border-[#DCE6F2] flex items-center justify-center text-[#52677F]">
              <Settings size={10} />
            </div>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-[#DCE6F2] shadow-xs hover:border-[#2563EB]/40 transition-all">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-8 h-8 rounded-xl object-cover border border-[#DCE6F2] shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[#102A43] font-extrabold text-xs truncate leading-tight">{name}</p>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-[#52677F]">
                <Shield size={10} className="text-[#2563EB] shrink-0" />
                <span className="truncate font-bold uppercase">{role}</span>
              </div>
            </div>
          </div>

          {/* Settings Toggle Trigger Button */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={cn(
              "p-1.5 rounded-xl text-[#52677F] hover:text-[#2563EB] hover:bg-[#F3F7FC] transition-colors cursor-pointer shrink-0 ml-1",
              isSettingsOpen && "bg-[#EAF3FF] text-[#2563EB]"
            )}
            title="User & Settings Preferences"
          >
            <SlidersHorizontal size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
