import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, User, Briefcase, DollarSign, ClipboardList, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Design", "Legal", "Executive"];
const EMP_TYPES = ["Full-time", "Part-time", "Contract", "Intern"];
const STATUSES = ["Active", "On Leave", "Terminated"];

const STEPS = [
  { id: 0, label: "Personal", icon: User },
  { id: 1, label: "Role", icon: Briefcase },
  { id: 2, label: "Compensation", icon: DollarSign },
  { id: 3, label: "Review", icon: ClipboardList },
];

const EMPTY = {
  full_name: "", email: "", phone: "", address: "", emergency_contact: "",
  department: "", job_title: "", employment_type: "Full-time", status: "Active", start_date: "",
  base_salary: "", notes: ""
};

export default function OnboardingModal({ open, onClose, onSave, employee }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const isEdit = !!employee;

  useEffect(() => {
    if (employee) {
      setForm({ ...EMPTY, ...employee, base_salary: employee.base_salary || "" });
    } else {
      setForm(EMPTY);
      setAiSuggestion("");
    }
    setStep(0);
  }, [employee, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const suggestSalary = async () => {
    if (!form.job_title || !form.department) return;
    setAiSuggesting(true);
    setAiSuggestion("");
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Suggest a competitive annual salary range (USD) for a ${form.employment_type} ${form.job_title} in the ${form.department} department. Also suggest typical benefits and onboarding checklist items for this role. Be concise, 3-4 bullet points max per section.`,
        response_json_schema: {
          type: "object",
          properties: {
            salary_range: { type: "string" },
            benefits: { type: "array", items: { type: "string" } },
            onboarding_checklist: { type: "array", items: { type: "string" } }
          }
        }
      });
      // The model doesn't always fill every field even with a schema hint —
      // default missing arrays to [] rather than letting .map() throw and
      // leave aiSuggesting stuck true forever with no feedback to the user.
      const benefits = Array.isArray(res?.benefits) ? res.benefits : [];
      const checklist = Array.isArray(res?.onboarding_checklist) ? res.onboarding_checklist : [];
      const lines = [
        `💰 Suggested Salary: ${res?.salary_range || "Not available"}`,
        "", "✅ Benefits:", ...(benefits.length ? benefits.map(b => `• ${b}`) : ["• Not available"]),
        "", "📋 Onboarding Checklist:", ...(checklist.length ? checklist.map(c => `• ${c}`) : ["• Not available"]),
      ];
      setAiSuggestion(lines.join("\n"));
    } catch {
      setAiSuggestion("⚠ Couldn't get AI suggestions right now. Please try again.");
    } finally {
      setAiSuggesting(false);
    }
  };

  const handleSubmit = () => {
    onSave({ ...form, base_salary: form.base_salary ? parseFloat(form.base_salary) : undefined });
  };

  const canProceed = () => {
    if (step === 0) return form.full_name.trim();
    if (step === 1) return form.job_title.trim() && form.department;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100" style={{ background: "#0F1B2D" }}>
          <h2 className="text-white font-semibold text-lg">{isEdit ? "Edit Employee" : "New Employee Onboarding"}</h2>
          <p className="text-white/50 text-xs mt-0.5">{isEdit ? "Update employee details" : "Step-by-step setup for your new team member"}</p>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mt-5">
            {STEPS.map((s, i) => {
              const done = step > i;
              const active = step === i;
              return (
                <div key={s.id} className="flex items-center gap-2 flex-1">
                  <button
                    onClick={() => done && setStep(i)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      active ? "bg-amber-400 text-white" : done ? "bg-white/20 text-white cursor-pointer hover:bg-white/30" : "bg-white/10 text-white/40"
                    )}
                  >
                    {done ? <Check className="w-3 h-3" /> : <s.icon className="w-3 h-3" />}
                    {s.label}
                  </button>
                  {i < STEPS.length - 1 && <div className={cn("h-px flex-1", done ? "bg-amber-400/60" : "bg-white/10")} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Step 0: Personal */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input value={form.full_name} onChange={e => set("full_name", e.target.value)} required placeholder="Jane Smith" />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="jane@company.com" />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+1 555 000 0000" />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <Label>Emergency Contact</Label>
                  <Input value={form.emergency_contact} onChange={e => set("emergency_contact", e.target.value)} placeholder="Name — Phone" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Address</Label>
                  <Input value={form.address} onChange={e => set("address", e.target.value)} placeholder="123 Main St, City" />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Role */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label>Job Title *</Label>
                <Input value={form.job_title} onChange={e => set("job_title", e.target.value)} required placeholder="Software Engineer" />
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label>Department *</Label>
                <Select value={form.department} onValueChange={v => set("department", v)}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label>Employment Type</Label>
                <Select value={form.employment_type} onValueChange={v => set("employment_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{EMP_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => set("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={form.start_date} onChange={e => set("start_date", e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 2: Compensation */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Annual Base Salary ($)</Label>
                <Input type="number" value={form.base_salary} onChange={e => set("base_salary", e.target.value)} placeholder="60000" />
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3} placeholder="Any additional notes..." />
              </div>

              {/* AI Suggestion */}
              {form.job_title && form.department && (
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> AI Compensation & Onboarding Suggestions
                    </p>
                    <Button onClick={suggestSalary} disabled={aiSuggesting} size="sm"
                      className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white">
                      {aiSuggesting ? "Thinking…" : "Get Suggestions"}
                    </Button>
                  </div>
                  {aiSuggestion && (
                    <pre className="text-xs text-amber-900 whitespace-pre-wrap leading-relaxed">{aiSuggestion}</pre>
                  )}
                  {!aiSuggestion && !aiSuggesting && (
                    <p className="text-xs text-amber-600">Click to get AI-powered salary benchmarks and an onboarding checklist for this role.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-2">Review details before saving:</p>
              {[
                ["Full Name", form.full_name], ["Email", form.email], ["Phone", form.phone],
                ["Job Title", form.job_title], ["Department", form.department],
                ["Employment Type", form.employment_type], ["Status", form.status],
                ["Start Date", form.start_date], ["Base Salary", form.base_salary ? `$${parseFloat(form.base_salary).toLocaleString()}` : "—"],
                ["Address", form.address], ["Emergency Contact", form.emergency_contact],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-400 w-36 flex-shrink-0">{label}</span>
                  <span className="text-sm text-gray-900 text-right">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <Button variant="outline" onClick={step === 0 ? onClose : () => setStep(s => s - 1)} className="gap-1.5">
            {step === 0 ? "Cancel" : <><ChevronLeft className="w-4 h-4" /> Back</>}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
              className="text-white gap-1.5" style={{ background: "#0F1B2D" }}>
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="text-white gap-1.5" style={{ background: "#0F1B2D" }}>
              <Check className="w-4 h-4" /> {isEdit ? "Save Changes" : "Add Employee"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}