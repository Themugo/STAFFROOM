import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { eachDayOfInterval, isWeekend, differenceInBusinessDays, parseISO, differenceInMonths } from "date-fns";
import { AlertTriangle } from "lucide-react";

const FALLBACK_TYPES = ["Annual", "Sick", "Unpaid", "Maternity", "Paternity", "Compassionate", "Study"];

export default function LeaveRequestModal({ open, onClose, onSave, employees, currentUser, policies = [] }) {
  const [form, setForm] = useState({ employee_id: "", leave_type: "Annual", start_date: "", end_date: "", reason: "" });

  const enabledTypes = policies.filter(p => p.is_enabled).length > 0
    ? policies.filter(p => p.is_enabled)
    : FALLBACK_TYPES.map(t => ({ leave_type: t, custom_name: "", is_enabled: true, requires_documentation: false, min_notice_days: 0, gender_restricted: "", waiting_period_months: 0, max_consecutive_days: null }));

  useEffect(() => {
    if (open) {
      const me = employees.find(e => e.email === currentUser?.email);
      const firstType = enabledTypes[0]?.leave_type || "Annual";
      setForm({ employee_id: me?.id || "", leave_type: firstType, start_date: "", end_date: "", reason: "" });
    }
  }, [open, employees, currentUser]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Count each day individually rather than using differenceInBusinessDays(...)+1.
  // That approach assumes the start date is always itself a business day being
  // "added back in" to make the range inclusive — but plain date inputs don't
  // stop someone from picking a Saturday or Sunday as the start date. When they
  // do, the +1 adjustment silently counted that weekend day as a working day
  // (e.g. selecting Saturday as both start and end showed "1 working day
  // requested" instead of 0). Counting each day in the interval and filtering
  // out weekends — the same approach TeamCalendar.jsx already uses — gives the
  // correct answer regardless of which day of the week the range starts on.
  const days = form.start_date && form.end_date && form.end_date >= form.start_date
    ? eachDayOfInterval({ start: parseISO(form.start_date), end: parseISO(form.end_date) }).filter(d => !isWeekend(d)).length
    : 0;

  const selectedPolicy = policies.find(p => p.leave_type === form.leave_type);
  const selectedEmployee = employees.find(e => e.id === form.employee_id);

  // Policy warnings
  const warnings = [];
  if (selectedPolicy && selectedEmployee) {
    // NOTE: LeavePolicy.gender_restricted is configurable in the policy
    // settings UI (e.g. "Restrict to Female" on a Maternity policy), but
    // the Employee entity has no gender field anywhere in its schema —
    // there's nothing to check this against. This used to be an empty
    // `if (...) { /* flag if restricted */ }` block that did nothing,
    // which is worse than just missing: it reads as if the restriction is
    // enforced, so an HR admin configuring this setting could reasonably
    // believe leave requests are actually being validated against it when
    // they never are. Removed the dead stub rather than leave something
    // that looks like enforcement but silently isn't. Actually enforcing
    // this would mean adding demographic data collection to the Employee
    // entity, which is a real product/privacy decision, not something to
    // quietly bolt on here.
    if (selectedPolicy.waiting_period_months > 0 && selectedEmployee.start_date) {
      const months = differenceInMonths(new Date(), parseISO(selectedEmployee.start_date));
      if (months < selectedPolicy.waiting_period_months) {
        warnings.push(`This leave type requires ${selectedPolicy.waiting_period_months} months of employment. Employee has ${months} months.`);
      }
    }
    if (selectedPolicy.min_notice_days > 0 && form.start_date) {
      const noticeDays = differenceInBusinessDays(parseISO(form.start_date), new Date());
      if (noticeDays < selectedPolicy.min_notice_days) {
        warnings.push(`Minimum ${selectedPolicy.min_notice_days} working day(s) notice required.`);
      }
    }
    if (selectedPolicy.max_consecutive_days && days > selectedPolicy.max_consecutive_days) {
      warnings.push(`Maximum ${selectedPolicy.max_consecutive_days} consecutive days allowed for this leave type.`);
    }
    if (selectedPolicy.requires_documentation && selectedPolicy.documentation_after_days && days >= selectedPolicy.documentation_after_days) {
      warnings.push(`Documentation (e.g. medical certificate) required — request exceeds ${selectedPolicy.documentation_after_days} days.`);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === form.employee_id);
    onSave({
      ...form,
      employee_name: emp?.full_name || "",
      employee_email: emp?.email || "",
      department: emp?.department || "",
      days_requested: days,
      status: (selectedPolicy?.requires_approval === false) ? "Approved" : "Pending",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Leave Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Employee *</Label>
            <Select value={form.employee_id} onValueChange={v => set("employee_id", v)}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>
                {employees.filter(e => e.status !== "Terminated").map(e => (
                  <SelectItem key={e.id} value={e.id}>{e.full_name} — {e.department}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Leave Type *</Label>
            <Select value={form.leave_type} onValueChange={v => set("leave_type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {enabledTypes.map(p => {
                  const label = p.leave_type === "Custom" && p.custom_name ? p.custom_name : p.leave_type;
                  return <SelectItem key={p.leave_type + (p.custom_name || "")} value={p.leave_type}>{label}{!p.paid ? " (Unpaid)" : ""}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            {selectedPolicy && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {!selectedPolicy.requires_approval && <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">Auto-approved</span>}
                {selectedPolicy.min_notice_days > 0 && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{selectedPolicy.min_notice_days}d min notice</span>}
                {selectedPolicy.requires_documentation && <span className="text-[10px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full">Documentation may be required</span>}
                {!selectedPolicy.paid && <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">Unpaid</span>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Start Date *</Label>
              <Input type="date" value={form.start_date} onChange={e => set("start_date", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>End Date *</Label>
              <Input type="date" value={form.end_date} onChange={e => set("end_date", e.target.value)} required min={form.start_date} />
            </div>
          </div>

          {days > 0 && (
            <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: "#0F1B2D", color: "#D4A843" }}>
              {days} working day{days !== 1 ? "s" : ""} requested
            </div>
          )}

          {warnings.length > 0 && (
            <div className="space-y-2">
              {warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">{w}</p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Reason</Label>
            <Textarea rows={3} value={form.reason} onChange={e => set("reason", e.target.value)} placeholder="Optional details..." />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="text-white" style={{ background: "#0F1B2D" }}>Submit Request</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}