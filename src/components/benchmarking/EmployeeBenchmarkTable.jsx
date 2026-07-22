import { TrendingDown, TrendingUp, Minus } from "lucide-react";

const STATUS_CONFIG = {
  underpaid:      { label: "Underpaid",      color: "text-red-600",     bg: "bg-red-100"     },
  slightly_under: { label: "Slight Under",   color: "text-amber-600",   bg: "bg-amber-100"   },
  market:         { label: "At Market",      color: "text-emerald-700", bg: "bg-emerald-100" },
  slightly_over:  { label: "Slight Over",    color: "text-violet-600",  bg: "bg-violet-100"  },
  overpaid:       { label: "Overpaid",       color: "text-violet-800",  bg: "bg-violet-200"  },
  no_data:        { label: "No Data",        color: "text-gray-400",    bg: "bg-gray-100"    },
};

function DiffBar({ pct }) {
  const clamped = Math.max(-50, Math.min(50, pct));
  const isNeg = clamped < 0;
  return (
    <div className="relative h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
      <div className="absolute left-1/2 h-full w-px bg-gray-300" />
      <div
        className={`absolute top-0 h-full rounded-full ${isNeg ? "bg-red-400 right-1/2" : "bg-violet-400 left-1/2"}`}
        style={{ width: `${Math.abs(clamped)}%` }}
      />
    </div>
  );
}

export default function EmployeeBenchmarkTable({ employees }) {
  if (!employees.length) return <p className="text-sm text-gray-400 text-center py-10">No employees match your filters.</p>;

  const sorted = [...employees].sort((a, b) => {
    const order = { underpaid: 0, slightly_under: 1, market: 2, slightly_over: 3, overpaid: 4, no_data: 5 };
    return (order[a.benchStatus] ?? 5) - (order[b.benchStatus] ?? 5);
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-semibold uppercase tracking-wide">
        <div className="col-span-3">Employee</div>
        <div className="col-span-2">Role</div>
        <div className="col-span-1">Dept</div>
        <div className="col-span-2 text-right">Current Salary</div>
        <div className="col-span-2 text-right">Market Median</div>
        <div className="col-span-1 text-right">Δ%</div>
        <div className="col-span-1 text-center">Status</div>
      </div>

      <div className="divide-y divide-gray-50">
        {sorted.map(emp => {
          const cfg = STATUS_CONFIG[emp.benchStatus] || STATUS_CONFIG.no_data;
          const Icon = emp.diffFromMedian < -5 ? TrendingDown : emp.diffFromMedian > 5 ? TrendingUp : Minus;

          return (
            <div key={emp.id} className={`grid grid-cols-12 gap-2 px-5 py-3.5 items-center text-sm hover:bg-gray-50 transition-colors ${emp.benchStatus === "underpaid" ? "bg-red-50/30" : ""}`}>
              {/* Name */}
              <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: "#0F1B2D" }}>
                  {emp.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <span className="truncate font-medium text-gray-900">{emp.full_name}</span>
              </div>

              {/* Role */}
              <div className="col-span-2 text-gray-500 text-xs truncate">{emp.job_title}</div>

              {/* Dept */}
              <div className="col-span-1 text-gray-400 text-xs truncate">{emp.department}</div>

              {/* Current salary */}
              <div className="col-span-2 text-right font-semibold text-gray-900">
                ${emp.base_salary?.toLocaleString()}
              </div>

              {/* Market median */}
              <div className="col-span-2 text-right text-gray-500">
                {emp.bench ? `$${emp.bench.p50?.toLocaleString()}` : "—"}
              </div>

              {/* Delta */}
              <div className={`col-span-1 text-right font-semibold text-xs ${emp.diffFromMedian < 0 ? "text-red-600" : emp.diffFromMedian > 0 ? "text-violet-600" : "text-gray-400"}`}>
                {emp.diffFromMedian != null ? `${emp.diffFromMedian > 0 ? "+" : ""}${emp.diffFromMedian.toFixed(1)}%` : "—"}
              </div>

              {/* Status badge */}
              <div className="col-span-1 flex justify-center">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} whitespace-nowrap`}>
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}