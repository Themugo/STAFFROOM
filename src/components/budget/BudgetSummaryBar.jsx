import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function BudgetSummaryBar({ totalBudget, totalActual, totalForecasted, overCount, atRiskCount }) {
  const pct = totalBudget > 0 ? Math.min((totalForecasted / totalBudget) * 100, 999).toFixed(1) : null;

  const stats = [
    { label: "Total Annual Budget", value: `$${(totalBudget / 1000).toFixed(0)}k`, icon: DollarSign, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Current Payroll (Annual)", value: `$${(totalActual / 1000).toFixed(0)}k`, icon: DollarSign, color: "text-gray-600", bg: "bg-gray-100" },
    { label: "Forecasted w/ Promotions", value: `$${(totalForecasted / 1000).toFixed(0)}k`, icon: TrendingUp, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Over Budget Depts", value: overCount, icon: AlertTriangle, color: overCount > 0 ? "text-red-600" : "text-emerald-600", bg: overCount > 0 ? "bg-red-50" : "bg-emerald-50" },
    { label: "At-Risk Depts", value: atRiskCount, icon: CheckCircle2, color: atRiskCount > 0 ? "text-amber-600" : "text-emerald-600", bg: atRiskCount > 0 ? "bg-amber-50" : "bg-emerald-50" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 leading-tight">{label}</p>
            <p className="text-lg font-bold text-gray-900">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}