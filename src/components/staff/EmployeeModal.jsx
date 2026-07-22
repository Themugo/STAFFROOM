import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Design", "Legal", "Executive"];
const EMP_TYPES = ["Full-time", "Part-time", "Contract", "Intern"];
const STATUSES = ["Active", "On Leave", "Terminated"];

export default function EmployeeModal({ open, onClose, onSave, employee }) {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", department: "", job_title: "",
    employment_type: "Full-time", status: "Active", start_date: "",
    base_salary: "", address: "", emergency_contact: "", notes: ""
  });

  useEffect(() => {
    if (employee) {
      setForm({ ...employee, base_salary: employee.base_salary || "" });
    } else {
      setForm({ full_name: "", email: "", phone: "", department: "", job_title: "",
        employment_type: "Full-time", status: "Active", start_date: "",
        base_salary: "", address: "", emergency_contact: "", notes: "" });
    }
  }, [employee, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, base_salary: form.base_salary ? parseFloat(form.base_salary) : undefined });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {employee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <Label>Full Name *</Label>
              <Input value={form.full_name} onChange={e => set("full_name", e.target.value)} required placeholder="Jane Smith" />
            </div>
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <Label>Job Title *</Label>
              <Input value={form.job_title} onChange={e => set("job_title", e.target.value)} required placeholder="Software Engineer" />
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
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <Label>Annual Base Salary ($)</Label>
              <Input type="number" value={form.base_salary} onChange={e => set("base_salary", e.target.value)} placeholder="60000" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Address</Label>
              <Input value={form.address} onChange={e => set("address", e.target.value)} placeholder="123 Main St, City" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Emergency Contact</Label>
              <Input value={form.emergency_contact} onChange={e => set("emergency_contact", e.target.value)} placeholder="Name — Phone" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} placeholder="Any additional notes..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="text-white" style={{ background: "#0F1B2D" }}>
              {employee ? "Save Changes" : "Add Employee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}