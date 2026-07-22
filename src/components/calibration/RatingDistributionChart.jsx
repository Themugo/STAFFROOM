import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#6366f1", "#10b981"];

export default function RatingDistributionChart({ buckets }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-1">Rating Distribution</h3>
      <p className="text-xs text-gray-400 mb-4">How ratings are spread across all employees</p>
      {buckets.every(b => b.count === 0) ? (
        <p className="text-sm text-gray-400 text-center py-12">No review data.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={buckets} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="rating" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v, _, { payload }) => [`${v} employees`, payload.label]}
              labelFormatter={(l) => `Rating ${l}`}
            />
            <Bar dataKey="count" radius={[6,6,0,0]} maxBarSize={50}>
              {buckets.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      <div className="flex flex-wrap gap-3 mt-2 justify-center">
        {buckets.map((b, i) => (
          <div key={b.rating} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
            {b.label} ({b.count})
          </div>
        ))}
      </div>
    </div>
  );
}