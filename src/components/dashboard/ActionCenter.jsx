import { useState } from "react";
import { AlertCircle, Check, Clock, UserCheck, Palmtree, DollarSign, FileWarning, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ActionCenter({ pendingLeaves, onApproveLeave }) {
  const [clearedItems, setClearedItems] = useState([]);

  const handleClear = (id) => {
    setClearedItems((prev) => [...prev, id]);
  };

  const STATIC_ACTION_ITEMS = [
    { id: "act_1", title: "Contract Renewal Due: Alex Rivera", subtitle: "Senior Architect contract expires in 14 days.", type: "contract", link: "Staff" },
    { id: "act_2", title: "Probation Review Required: Marcus Vance", subtitle: "90-day evaluation period ending this week.", type: "review", link: "Performance" },
    { id: "act_3", title: "Payroll Variance Detected", subtitle: "+4.5% overtime anomaly in Engineering department.", type: "payroll", link: "Payroll" },
  ];

  const visibleStatic = STATIC_ACTION_ITEMS.filter((i) => !clearedItems.includes(i.id));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Needs Executive Attention</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            {pendingLeaves.length + visibleStatic.length} items
          </span>
        </div>

        <div className="space-y-3">
          {/* Pending Leave Requests */}
          {pendingLeaves.map((leave) => (
            <div
              key={leave.id}
              className="p-3.5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Palmtree className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{leave.employee_name}</p>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {leave.leave_type} • {leave.total_days} days ({leave.start_date})
                </p>
              </div>
              <button
                onClick={() => onApproveLeave(leave.id)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shrink-0 cursor-pointer"
              >
                Approve
              </button>
            </div>
          ))}

          {/* Static Action Items */}
          {visibleStatic.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={createPageUrl(item.link)}
                  className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 transition-colors"
                >
                  Review
                </Link>
                <button
                  onClick={() => handleClear(item.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title="Dismiss"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {pendingLeaves.length === 0 && visibleStatic.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400 font-medium">
              No items requiring executive attention!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
