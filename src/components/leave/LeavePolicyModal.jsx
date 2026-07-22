import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";

const LEAVE_TYPES = ["Annual", "Sick", "Maternity", "Paternity", "Compassionate", "Study", "Unpaid", "Custom"];
const COLORS = ["#0F1B2D", "#2563eb", "#ef4444", "#ec4899", "#8b5cf6", "#f59e0b", "#14b8a6", "#6366f1", "#64748b"];

const DEFAULTS = {
  leave_type: "Annual", custom_name: "", is_enabled: true,
  accrual_type: "fixed", fixed_days_per_year: 20, accrual_rate_per_month: 1.75,
  max_accrual_cap: null, carry_over_enabled: false, max_carry_over_days: 5,
  requires_approval: true, requires_documentation: false, documentation_after_days: 3,
  min_notice_days: 1, max_consecutive_days: null, gender_restricted: "",
  waiting_period_months: 0, paid: true, color: "#0F1B2D", notes: ""
};

export default function LeavePolicyModal({ open, onClose, onSave, onDelete, policy }) {
  const [form, setForm] = useState(DEFAULTS);
  const isEdit = !!policy?.id;

  useEffect(() => {
    if (open) setForm(policy ? { ...DEFAULTS, ...policy } : DEFAULTS);
  }, [open, policy]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, id: policy?.id });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Leave Policy" : "Add Leave Policy"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Leave Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Leave Type *</Label>
              <Select value={form.leave_type} onValueChange={v => set("leave_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{LEAVE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {form.leave_type === "Custom" && (
              <div className="space-y-1.5">
                <Label>Custom Name *</Label>
                <Input value={form.custom_name} onChange={e => set("custom_name", e.target.value)} placeholder="e.g. Volunteer Leave" required />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Display Colour</Label>
              <div className="flex gap-1.5 flex-wrap">
                {COLORS.map(c => (
                  <button type="button" key={c} onClick={() => set("color", c)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${form.color === c ? "border-gray-800 scale-110" : "border-transparent"}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <Label className="cursor-pointer">Enabled</Label>
              <Switch checked={!!form.is_enabled} onCheckedChange={v => set("is_enabled", v)} />
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <Label className="cursor-pointer">Paid Leave</Label>
              <Switch checked={!!form.paid} onCheckedChange={v => set("paid", v)} />
            </div>
          </div>

          {/* Accrual Method */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Entitlement & Accrual</p>
            <div className="space-y-1.5">
              <Label>Accrual Method *</Label>
              <Select value={form.accrual_type} onValueChange={v => set("accrual_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed — set number of days per year</SelectItem>
                  <SelectItem value="accrual">Accrual — earn days monthly (e.g. 1.75/month)</SelectItem>
                  <SelectItem value="unlimited">Unlimited — no cap on days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.accrual_type === "fixed" && (
              <div className="space-y-1.5">
                <Label>Days Per Year</Label>
                <Input type="number" min="0" step="0.5" value={form.fixed_days_per_year ?? ""} onChange={e => set("fixed_days_per_year", parseFloat(e.target.value))} placeholder="e.g. 20" />
              </div>
            )}

            {form.accrual_type === "accrual" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Days Earned Per Month</Label>
                  <Input type="number" min="0" step="0.25" value={form.accrual_rate_per_month ?? ""} onChange={e => set("accrual_rate_per_month", parseFloat(e.target.value))} placeholder="e.g. 1.75" />
                  <p className="text-[10px] text-gray-400">{form.accrual_rate_per_month ? `= ${(form.accrual_rate_per_month * 12).toFixed(1)} days/year` : ""}</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Maximum Accrual Cap (days)</Label>
                  <Input type="number" min="0" value={form.max_accrual_cap ?? ""} onChange={e => set("max_accrual_cap", e.target.value ? parseFloat(e.target.value) : null)} placeholder="Leave blank for no cap" />
                </div>
              </div>
            )}
          </div>

          {/* Carry-over */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Carry-Over</p>
              <Switch checked={!!form.carry_over_enabled} onCheckedChange={v => set("carry_over_enabled", v)} />
            </div>
            {form.carry_over_enabled && (
              <div className="space-y-1.5">
                <Label>Max Days to Carry Over</Label>
                <Input type="number" min="0" value={form.max_carry_over_days ?? ""} onChange={e => set("max_carry_over_days", e.target.value ? parseFloat(e.target.value) : null)} placeholder="Leave blank for unlimited" />
                <p className="text-[10px] text-gray-400">Set to 0 to allow carry-over tracking with no limit.</p>
              </div>
            )}
          </div>

          {/* Approval & Documentation */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Approval & Documentation</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <Label className="text-xs cursor-pointer">Requires Approval</Label>
                <Switch checked={!!form.requires_approval} onCheckedChange={v => set("requires_approval", v)} />
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <Label className="text-xs cursor-pointer">Documentation Required</Label>
                <Switch checked={!!form.requires_documentation} onCheckedChange={v => set("requires_documentation", v)} />
              </div>
            </div>
            {form.requires_documentation && (
              <div className="space-y-1.5">
                <Label>Require doc after how many days?</Label>
                <Input type="number" min="1" value={form.documentation_after_days ?? ""} onChange={e => set("documentation_after_days", parseFloat(e.target.value))} placeholder="e.g. 3 (sick note after 3 days)" />
              </div>
            )}
          </div>

          {/* Eligibility Constraints */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Eligibility & Constraints</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Minimum Notice (days)</Label>
                <Input type="number" min="0" value={form.min_notice_days ?? ""} onChange={e => set("min_notice_days", parseFloat(e.target.value))} placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label>Max Consecutive Days</Label>
                <Input type="number" min="1" value={form.max_consecutive_days ?? ""} onChange={e => set("max_consecutive_days", e.target.value ? parseFloat(e.target.value) : null)} placeholder="Unlimited" />
              </div>
              <div className="space-y-1.5">
                <Label>Waiting Period (months of employment)</Label>
                <Input type="number" min="0" value={form.waiting_period_months ?? 0} onChange={e => set("waiting_period_months", parseFloat(e.target.value))} placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label>Gender Restriction</Label>
                <Select value={form.gender_restricted || ""} onValueChange={v => set("gender_restricted", v)}>
                  <SelectTrigger><SelectValue placeholder="No restriction" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>No restriction</SelectItem>
                    <SelectItem value="Female">Female only (e.g. Maternity)</SelectItem>
                    <SelectItem value="Male">Male only (e.g. Paternity)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>Internal HR Notes</Label>
            <Textarea rows={2} value={form.notes || ""} onChange={e => set("notes", e.target.value)} placeholder="e.g. Refer to Employee Handbook Section 4.2…" />
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            {isEdit ? (
              <Button type="button" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-1" onClick={() => { onDelete(policy.id); onClose(); }}>
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
            ) : <div />}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="text-white" style={{ background: "#0F1B2D" }}>{isEdit ? "Save Changes" : "Create Policy"}</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}