import { useState } from "react";
import { Building2, ChevronDown, Check } from "lucide-react";

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
          className="w-10 h-10 rounded-2xl bg-[#EAF3FF] border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] hover:bg-[#2563EB]/10 transition-colors cursor-pointer"
          title={selectedOrg.name}
        >
          <Building2 className="w-5 h-5" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute left-14 top-0 z-50 w-64 bg-white border border-[#DCE6F2] rounded-2xl shadow-xl p-2 space-y-1">
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7890A8]">Switch Workspace</p>
              {ORGANIZATIONS.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    setSelectedOrg(org);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    selectedOrg.id === org.id ? "bg-[#EAF3FF] text-[#2563EB] font-bold border border-[#2563EB]/30" : "text-[#52677F] hover:bg-[#F3F7FC] hover:text-[#102A43]"
                  }`}
                >
                  <div>
                    <p className="font-semibold truncate">{org.name}</p>
                    <p className="text-[10px] text-[#7890A8] mt-0.5">{org.region}</p>
                  </div>
                  {selectedOrg.id === org.id && <Check className="w-4 h-4 text-[#2563EB] shrink-0" />}
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
        className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#F6F9FD] hover:bg-[#EAF3FF] border border-[#DCE6F2] text-[#102A43] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="text-left truncate">
            <p className="text-xs font-bold text-[#102A43] truncate">{selectedOrg.name}</p>
            <p className="text-[10px] text-[#2563EB] font-semibold truncate">{selectedOrg.role} • {selectedOrg.members} Staff</p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-[#7890A8] shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-3 right-3 top-full mt-2 z-50 bg-white border border-[#DCE6F2] rounded-2xl shadow-xl p-2 space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7890A8]">Workspaces & Entities</p>
            {ORGANIZATIONS.map((org) => (
              <button
                key={org.id}
                onClick={() => {
                  setSelectedOrg(org);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                  selectedOrg.id === org.id ? "bg-[#EAF3FF] text-[#2563EB] font-bold border border-[#2563EB]/30" : "text-[#52677F] hover:bg-[#F3F7FC] hover:text-[#102A43]"
                }`}
              >
                <div>
                  <p className="font-semibold text-[#102A43] truncate">{org.name}</p>
                  <p className="text-[10px] text-[#7890A8] mt-0.5">{org.role} • {org.region}</p>
                </div>
                {selectedOrg.id === org.id && <Check className="w-4 h-4 text-[#2563EB] shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
