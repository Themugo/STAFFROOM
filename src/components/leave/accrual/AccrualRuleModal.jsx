import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import TenureBandsEditor from "./TenureBandsEditor";
import AccrualFormulaPreview from "./AccrualFormulaPreview";

const LEAVE_TYPES = ["Annual", "Sick", "Maternity", "Paternity", "Compassionate", "Study", "Unpaid", "Custom"];
const EMP_TYPES = ["Full-time", "Part-time", "Contract", "Intern"];
const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Design", "Legal", "Executive"];

const DEFAULTS = {
  name: "", leave_type: "Annual", custom_leave_name: "",
  accrual_method: "fixed_annual", fixed_days: 20, monthly_rate: 1.75, accrual_cap: null,
  tenure_bands: [], applies_to_employment_types: [], applies_to_departments: [],
  prorate_on_join: true, carry_over_enabled: false, carry_over_max_days: 5,
  carry_over_expiry_months: null, is_active: true, notes: ""
};

const METHOD_INFO = {
  fixed_annual:   { label: "Fixed Annual", desc: "A flat number of days is granted at the start of each year." },
  monthly_rate:   { label: "Monthly Accrual", desc: "Employees earn a fixed rate per month (e.g. 1.75 days/month = 21 days/year)." },
  tenure_bands:   { label: "Tenure Bands", desc: "Accrual rate increases with years of service (e.g. 20 days for 0–2 yrs, 25 days for 3+ yrs)." },
  unlimited:      { label: "Unlimited", desc: "No accrual — employees take leave as needed with no balance tracking." },
};

export default function AccrualRuleModal({ open, onClose, onSave, onDelete, rule }) {
  const [form, setForm] = useState(DEFAULTS);
  const isEdit = !!rule?.id;

  useEffect(() => {
    if (open) setForm(rule ? { ...DEFAULTS, ...rule } : DEFAULTS);
  }, [open, rule]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleMulti = (key, val) => {
    setForm(f => {
      const arr = f[key] || [];
      return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, id: rule?.id });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Accrual Rule" : "Create Accrual Rule"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Name + leave type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Rule Name *</Label>
              <Input value={form.name} onChange={e => set("name", e.target.value)} required placeholder="e.g. Full-time Annual Leave" />
            </div>
            <div className="space-y-1.5">
              <Label>Leave Type *</Label>
              <Select value={form.leave_type} onValueChange={v => set("leave_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{LEAVE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {/* ── ACCRUAL METHOD ── */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Accrual Method</p>

            {/* Method picker tiles */}
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(METHOD_INFO).map(([key, info]) => (
                <button
                  key={key} type="button"
                  onClick={() => set("accrual_method", key)}
                  className={`text-left rounded-xl border-2 px-4 py-3 transition-all ${form.accrual_method === key ? "border-gray-800 bg-gray-50" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <p className={`text-xs font-semibold ${form.accrual_method === key ? "text-gray-900" : "text-gray-600"}`}>{info.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{info.desc}</p>
                </button>
              ))}
            </div>

            {/* Method-specific inputs */}
            {form.accrual_method === "fixed_annual" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Days Per Year</Label>
                  <Input type="number" min="0" step="0.5" value={form.fixed_days ?? ""} onChange={e => set("fixed_days", parseFloat(e.target.value))} placeholder="e.g. 20" />
                </div>
              </div>
            )}

            {form.accrual_method === "monthly_rate" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Days Earned Per Month</Label>
                  <Input type="number" min="0" step="0.25" value={form.monthly_rate ?? ""} onChange={e => set("monthly_rate", parseFloat(e.target.value))} placeholder="e.g. 1.75" />
                  {form.monthly_rate > 0 && (
                    <p className="text-[10px] text-gray-400">= {(form.monthly_rate * 12).toFixed(1)} days/year</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Accrual Cap (days)</Label>
                  <Input type="number" min="0" value={form.accrual_cap ?? ""} onChange={e => set("accrual_cap", e.target.value ? parseFloat(e.target.value) : null)} placeholder="No cap" />
                  <p className="text-[10px] text-gray-400">Accrual stops once this balance is reached.</p>
                </div>
              </div>
            )}

            {form.accrual_method === "tenure_bands" && (
              <div className="space-y-4">
                <TenureBandsEditor bands={form.tenure_bands || []} onChange={v => set("tenure_bands", v)} />
                <div className="space-y-1.5">
                  <Label>Accrual Cap (days)</Label>
                  <Input type="number" min="0" value={form.accrual_cap ?? ""} onChange={e => set("accrual_cap", e.target.value ? parseFloat(e.target.value) : null)} placeholder="No cap" />
                </div>
              </div>
            )}

            {/* Live preview */}
            <AccrualFormulaPreview rule={form} />
          </div>

          {/* ── APPLIES TO ── */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Applies To</p>
            <p className="text-xs text-gray-400 -mt-2">Leave all unchecked to apply to everyone.</p>

            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Employment Types</Label>
              <div className="flex flex-wrap gap-2">
                {EMP_TYPES.map(t => (
                  <label key={t} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${(form.applies_to_employment_types || []).includes(t) ? "border-gray-800 bg-gray-50 font-medium text-gray-900" : "border-gray-200 text-gray-500"}`}>
                    <Checkbox
                      checked={(form.applies_to_employment_types || []).includes(t)}
                      onCheckedChange={() => toggleMulti("applies_to_employment_types", t)}
                      className="w-3 h-3"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Departments</Label>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map(d => (
                  <label key={d} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${(form.applies_to_departments || []).includes(d) ? "border-gray-800 bg-gray-50 font-medium text-gray-900" : "border-gray-200 text-gray-500"}`}>
                    <Checkbox
                      checked={(form.applies_to_departments || []).includes(d)}
                      onCheckedChange={() => toggleMulti("applies_to_departments", d)}
                      className="w-3 h-3"
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── CARRY-OVER ── */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Carry-Over</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Unused days that roll into the next year.</p>
              </div>
              <Switch checked={!!form.carry_over_enabled} onCheckedChange={v => set("carry_over_enabled", v)} />
            </div>
            {form.carry_over_enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Max Days to Carry Over</Label>
                  <Input type="number" min="0" value={form.carry_over_max_days ?? ""} onChange={e => set("carry_over_max_days", e.target.value ? parseFloat(e.target.value) : null)} placeholder="Unlimited" />
                </div>
                <div className="space-y-1.5">
                  <Label>Carry-Over Expiry (months)</Label>
                  <Input type="number" min="1" value={form.carry_over_expiry_months ?? ""} onChange={e => set("carry_over_expiry_months", e.target.value ? parseFloat(e.target.value) : null)} placeholder="Never expires" />
                  <p className="text-[10px] text-gray-400">Carried-over days expire after this many months in the new year.</p>
                </div>
              </div>
            )}
          </div>

          {/* ── OPTIONS ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <Label className="text-xs cursor-pointer">Pro-rate on hire date</Label>
              <Switch checked={!!form.prorate_on_join} onCheckedChange={v => set("prorate_on_join", v)} />
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <Label className="text-xs cursor-pointer">Rule Active</Label>
              <Switch checked={!!form.is_active} onCheckedChange={v => set("is_active", v)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea rows={2} value={form.notes || ""} onChange={e => set("notes", e.target.value)} placeholder="Internal notes for this accrual rule…" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            {isEdit ? (
              <Button type="button" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-1" onClick={() => { onDelete(rule.id); onClose(); }}>
                <Trash2 className="w-3.5 h-3.5" /> Delete Rule
              </Button>
            ) : <div />}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="text-white" style={{ background: "#0F1B2D" }}>{isEdit ? "Save Changes" : "Create Rule"}</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}