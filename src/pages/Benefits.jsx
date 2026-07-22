import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Heart, Pencil, Trash2, DollarSign, CheckCircle2, Users } from "lucide-react";
import { format } from "date-fns";

const BENEFIT_TYPES = ["Health Insurance", "Dental", "Vision", "Life Insurance", "401k / Pension", "Gym Membership", "Remote Work Stipend", "Education Allowance", "Other"];
const COVERAGE_LEVELS = ["Employee Only", "Employee + Spouse", "Employee + Children", "Family"];
const STATUSES = ["Active", "Pending", "Cancelled"];

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

const TYPE_ICONS = {
  "Health Insurance": "🏥", "Dental": "🦷", "Vision": "👁️", "Life Insurance": "🛡️",
  "401k / Pension": "💰", "Gym Membership": "💪", "Remote Work Stipend": "🏠",
  "Education Allowance": "📚", "Other": "✨",
};

const PLAN_CATALOG = [
  { type: "Health Insurance", name: "Basic PPO", coverage: "Employee Only", monthly_cost: 180, employer_contribution: 150, description: "Standard PPO plan with broad network coverage." },
  { type: "Health Insurance", name: "Premium PPO", coverage: "Family", monthly_cost: 520, employer_contribution: 400, description: "Full family coverage with low deductibles." },
  { type: "Dental", name: "Dental Plus", coverage: "Employee Only", monthly_cost: 35, employer_contribution: 25, description: "Covers preventive, basic and major dental care." },
  { type: "Vision", name: "Vision Care", coverage: "Employee Only", monthly_cost: 15, employer_contribution: 10, description: "Annual eye exam + frames/contacts allowance." },
  { type: "401k / Pension", name: "401k Match", coverage: "Employee Only", monthly_cost: 0, employer_contribution: 200, description: "Company matches up to 4% of salary." },
  { type: "Gym Membership", name: "Fitness Stipend", coverage: "Employee Only", monthly_cost: 50, employer_contribution: 50, description: "Reimbursement for any gym or fitness app." },
  { type: "Life Insurance", name: "Term Life 2x", coverage: "Employee Only", monthly_cost: 20, employer_contribution: 20, description: "2x annual salary term life coverage." },
  { type: "Education Allowance", name: "Learning Budget", coverage: "Employee Only", monthly_cost: 0, employer_contribution: 100, description: "Monthly budget for courses, books, conferences." },
];

function BenefitModal({ open, onClose, onSave, employees, benefit, prefill }) {
  const [form, setForm] = useState({
    employee_id: "", benefit_type: "Health Insurance", plan_name: "",
    coverage_level: "Employee Only", enrollment_date: "", effective_date: "",
    end_date: "", monthly_cost: "", employer_contribution: "", status: "Active", notes: ""
  });

  useEffect(() => {
    if (benefit) setForm({ ...benefit, monthly_cost: benefit.monthly_cost || "", employer_contribution: benefit.employer_contribution || "" });
    else if (prefill) setForm(f => ({ ...f, benefit_type: prefill.type, plan_name: prefill.name, coverage_level: prefill.coverage, monthly_cost: prefill.monthly_cost, employer_contribution: prefill.employer_contribution, enrollment_date: new Date().toISOString().split("T")[0] }));
    else setForm({ employee_id: "", benefit_type: "Health Insurance", plan_name: "", coverage_level: "Employee Only", enrollment_date: "", effective_date: "", end_date: "", monthly_cost: "", employer_contribution: "", status: "Active", notes: "" });
  }, [benefit, open, prefill]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = (e) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === form.employee_id);
    onSave({ ...form, employee_name: emp?.full_name || "", monthly_cost: form.monthly_cost ? parseFloat(form.monthly_cost) : undefined, employer_contribution: form.employer_contribution ? parseFloat(form.employer_contribution) : undefined });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{benefit ? "Edit Enrollment" : "New Benefit Enrollment"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Employee *</Label>
            <Select value={form.employee_id} onValueChange={v => set("employee_id", v)}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Benefit Type *</Label>
              <Select value={form.benefit_type} onValueChange={v => set("benefit_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{BENEFIT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Plan Name</Label>
              <Input value={form.plan_name} onChange={e => set("plan_name", e.target.value)} placeholder="Premium Plus" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Coverage Level</Label>
              <Select value={form.coverage_level} onValueChange={v => set("coverage_level", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{COVERAGE_LEVELS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Enrollment Date *</Label>
              <Input type="date" value={form.enrollment_date} onChange={e => set("enrollment_date", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Effective Date</Label>
              <Input type="date" value={form.effective_date} onChange={e => set("effective_date", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Monthly Cost ($)</Label>
              <Input type="number" value={form.monthly_cost} onChange={e => set("monthly_cost", e.target.value)} placeholder="250" />
            </div>
            <div className="space-y-1.5">
              <Label>Employer Contribution ($)</Label>
              <Input type="number" value={form.employer_contribution} onChange={e => set("employer_contribution", e.target.value)} placeholder="150" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} placeholder="Optional notes..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="text-white" style={{ background: "#0F1B2D" }}>{benefit ? "Save Changes" : "Enroll"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Benefits() {
  const [enrollments, setEnrollments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [prefill, setPrefill] = useState(null);

  const load = async () => {
    setLoadError(null);
    try {
      const [b, e] = await Promise.all([
        base44.entities.BenefitEnrollment.list("-created_date"),
        base44.entities.Employee.list("full_name"),
      ]);
      setEnrollments(b); setEmployees(e);
    } catch {
      setLoadError("Failed to load benefits data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = enrollments.filter(b => {
    const matchSearch = !search || b.employee_name?.toLowerCase().includes(search.toLowerCase()) || b.plan_name?.toLowerCase().includes(search.toLowerCase()) || b.benefit_type?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || b.benefit_type === typeFilter;
    const matchStatus = statusFilter === "All" || b.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleSave = async (data) => {
    try {
      if (editing) await base44.entities.BenefitEnrollment.update(editing.id, data);
      else await base44.entities.BenefitEnrollment.create(data);
      setModalOpen(false); setEditing(null); setPrefill(null); load();
    } catch {
      alert("Failed to save enrollment. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this enrollment?")) return;
    try {
      await base44.entities.BenefitEnrollment.delete(id);
      load();
    } catch {
      alert("Failed to remove enrollment. Please try again.");
    }
  };

  const openFromCatalog = (plan) => { setEditing(null); setPrefill(plan); setModalOpen(true); };

  const active = enrollments.filter(b => b.status === "Active");
  const totalCost = active.reduce((s, b) => s + (b.monthly_cost || 0), 0);
  const employerCost = active.reduce((s, b) => s + (b.employer_contribution || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Benefits Portal</h2>
          <p className="text-sm text-gray-500 mt-0.5">{enrollments.length} enrollments total</p>
        </div>
        <Button onClick={() => { setEditing(null); setPrefill(null); setModalOpen(true); }} className="text-white gap-2" style={{ background: "#0F1B2D" }}>
          <Plus className="w-4 h-4" /> New Enrollment
        </Button>
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Enrollments", value: active.length, icon: CheckCircle2, color: "#10b981" },
          { label: "Total Monthly Cost", value: `$${totalCost.toLocaleString()}`, icon: DollarSign, color: "#6366f1" },
          { label: "Employer Monthly", value: `$${employerCost.toLocaleString()}`, icon: Heart, color: "#D4A843" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div><p className="text-2xl font-bold text-gray-900">{value}</p><p className="text-sm text-gray-500">{label}</p></div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="enrollments">
        <TabsList className="bg-gray-100 rounded-xl p-1">
          <TabsTrigger value="enrollments" className="rounded-lg text-xs px-4">Enrollments</TabsTrigger>
          <TabsTrigger value="catalog" className="rounded-lg text-xs px-4">Plan Catalog</TabsTrigger>
          <TabsTrigger value="by-employee" className="rounded-lg text-xs px-4">By Employee</TabsTrigger>
        </TabsList>

        {/* Enrollments tab */}
        <TabsContent value="enrollments" className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input className="pl-9" placeholder="Search employee or plan…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Benefit Types</SelectItem>
                {BENEFIT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48"><div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-800 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400"><Heart className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="font-medium">No enrollments found</p></div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Benefit</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Employee</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Coverage</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Monthly Cost</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{TYPE_ICONS[b.benefit_type] || "✨"}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{b.benefit_type}</p>
                            {b.plan_name && <p className="text-xs text-gray-400">{b.plan_name}</p>}
                            <p className="text-xs text-gray-400 sm:hidden">{b.employee_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell"><p className="text-sm text-gray-700">{b.employee_name}</p></td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-gray-600">{b.coverage_level}</p>
                        {b.effective_date && <p className="text-xs text-gray-400">Since {format(new Date(b.effective_date), "MMM yyyy")}</p>}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {b.monthly_cost ? (
                          <div><p className="text-sm font-medium text-gray-800">${b.monthly_cost}/mo</p>{b.employer_contribution && <p className="text-xs text-green-600">Employer: ${b.employer_contribution}</p>}</div>
                        ) : <span className="text-sm text-gray-400">—</span>}
                      </td>
                      <td className="px-5 py-4"><Badge className={STATUS_COLORS[b.status] || STATUS_COLORS.Active}>{b.status}</Badge></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700" onClick={() => { setEditing(b); setPrefill(null); setModalOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-600" onClick={() => handleDelete(b.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Plan Catalog tab */}
        <TabsContent value="catalog" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLAN_CATALOG.map((plan, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{TYPE_ICONS[plan.type] || "✨"}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{plan.name}</p>
                      <p className="text-xs text-gray-400">{plan.type}</p>
                    </div>
                  </div>
                  {plan.employer_contribution > 0 && (
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">Employer Covered</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{plan.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                  <span>Employee cost: <strong className="text-gray-800">${plan.monthly_cost}/mo</strong></span>
                  <span>Employer: <strong className="text-emerald-700">+${plan.employer_contribution}</strong></span>
                </div>
                <Button size="sm" onClick={() => openFromCatalog(plan)} className="w-full text-white text-xs" style={{ background: "#0F1B2D" }}>
                  <Plus className="w-3 h-3 mr-1" /> Enroll Employee
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* By Employee tab */}
        <TabsContent value="by-employee" className="mt-4">
          <div className="space-y-4">
            {employees.filter(emp => enrollments.some(b => b.employee_id === emp.id)).map(emp => {
              const empBenefits = enrollments.filter(b => b.employee_id === emp.id);
              const activeBenefits = empBenefits.filter(b => b.status === "Active");
              const empCost = activeBenefits.reduce((s, b) => s + (b.monthly_cost || 0), 0);
              const empEmployer = activeBenefits.reduce((s, b) => s + (b.employer_contribution || 0), 0);
              return (
                <div key={emp.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: "#0F1B2D" }}>
                        {emp.full_name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{emp.full_name}</p>
                        <p className="text-xs text-gray-400">{emp.job_title} · {emp.department}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      <p className="font-semibold text-gray-700">${empCost}/mo employee</p>
                      <p className="text-emerald-600">+${empEmployer} employer</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {empBenefits.map(b => (
                      <span key={b.id} className={`text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1 ${STATUS_COLORS[b.status]}`}>
                        {TYPE_ICONS[b.benefit_type]} {b.benefit_type}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            {employees.filter(emp => enrollments.some(b => b.employee_id === emp.id)).length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No employees enrolled yet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <BenefitModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); setPrefill(null); }}
        onSave={handleSave} employees={employees} benefit={editing} prefill={prefill} />
    </div>
  );
}