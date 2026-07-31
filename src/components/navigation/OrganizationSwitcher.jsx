import { useState } from "react";
import { Building2, ChevronDown, Check, Globe, Shield, Sparkles } from "lucide-react";

const ORGANIZATIONS = [
  { id: "org_1", name: "Acme Corp Enterprise", role: "Global Admin", region: "Austin, TX (HQ)", members: 420 },
  { id: "org_2", name: "StaffRoom Global Inc.", role: "HR Director", region: "London, UK", members: 185 },
  { id: "org_3", name: "Nexus Tech Solutions", role: "Observer / Auditor", region: "Singapore", members: 95 },
];

export default function OrganizationSwitcher({ isCollapsed }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(ORGANIZATIONS[0]);

  if (isCollapsed) {
    return (
      <div className="relative flex justify-center py-2 px-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 hover:bg-indigo-600/30 transition-colors cursor-pointer"
          title={selectedOrg.name}
        >
          <Building2 className="w-5 h-5" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute left-14 top-0 z-50 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1">
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Switch Organization</p>
              {ORGANIZATIONS.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    setSelectedOrg(org);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    selectedOrg.id === org.id ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30" : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div>
                    <p className="font-semibold truncate">{org.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{org.region}</p>
                  </div>
                  {selectedOrg.id === org.id && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative px-3 py-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-200 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="text-left truncate">
            <p className="text-xs font-bold text-white truncate">{selectedOrg.name}</p>
            <p className="text-[10px] text-indigo-400 font-semibold truncate">{selectedOrg.role} • {selectedOrg.members} Staff</p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-3 right-3 top-full mt-2 z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Organizations & Subsidiaries</p>
            {ORGANIZATIONS.map((org) => (
              <button
                key={org.id}
                onClick={() => {
                  setSelectedOrg(org);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                  selectedOrg.id === org.id ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div>
                  <p className="font-semibold text-white truncate">{org.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{org.role} • {org.region}</p>
                </div>
                {selectedOrg.id === org.id && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
