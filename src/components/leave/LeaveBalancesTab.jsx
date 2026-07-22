import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { computeEntitled } from "@/utils/leaveBalance";

function BalanceMiniCard({ label, used, entitled, pending, color }) {
  const isUnlimited = entitled >= 999;
  const remaining = isUnlimited ? "∞" : Math.max(0, entitled - used - pending).toFixed(1);
  const pct = isUnlimited ? 0 : entitled > 0 ? Math.min(100, ((used + pending) / entitled) * 100) : 0;
  const isOver = !isUnlimited && (used + pending) > entitled;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-2">
      <div className="flex items-center justify-between gap-1">
        <span className="text-xs font-medium text-gray-600 truncate">{label}</span>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-xl font-bold ${isOver ? "text-red-600" : "text-gray-900"}`}>{remaining}</p>
          <p className="text-[10px] text-gray-400">{isUnlimited ? "Unlimited" : `${used}/${entitled % 1 === 0 ? entitled : entitled.toFixed(1)} used`}</p>
        </div>
        {pending > 0 && (
          <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full">{pending}d pending</span>
        )}
      </div>
      {!isUnlimited && entitled > 0 && (
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: isOver ? "#ef4444" : color }} />
        </div>
      )}
    </div>
  );
}

export default function LeaveBalancesTab({ employees, requests, policies, balances, accrualRules, onRunAccrual }) {
  const [search, setSearch] = useState("");

  const enabledPolicies = policies.filter(p => p.is_enabled);
  const activeEmployees = employees.filter(e => e.status !== "Terminated");
  const filtered = activeEmployees.filter(e => !search || e.full_name?.toLowerCase().includes(search.toLowerCase()));
  const year = new Date().getFullYear();

  const getBalance = (empId, leaveType) => {
    const bal = balances.find(b => b.employee_id === empId && b.year === year);
    const entry = bal?.balances?.find(b => b.leave_type === leaveType);
    // Calculate used from approved requests
    const used = requests
      .filter(r => r.employee_id === empId && r.status === "Approved" && r.leave_type === leaveType)
      .reduce((s, r) => s + (r.days_requested || 0), 0);
    const pending = requests
      .filter(r => r.employee_id === empId && r.status === "Pending" && r.leave_type === leaveType)
      .reduce((s, r) => s + (r.days_requested || 0), 0);
    const carried = entry?.carried_over || 0;
    return { used, pending, carried };
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input className="pl-8 h-9 text-sm" placeholder="Search employee…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" className="gap-2 h-9 text-sm" onClick={onRunAccrual}>
          <RefreshCw className="w-4 h-4" /> Recalculate Accruals
        </Button>
      </div>

      {enabledPolicies.length === 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center text-sm text-amber-700">
          No leave policies configured yet. Go to the <strong>Policy Settings</strong> tab to set them up.
        </div>
      )}

      <div className="space-y-4">
        {filtered.map(emp => (
          <div key={emp.id} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: "#0F1B2D" }}>
                {emp.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{emp.full_name}</p>
                <p className="text-xs text-gray-400">{emp.department} · {emp.job_title}</p>
              </div>
              {emp.start_date && (
                <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                  Started {emp.start_date}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {enabledPolicies.map(policy => {
                const typeName = policy.leave_type === "Custom" && policy.custom_name ? policy.custom_name : policy.leave_type;
                const entitled = computeEntitled(policy, emp, accrualRules);
                const { used, pending, carried } = getBalance(emp.id, policy.leave_type);
                const totalEntitled = entitled + carried;
                return (
                  <BalanceMiniCard
                    key={policy.id}
                    label={typeName}
                    used={used}
                    entitled={totalEntitled}
                    pending={pending}
                    color={policy.color || "#0F1B2D"}
                  />
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-10">No employees found.</p>}
      </div>
    </div>
  );
}