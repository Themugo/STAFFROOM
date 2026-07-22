import { AlertTriangle, TrendingDown, TrendingUp, CheckCircle2, MapPin } from "lucide-react";

export default function BenchmarkSummaryBar({ total, underpaid, slightlyUnder, atMarket, overpaid, location }) {
  const stats = [
    { label: "Employees Analyzed", value: total, icon: CheckCircle2, color: "text-gray-600", bg: "bg-gray-100" },
    { label: "Significantly Underpaid", value: underpaid, icon: TrendingDown, color: underpaid > 0 ? "text-red-600" : "text-gray-400", bg: underpaid > 0 ? "bg-red-50" : "bg-gray-50", alert: underpaid > 0 },
    { label: "Slightly Under Market", value: slightlyUnder, icon: AlertTriangle, color: slightlyUnder > 0 ? "text-amber-600" : "text-gray-400", bg: slightlyUnder > 0 ? "bg-amber-50" : "bg-gray-50" },
    { label: "At Market Rate", value: atMarket, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Above Market", value: overpaid, icon: TrendingUp, color: overpaid > 0 ? "text-violet-600" : "text-gray-400", bg: overpaid > 0 ? "bg-violet-50" : "bg-gray-50" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <MapPin className="w-3.5 h-3.5" />
        Market data for <span className="font-semibold text-gray-600">{location}</span>
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">AI-powered</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map(({ label, value, icon: Icon, color, bg, alert }) => (
          <div key={label} className={`bg-white rounded-2xl border p-4 flex items-center gap-3 ${alert ? "border-red-200" : "border-gray-100"}`}>
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 leading-tight">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}