import { TrendingDown, TrendingUp, Minus, AlertTriangle } from "lucide-react";

const STATUS_CONFIG = {
  underpaid:      { label: "Underpaid",       color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200"    },
  slightly_under: { label: "Slightly Under",  color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200"  },
  market:         { label: "At Market",       color: "text-emerald-600", bg: "bg-emerald-50", border: "border-gray-100"   },
  slightly_over:  { label: "Slightly Over",   color: "text-violet-500",  bg: "bg-violet-50",  border: "border-gray-100"   },
  overpaid:       { label: "Overpaid",        color: "text-violet-700",  bg: "bg-violet-100", border: "border-violet-200" },
};

function deptRating(avgDiff) {
  if (avgDiff === null) return null;
  if (avgDiff < -20) return "underpaid";
  if (avgDiff < -10) return "slightly_under";
  if (avgDiff > 20)  return "overpaid";
  if (avgDiff > 10)  return "slightly_over";
  return "market";
}

export default function DeptBenchmarkPanel({ deptStats }) {
  if (!deptStats.length) return <p className="text-sm text-gray-400 py-8 text-center">No department data available.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {deptStats.map(d => {
        const rating = deptRating(d.avgDiff);
        const cfg = STATUS_CONFIG[rating] || STATUS_CONFIG.market;
        const Icon = d.avgDiff < -10 ? TrendingDown : d.avgDiff > 10 ? TrendingUp : Minus;

        return (
          <div key={d.dept} className={`bg-white rounded-2xl border ${cfg.border} p-5 space-y-4`}>
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900">{d.dept}</p>
                <p className="text-xs text-gray-400 mt-0.5">{d.employees.length} employee{d.employees.length !== 1 ? "s" : ""}</p>
              </div>
              {rating && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cfg.bg} ${cfg.color} flex items-center gap-1`}>
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </span>
              )}
            </div>

            {/* Avg diff meter */}
            {d.avgDiff !== null && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Avg vs. market median</span>
                  <span className={`font-semibold ${d.avgDiff < 0 ? "text-red-600" : d.avgDiff > 0 ? "text-violet-600" : "text-emerald-600"}`}>
                    {d.avgDiff > 0 ? "+" : ""}{d.avgDiff.toFixed(1)}%
                  </span>
                </div>
                {/* Centered bar */}
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300" />
                  <div
                    className={`absolute top-0 h-full rounded-full ${d.avgDiff < 0 ? "bg-red-400 right-1/2" : "bg-violet-400 left-1/2"}`}
                    style={{ width: `${Math.min(Math.abs(d.avgDiff) * 1.5, 50)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-300">
                  <span>Below market</span><span>Above market</span>
                </div>
              </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-red-50 rounded-xl p-2">
                <p className="text-xs text-gray-400">Underpaid</p>
                <p className={`font-bold text-sm ${d.underpaidCount > 0 ? "text-red-600" : "text-gray-300"}`}>{d.underpaidCount}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-2">
                <p className="text-xs text-gray-400">At Market</p>
                <p className="font-bold text-sm text-emerald-600">
                  {d.employees.filter(e => e.benchStatus === "market").length}
                </p>
              </div>
              <div className="bg-violet-50 rounded-xl p-2">
                <p className="text-xs text-gray-400">Overpaid</p>
                <p className={`font-bold text-sm ${d.overpaidCount > 0 ? "text-violet-700" : "text-gray-300"}`}>{d.overpaidCount}</p>
              </div>
            </div>

            {/* Retention risk */}
            {d.underpaidCount >= 2 && (
              <div className="flex items-start gap-2 bg-red-50 rounded-xl p-2.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700 font-medium">
                  {d.underpaidCount} employees at retention risk — significantly below market
                </p>
              </div>
            )}

            {/* Top underpaid employees */}
            {d.employees.filter(e => e.benchStatus === "underpaid").length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-medium">Flagged employees</p>
                {d.employees
                  .filter(e => e.benchStatus === "underpaid" || e.benchStatus === "slightly_under")
                  .slice(0, 3)
                  .map(e => (
                    <div key={e.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                      <span className="text-gray-700 font-medium truncate max-w-[60%]">{e.full_name}</span>
                      <span className={`font-semibold ${e.benchStatus === "underpaid" ? "text-red-600" : "text-amber-600"}`}>
                        {e.diffFromMedian?.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}