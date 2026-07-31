import { useState } from "react";
import { Activity, DollarSign, Palmtree, UserPlus, FileCheck, CheckCircle2, Filter } from "lucide-react";

const INITIAL_ACTIVITIES = [
  { id: "a1", type: "leave", title: "Leave Request Approved", detail: "Sarah Jenkins approved 3 days Annual Leave for Alex Rivera.", time: "10m ago", category: "Leave" },
  { id: "a2", type: "payroll", title: "Payroll Run Completed", detail: "July 2026 Monthly Disbursement of $142,500 processed successfully.", time: "1h ago", category: "Payroll" },
  { id: "a3", type: "onboarding", title: "New Employee Onboarded", detail: "Marcus Vance joined Engineering as Senior Frontend Developer.", time: "3h ago", category: "Onboarding" },
  { id: "a4", type: "performance", title: "Q2 Performance Appraisal Submitted", detail: "Engineering team completed 100% of peer review calibrations.", time: "5h ago", category: "Performance" },
  { id: "a5", type: "leave", title: "Time-Off Requested", detail: "David Chen requested Sick Leave for Aug 05.", time: "1d ago", category: "Leave" },
];

export default function ActivityFeed() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? INITIAL_ACTIVITIES : INITIAL_ACTIVITIES.filter((a) => a.category === filter);

  const getIcon = (type) => {
    switch (type) {
      case "payroll":
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case "leave":
        return <Palmtree className="w-4 h-4 text-amber-500" />;
      case "onboarding":
        return <UserPlus className="w-4 h-4 text-indigo-500" />;
      default:
        return <FileCheck className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Live Activity Feed</h3>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            {["All", "Payroll", "Leave", "Onboarding"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  filter === cat
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3.5 mt-4">
          {filtered.map((item) => (
            <div key={item.id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100/80 dark:border-slate-800/80">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200/50 dark:border-slate-700/50 shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{item.title}</p>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
