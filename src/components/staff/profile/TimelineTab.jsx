import { useState } from "react";
import { History, Search, Filter, Calendar, Award, DollarSign, TrendingUp, Palmtree, Laptop, FileText, CheckCircle2 } from "lucide-react";

export function TimelineTab({ timeline = [] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const iconMap = {
    compensation: DollarSign,
    performance: TrendingUp,
    career: Award,
    training: CheckCircle2,
    onboarding: History,
    document: FileText,
    asset: Laptop,
  };

  const filtered = timeline.filter((item) => {
    const matchSearch =
      !search ||
      item.event.toLowerCase().includes(search.toLowerCase()) ||
      item.details.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || item.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            Career & Lifecycle Chronological Timeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Complete record of promotions, transfers, salary adjustments, and achievements.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search timeline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Event Types</option>
            <option value="compensation">Compensation</option>
            <option value="performance">Performance</option>
            <option value="career">Career & Role</option>
            <option value="training">Training</option>
            <option value="onboarding">Onboarding</option>
          </select>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No timeline records matching filters.</p>
        ) : (
          filtered.map((item) => {
            const Icon = iconMap[item.type] || History;
            return (
              <div key={item.id} className="relative group">
                {/* Bullet node */}
                <div className="absolute -left-[31px] top-1.5 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 flex items-center justify-center text-indigo-600 shadow-2xs">
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{item.event}</span>
                    <span className="text-[11px] font-bold text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{item.details}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
