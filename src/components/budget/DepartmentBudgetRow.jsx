import { AlertTriangle, TrendingUp, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function DepartmentBudgetRow({ dept, actual, budget, promotionImpact, headcount }) {
  const hasBudget = budget > 0;
  const forecasted = actual + promotionImpact;
  const usedPct = hasBudget ? Math.min((actual / budget) * 100, 100) : 0;
  const forecastedPct = hasBudget ? Math.min((forecasted / budget) * 100, 100) : 0;
  const overBudget = hasBudget && forecasted > budget;
  const nearBudget = hasBudget && !overBudget && forecastedPct >= 85;

  const statusColor = overBudget
    ? "text-red-600"
    : nearBudget
    ? "text-amber-600"
    : "text-emerald-600";

  const barColor = overBudget
    ? "bg-red-500"
    : nearBudget
    ? "bg-amber-400"
    : "bg-emerald-500";

  const StatusIcon = overBudget ? AlertTriangle : nearBudget ? TrendingUp : CheckCircle2;

  return (
    <div className={`bg-white rounded-2xl border p-5 space-y-4 transition-all ${overBudget ? "border-red-200 shadow-red-50 shadow-md" : nearBudget ? "border-amber-200" : "border-gray-100"}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${statusColor}`} />
            <p className="font-semibold text-gray-900 text-sm">{dept}</p>
            {overBudget && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-semibold">Over Budget</span>}
            {nearBudget && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">At Risk</span>}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{headcount} employee{headcount !== 1 ? "s" : ""}</p>
        </div>
        {hasBudget && (
          <div className="text-right">
            <p className="text-xs text-gray-400">Budget</p>
            <p className="text-sm font-bold text-gray-800">${(budget / 1000).toFixed(0)}k</p>
          </div>
        )}
      </div>

      {/* Numbers row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 rounded-xl p-2">
          <p className="text-xs text-gray-400 mb-0.5">Actual Payroll</p>
          <p className="text-sm font-bold text-gray-800">${(actual / 1000).toFixed(1)}k</p>
        </div>
        <div className={`rounded-xl p-2 ${promotionImpact > 0 ? "bg-indigo-50" : "bg-gray-50"}`}>
          <p className="text-xs text-gray-400 mb-0.5 flex items-center justify-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> Promo Impact
          </p>
          <p className={`text-sm font-bold ${promotionImpact > 0 ? "text-indigo-700" : "text-gray-400"}`}>
            {promotionImpact > 0 ? `+$${(promotionImpact / 1000).toFixed(1)}k` : "—"}
          </p>
        </div>
        <div className={`rounded-xl p-2 ${overBudget ? "bg-red-50" : nearBudget ? "bg-amber-50" : "bg-emerald-50"}`}>
          <p className="text-xs text-gray-400 mb-0.5">Forecasted</p>
          <p className={`text-sm font-bold ${statusColor}`}>${(forecasted / 1000).toFixed(1)}k</p>
        </div>
      </div>

      {/* Progress bar */}
      {hasBudget && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Budget utilization</span>
            <span className={forecastedPct >= 100 ? "text-red-600 font-semibold" : ""}>{forecastedPct.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
            {/* actual */}
            <div className={`absolute h-full rounded-full ${barColor} opacity-50`} style={{ width: `${usedPct}%` }} />
            {/* forecasted */}
            <div className={`absolute h-full rounded-full ${barColor}`} style={{ width: `${forecastedPct}%`, opacity: 0.9 }} />
          </div>
          {overBudget && (
            <p className="text-xs text-red-600 font-medium">
              Over by ${((forecasted - budget) / 1000).toFixed(1)}k · budget adjustment needed
            </p>
          )}
        </div>
      )}

      {!hasBudget && (
        <p className="text-xs text-gray-400 italic">No budget set for this department</p>
      )}
    </div>
  );
}