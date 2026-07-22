import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";

const PERIODS = ["Q1 2025","Q2 2025","Q3 2025","Q4 2025","Q1 2026","Q2 2026","Q3 2026","Q4 2026"];

export default function PromotionRequestModal({ open, onClose, onSave, employees, request }) {
  const [form, setForm] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (request) {
      setForm(request);
    } else {
      setForm({ status: "Draft", hr_decision: "", finance_decision: "" });
    }
  }, [request, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleEmployeeChange = async (empId) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    set("employee_id", empId);
    set("employee_name", emp.full_name);
    set("department", emp.department);
    set("current_title", emp.job_title);
    set("current_salary", emp.base_salary || 0);
    // Fetch latest review to prefill performance fields. This is a
    // convenience autofill, not required data — the employee fields above
    // are already set and stay manually editable either way, so a failure
    // here just means the reviewer fills in performance_rating/goals_met
    // themselves instead of seeing prefilled values.
    try {
      const revs = await base44.entities.PerformanceReview.filter({ employee_id: empId }, "-review_date", 1);
      if (revs.length) {
        setReviews(revs);
        set("performance_rating", revs[0].overall_rating);
        set("goals_met_pct", revs[0].goals_met);
        set("review_period", revs[0].review_period);
      }
    } catch {
      // Non-blocking: silently leave the performance fields empty for
      // manual entry rather than surfacing an error for an optional prefill.
    }
  };

  const calcPct = (curr, proposed) => {
    if (!curr || !proposed) return 0;
    return parseFloat((((proposed - curr) / curr) * 100).toFixed(1));
  };

  const handleSalaryChange = (proposed) => {
    set("proposed_salary", proposed);
    set("salary_increase_pct", calcPct(form.current_salary, proposed));
  };

  // "Current Salary" is auto-filled when an employee is selected, but stays
  // editable (e.g. to correct an out-of-date on-file figure). If it's
  // changed *after* a proposed salary was already entered, the displayed
  // (and eventually submitted) salary_increase_pct previously stayed frozen
  // at whatever it was computed against the old current_salary — silently
  // wrong once someone corrects the current-salary figure.
  const handleCurrentSalaryChange = (curr) => {
    set("current_salary", curr);
    if (form.proposed_salary) {
      set("salary_increase_pct", calcPct(curr, form.proposed_salary));
    }
  };

  const handleSubmit = (submitAs) => {
    const data = { ...form, status: submitAs };
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{request ? "Edit Promotion Request" : "New Promotion Request"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Employee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-xs text-gray-500 mb-1 block">Employee *</Label>
              <Select value={form.employee_id || ""} onValueChange={handleEmployeeChange}>
                <SelectTrigger><SelectValue placeholder="Select employee…" /></SelectTrigger>
                <SelectContent>
                  {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name} — {e.department}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Current Title</Label>
              <Input value={form.current_title || ""} readOnly className="bg-gray-50 text-gray-500" />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Proposed Title *</Label>
              <Input value={form.proposed_title || ""} onChange={e => set("proposed_title", e.target.value)} placeholder="e.g. Senior Engineer" />
            </div>
          </div>

          {/* Compensation */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Compensation Change</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Current Salary ($)</Label>
                <Input type="number" value={form.current_salary || ""} onChange={e => handleCurrentSalaryChange(parseFloat(e.target.value))} />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Proposed Salary ($)</Label>
                <Input type="number" value={form.proposed_salary || ""} onChange={e => handleSalaryChange(parseFloat(e.target.value))} />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Increase %</Label>
                <div className={`h-9 flex items-center px-3 rounded-md border text-sm font-semibold ${form.salary_increase_pct > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-100 border-gray-200 text-gray-400"}`}>
                  {form.salary_increase_pct ? `+${form.salary_increase_pct}%` : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Performance context */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Review Period</Label>
              <Select value={form.review_period || ""} onValueChange={v => set("review_period", v)}>
                <SelectTrigger><SelectValue placeholder="Period…" /></SelectTrigger>
                <SelectContent>{PERIODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Performance Rating (1–5)</Label>
              <Input type="number" min={1} max={5} step={0.1} value={form.performance_rating || ""} onChange={e => set("performance_rating", parseFloat(e.target.value))} />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Goals Met %</Label>
              <Input type="number" min={0} max={100} value={form.goals_met_pct || ""} onChange={e => set("goals_met_pct", parseFloat(e.target.value))} />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Effective Date</Label>
            <Input type="date" value={form.effective_date || ""} onChange={e => set("effective_date", e.target.value)} className="w-48" />
          </div>

          {/* Justification */}
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Manager Justification *</Label>
            <Textarea rows={4} value={form.justification || ""} onChange={e => set("justification", e.target.value)}
              placeholder="Describe the employee's key achievements, impact, readiness for the new role, and any relevant context…" />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Supporting Notes (optional)</Label>
            <Textarea rows={2} value={form.supporting_notes || ""} onChange={e => set("supporting_notes", e.target.value)}
              placeholder="Peer feedback, project outcomes, tenure notes…" />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Submitted By (Manager Name)</Label>
            <Input value={form.manager_name || ""} onChange={e => set("manager_name", e.target.value)} placeholder="Your name" />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="outline" onClick={() => handleSubmit("Draft")} className="text-gray-600">Save Draft</Button>
          <Button onClick={() => handleSubmit("Pending HR")} style={{ background: "#0F1B2D" }} className="text-white"
            disabled={!form.employee_id || !form.proposed_title || !form.justification}>
            Submit for HR Review →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}