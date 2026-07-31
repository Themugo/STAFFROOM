import { useState } from "react";
import { Plus, UserPlus, Palmtree, DollarSign, FileUp, Building2, Sparkles, ChevronDown } from "lucide-react";
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
        className="bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white px-3.5 py-2 rounded-2xl font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none flex items-center gap-1.5 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Quick Action</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-80" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 z-50 w-56 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Creation Workflows</p>
            <button
              onClick={() => handleAction("Staff")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 transition-colors text-left cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-indigo-500" />
              <span>Add New Employee</span>
            </button>
            <button
              onClick={() => handleAction("Leave")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 transition-colors text-left cursor-pointer"
            >
              <Palmtree className="w-4 h-4 text-indigo-500" />
              <span>Request Leave / Time Off</span>
            </button>
            <button
              onClick={() => handleAction("Payroll")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 transition-colors text-left cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-indigo-500" />
              <span>Run Payroll Cycle</span>
            </button>
            <button
              onClick={() => handleAction("Documents")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 transition-colors text-left cursor-pointer"
            >
              <FileUp className="w-4 h-4 text-indigo-500" />
              <span>Upload Document</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
