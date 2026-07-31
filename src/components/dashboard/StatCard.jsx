import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Link } from "react-router-dom";

export default function StatCard({ label, value, sub, trend, trendValue, icon: Icon, color, linkTo }) {
  const content = (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all group cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-wide uppercase">{label}</p>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1.5">{value}</h2>
        </div>
        <div className={`p-3 rounded-2xl flex items-center justify-center shrink-0 ${color || "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
        {trendValue && (
          <span className={`font-bold flex items-center gap-1 ${
            trend === "up" ? "text-emerald-600 dark:text-emerald-400" : trend === "down" ? "text-rose-600 dark:text-rose-400" : "text-slate-500"
          }`}>
            {trend === "up" ? <TrendingUp className="w-3.5 h-3.5" /> : trend === "down" ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            {trendValue}
          </span>
        )}
        {sub && <span className="text-slate-400 dark:text-slate-500 truncate">{sub}</span>}
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
}
