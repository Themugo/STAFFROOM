import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, Pencil } from "lucide-react";
import LeavePolicyModal from "./LeavePolicyModal";

const TYPE_COLORS = {
  Annual: "bg-blue-50 text-blue-700 border-blue-200",
  Sick: "bg-red-50 text-red-700 border-red-200",
  Maternity: "bg-pink-50 text-pink-700 border-pink-200",
  Paternity: "bg-violet-50 text-violet-700 border-violet-200",
  Compassionate: "bg-amber-50 text-amber-700 border-amber-200",
  Study: "bg-teal-50 text-teal-700 border-teal-200",
  Unpaid: "bg-gray-100 text-gray-600 border-gray-200",
  Custom: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const ACCRUAL_LABEL = {
  fixed: "Fixed days/yr",
  accrual: "Monthly accrual",
  unlimited: "Unlimited",
};

export default function LeavePolicyTab({ policies, onSave, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleEdit = (policy) => { setEditing(policy); setModalOpen(true); };
  const handleNew = () => { setEditing(null); setModalOpen(true); };
  const handleSave = (data) => { onSave(data); setModalOpen(false); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-800">Leave Type Policies</p>
          <p className="text-xs text-gray-400 mt-0.5">Configure entitlements, accrual rules, carry-over and eligibility for each leave type.</p>
        </div>
        <Button onClick={handleNew} className="text-white gap-2 h-9" style={{ background: "#0F1B2D" }}>
          <Plus className="w-4 h-4" /> Add Policy
        </Button>
      </div>

      {policies.length === 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-10 text-center">
          <Settings2 className="w-9 h-9 text-indigo-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-indigo-700">No leave policies configured yet</p>
          <p className="text-xs text-indigo-500 mt-1">Click <strong>Add Policy</strong> to define your company's leave types, accrual rules and eligibility.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {policies.map(p => {
          const typeName = p.leave_type === "Custom" && p.custom_name ? p.custom_name : p.leave_type;
          const colorClass = TYPE_COLORS[p.leave_type] || TYPE_COLORS.Custom;
          return (
            <div key={p.id} className={`bg-white rounded-2xl border p-5 space-y-4 ${!p.is_enabled ? "opacity-50" : "border-gray-100"}`}>
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color || "#0F1B2D" }} />
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}>{typeName}</span>
                  {!p.is_enabled && <span className="text-xs text-gray-400">(Disabled)</span>}
                </div>
                <button onClick={() => handleEdit(p)} className="text-gray-400 hover:text-gray-700 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Entitlement */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Accrual Method</span>
                  <span className="font-semibold text-gray-800">{ACCRUAL_LABEL[p.accrual_type]}</span>
                </div>
                {p.accrual_type === "fixed" && (
                  <div className="flex justify-between text-gray-500">
                    <span>Days per year</span>
                    <span className="font-semibold text-gray-800">{p.fixed_days_per_year ?? "—"}</span>
                  </div>
                )}
                {p.accrual_type === "accrual" && (
                  <>
                    <div className="flex justify-between text-gray-500">
                      <span>Rate</span>
                      <span className="font-semibold text-gray-800">{p.accrual_rate_per_month} days/month</span>
                    </div>
                    {p.max_accrual_cap && (
                      <div className="flex justify-between text-gray-500">
                        <span>Cap</span>
                        <span className="font-semibold text-gray-800">{p.max_accrual_cap} days max</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Carry-over</span>
                  <span className={`font-semibold ${p.carry_over_enabled ? "text-emerald-700" : "text-gray-400"}`}>
                    {p.carry_over_enabled ? (p.max_carry_over_days != null ? `${p.max_carry_over_days}d max` : "Unlimited") : "None"}
                  </span>
                </div>
                {p.waiting_period_months > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Waiting period</span>
                    <span className="font-semibold text-gray-800">{p.waiting_period_months}m employment</span>
                  </div>
                )}
                {p.min_notice_days > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Min notice</span>
                    <span className="font-semibold text-gray-800">{p.min_notice_days} days</span>
                  </div>
                )}
                {p.gender_restricted && (
                  <div className="flex justify-between text-gray-500">
                    <span>Eligibility</span>
                    <span className="font-semibold text-gray-800">{p.gender_restricted} only</span>
                  </div>
                )}
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-50">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${p.paid ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {p.paid ? "Paid" : "Unpaid"}
                </span>
                {p.requires_approval
                  ? <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">Needs Approval</span>
                  : <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">Auto-approved</span>
                }
                {p.requires_documentation && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium">
                    Doc required{p.documentation_after_days ? ` after ${p.documentation_after_days}d` : ""}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <LeavePolicyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={onDelete}
        policy={editing}
      />
    </div>
  );
}