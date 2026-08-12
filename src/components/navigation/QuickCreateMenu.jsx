import { useState } from "react";
import { Plus, UserPlus, Palmtree, DollarSign, FileUp, ChevronDown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuickCreateMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = (page) => {
    setIsOpen(false);
    navigate(createPageUrl(page));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-98 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Quick Action</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-80" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 z-50 w-56 bg-white rounded-2xl border border-[#DCE6F2] shadow-xl p-2 space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7890A8]">Workflows & Creation</p>
            <button
              onClick={() => handleAction("Staff")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#52677F] hover:bg-[#EAF3FF] hover:text-[#2563EB] transition-colors text-left cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#2563EB]" />
              <span>Add New Employee</span>
            </button>
            <button
              onClick={() => handleAction("Leave")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#52677F] hover:bg-[#EAF3FF] hover:text-[#2563EB] transition-colors text-left cursor-pointer"
            >
              <Palmtree className="w-4 h-4 text-[#2563EB]" />
              <span>Request Leave / Time Off</span>
            </button>
            <button
              onClick={() => handleAction("Payroll")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#52677F] hover:bg-[#EAF3FF] hover:text-[#2563EB] transition-colors text-left cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-[#2563EB]" />
              <span>Run Payroll Cycle</span>
            </button>
            <button
              onClick={() => handleAction("Documents")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#52677F] hover:bg-[#EAF3FF] hover:text-[#2563EB] transition-colors text-left cursor-pointer"
            >
              <FileUp className="w-4 h-4 text-[#2563EB]" />
              <span>Upload Document</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
