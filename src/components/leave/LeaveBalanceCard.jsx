export default function LeaveBalanceCard({ label, used, total, color = "#0F1B2D" }) {
  const remaining = Math.max(0, total - used);
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <span className="text-xs text-gray-400">{used}/{total} days used</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-3">{remaining} <span className="text-sm font-normal text-gray-400">remaining</span></p>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}