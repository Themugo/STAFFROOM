export default function PerformerTable({ title, icon: Icon, iconColor, performers, type }) {
  if (performers.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color: iconColor }} />
        {title}
      </h3>
      <div className="space-y-2">
        {performers.map((r, i) => (
          <div key={r.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <span className="text-xs font-bold text-gray-300 w-4 text-right">{i + 1}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "#0F1B2D" }}>
              {r.employee_name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{r.employee_name}</p>
              <p className="text-xs text-gray-400 truncate">{r.department} · {r.review_period}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold" style={{ color: iconColor }}>{r.overall_rating}/5</p>
              <p className="text-xs text-gray-400">{r.goals_met}% goals</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}