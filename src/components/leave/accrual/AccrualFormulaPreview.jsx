
/**
 * Shows a visual preview of how the accrual formula plays out over 12 months.
 */
export default function AccrualFormulaPreview({ rule }) {
  if (!rule) return null;

  const { accrual_method, fixed_days, monthly_rate, accrual_cap, tenure_bands } = rule;

  // Build a 12-month running total
  let months = [];

  if (accrual_method === "unlimited") {
    return (
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <span className="text-lg font-bold text-indigo-600">∞</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-indigo-700">Unlimited Leave</p>
          <p className="text-xs text-indigo-400">No accrual tracking — employees take as needed.</p>
        </div>
      </div>
    );
  }

  if (accrual_method === "fixed_annual") {
    const days = fixed_days || 0;
    return (
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Formula Preview</p>
        <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <div className="text-3xl font-bold text-emerald-600">{days}</div>
          <div>
            <p className="text-sm font-semibold text-emerald-700">days granted on 1 Jan</p>
            <p className="text-xs text-emerald-400">Full balance available from the start of the year.</p>
          </div>
        </div>
      </div>
    );
  }

  if (accrual_method === "monthly_rate") {
    const rate = monthly_rate || 0;
    const cap = accrual_cap || Infinity;
    let running = 0;
    months = Array.from({ length: 12 }, (_, i) => {
      const earned = Math.min(running + rate, cap);
      const delta = earned - running;
      running = earned;
      return { month: i + 1, balance: running, earned: delta };
    });
  }

  if (accrual_method === "tenure_bands" && tenure_bands?.length) {
    // Preview band 0 (first band)
    const band = tenure_bands[0];
    const rate = (band?.days_per_year || 0) / 12;
    const cap = accrual_cap || Infinity;
    let running = 0;
    months = Array.from({ length: 12 }, (_, i) => {
      const earned = Math.min(running + rate, cap);
      const delta = earned - running;
      running = earned;
      return { month: i + 1, balance: running, earned: delta };
    });
  }

  if (!months.length) return null;

  const maxVal = months[months.length - 1]?.balance || 1;
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Formula Preview — Year Accrual</p>
      <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
        {/* Bar chart */}
        <div className="flex items-end gap-1 h-16">
          {months.map(m => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className="w-full rounded-t-sm bg-blue-400 transition-all"
                style={{ height: `${(m.balance / maxVal) * 52}px`, minHeight: "2px" }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {monthLabels.map((l, i) => (
            <div key={i} className="flex-1 text-center text-[9px] text-gray-400">{l}</div>
          ))}
        </div>
        {/* Summary stats */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
          <span>End of year: <strong className="text-gray-900">{months[11]?.balance.toFixed(1)} days</strong></span>
          {accrual_cap && <span>Cap: <strong className="text-gray-900">{accrual_cap} days</strong></span>}
          {accrual_method === "monthly_rate" && <span>+{monthly_rate} days/mo</span>}
        </div>
      </div>
    </div>
  );
}