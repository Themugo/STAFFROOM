import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calculator, Users, Building2, ChevronRight, Pencil, Info } from "lucide-react";
import AccrualRuleModal from "./AccrualRuleModal";
import AccrualFormulaPreview from "./AccrualFormulaPreview";

const LEAVE_COLORS = {
  Annual: "bg-blue-50 text-blue-700 border-blue-200",
  Sick: "bg-red-50 text-red-700 border-red-200",
  Maternity: "bg-pink-50 text-pink-700 border-pink-200",
  Paternity: "bg-violet-50 text-violet-700 border-violet-200",
  Compassionate: "bg-amber-50 text-amber-700 border-amber-200",
  Study: "bg-teal-50 text-teal-700 border-teal-200",
  Unpaid: "bg-gray-100 text-gray-600 border-gray-200",
  Custom: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const METHOD_LABEL = {
  fixed_annual: "Fixed Annual",
  monthly_rate: "Monthly Accrual",
  tenure_bands: "Tenure Bands",
  unlimited: "Unlimited",
};

const METHOD_ICON = {
  fixed_annual: "📅",
  monthly_rate: "📈",
  tenure_bands: "🏅",
  unlimited: "∞",
};

function ruleFormulaSummary(rule) {
  if (rule.accrual_method === "fixed_annual") return `${rule.fixed_days ?? "—"} days / year`;
  if (rule.accrual_method === "monthly_rate") return `${rule.monthly_rate ?? "—"} days / month = ${((rule.monthly_rate || 0) * 12).toFixed(1)} days / year`;
  if (rule.accrual_method === "tenure_bands") {
    const b = rule.tenure_bands || [];
    return b.length ? `${b.length} tenure band${b.length > 1 ? "s" : ""}` : "No bands configured";
  }
  if (rule.accrual_method === "unlimited") return "Unlimited — no cap";
  return "—";
}

function ScopeChips({ rule }) {
  const types = rule.applies_to_employment_types || [];
  const depts = rule.applies_to_departments || [];
  if (!types.length && !depts.length) return <span className="text-[10px] text-gray-400">Applies to all employees</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {types.map(t => (
        <span key={t} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          <Users className="w-2.5 h-2.5" />{t}
        </span>
      ))}
      {depts.map(d => (
        <span key={d} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
          <Building2 className="w-2.5 h-2.5" />{d}
        </span>
      ))}
    </div>
  );
}

export default function AccrualConfigTab({ rules, onSave, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const handleEdit = (rule) => { setEditing(rule); setModalOpen(true); };
  const handleNew = () => { setEditing(null); setModalOpen(true); };
  const handleSave = (data) => { onSave(data); setModalOpen(false); };

  const grouped = rules.reduce((acc, rule) => {
    const key = rule.leave_type || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(rule);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-semibold text-gray-900">Accrual Configuration</h3>
          <p className="text-xs text-gray-400 mt-0.5 max-w-xl">
            Define custom accrual formulas per leave type and employee group. Rules are applied in order — more specific rules (by employment type or department) take priority.
          </p>
        </div>
        <Button onClick={handleNew} className="text-white gap-2 h-9" style={{ background: "#0F1B2D" }}>
          <Plus className="w-4 h-4" /> New Accrual Rule
        </Button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-700 space-y-0.5">
          <p className="font-semibold">How accrual rules work</p>
          <p>Rules are matched per employee based on their employment type and department. If multiple rules match, the most specific one wins. Rules with no scope filters apply to everyone.</p>
        </div>
      </div>

      {/* Empty state */}
      {rules.length === 0 && (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <Calculator className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-600">No accrual rules yet</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Create rules to define how leave days are earned for each employee group.</p>
          <Button onClick={handleNew} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" /> Create First Rule
          </Button>
        </div>
      )}

      {/* Grouped by leave type */}
      {Object.entries(grouped).map(([leaveType, typeRules]) => {
        const colorClass = LEAVE_COLORS[leaveType] || LEAVE_COLORS.Custom;
        return (
          <div key={leaveType} className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className={`text-xs border ${colorClass}`}>{leaveType}</Badge>
              <span className="text-xs text-gray-400">{typeRules.length} rule{typeRules.length !== 1 ? "s" : ""}</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {typeRules.map(rule => {
                const isExpanded = expanded === rule.id;
                return (
                  <div key={rule.id} className={`bg-white rounded-2xl border transition-all ${rule.is_active ? "border-gray-100" : "border-gray-100 opacity-50"}`}>
                    {/* Card header */}
                    <div className="flex items-start gap-3 p-4">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-base flex-shrink-0">
                        {METHOD_ICON[rule.accrual_method] || "📋"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900 truncate">{rule.name}</p>
                          {!rule.is_active && <span className="text-[10px] text-gray-400">(Inactive)</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          <span className="font-medium">{METHOD_LABEL[rule.accrual_method]}</span> · {ruleFormulaSummary(rule)}
                        </p>
                        <div className="mt-1.5">
                          <ScopeChips rule={rule} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setExpanded(isExpanded ? null : rule.id)}
                          className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-all"
                        >
                          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(rule)}
                          className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-700 hover:bg-gray-100 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded preview */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
                        <AccrualFormulaPreview rule={rule} />
                        {rule.carry_over_enabled && (
                          <div className="text-xs bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 space-y-0.5">
                            <p className="font-semibold text-amber-700">Carry-Over Enabled</p>
                            <p className="text-amber-600">
                              {rule.carry_over_max_days != null ? `Up to ${rule.carry_over_max_days} days` : "Unlimited days"}
                              {rule.carry_over_expiry_months ? ` · expire after ${rule.carry_over_expiry_months} months` : " · never expire"}
                            </p>
                          </div>
                        )}
                        {rule.prorate_on_join && (
                          <p className="text-[10px] text-gray-400">✓ Pro-rated for employees who join mid-year</p>
                        )}
                        {rule.notes && (
                          <p className="text-[10px] text-gray-400 italic">"{rule.notes}"</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <AccrualRuleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={onDelete}
        rule={editing}
      />
    </div>
  );
}