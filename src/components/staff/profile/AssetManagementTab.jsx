import { Laptop, Plus, CheckCircle2, ShieldCheck, RefreshCw, Key, Shield } from "lucide-react";

export function AssetManagementTab({ assets = [], onAssignAsset }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Laptop className="w-4 h-4 text-indigo-500" />
            Assigned Hardware & Software Licenses
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Track laptops, security tokens, monitors, software licenses, and serial numbers.</p>
        </div>

        <button
          onClick={onAssignAsset}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(assets || []).map((ast) => (
          <div key={ast.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between">
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {ast.category}
              </span>
              <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm pt-1">{ast.name}</p>
              <p className="text-xs text-slate-400 font-mono">Serial: {ast.serial}</p>
              <p className="text-[11px] text-slate-400">Assigned Date: {ast.assignedDate}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {ast.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
