import React from "react";
import { Building2, Calendar, Shield, Sparkles } from "lucide-react";

export default function WorkspaceHeader({
  title,
  subtitle,
  badgeText = "Enterprise Scope",
  scope = "Acme Corp • All Departments",
  actions,
  children
}) {
  return (
    <div className="bg-white border border-[#DCE6F2] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans shadow-2xs">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF3FF] border border-[#2563EB]/20 text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
            <Building2 className="w-3 h-3 text-[#2563EB]" />
            {badgeText}
          </span>
          <span className="text-xs text-[#52677F] font-medium hidden sm:inline">• {scope}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A43] tracking-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#52677F] font-medium max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>

      {(actions || children) && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
}
