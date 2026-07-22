import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PERIODS = ["Q1 2025","Q2 2025","Q3 2025","Q4 2025","Q1 2026","Q2 2026","Q3 2026","Q4 2026"];
const CATEGORIES = ["Performance", "Development", "Leadership", "Technical", "Collaboration"];
const STATUSES = ["Not Started", "In Progress", "Completed", "Cancelled"];

const BLANK = {
  employee_id: "", period: "Q2 2026", title: "", description: "",
  category: "Performance", target: "", progress: 0,
  status: "Not Started", due_date: "", manager_notes: ""
};

export default function GoalModal({ open, onClose, onSave, employees, goal }) {
  const [form, setForm] = useState(BLANK);

  useEffect(() => {
    setForm(goal ? { ...BLANK, ...goal } : BLANK);
  }, [goal, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const emp = employees.find(e => e.id === form.employee_id);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, employee_name: emp?.full_name || "", department: emp?.department || "", progress: parseInt(form.progress) || 0 });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "New Goal"}</DialogTitle>
        </DialogHeader>
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
              <Label>Period</Label>
              <Select value={form.period} onValueChange={v => set("period", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PERIODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => set("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Goal Title *</Label>
            <Input required value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Improve customer satisfaction score by 15%" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} placeholder="Additional context and details..." />
          </div>
          <div className="space-y-1.5">
            <Label>Measurable Target</Label>
            <Input value={form.target} onChange={e => set("target", e.target.value)} placeholder="e.g. NPS score from 72 to 83" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Progress: {form.progress}%</Label>
              <input type="range" min={0} max={100} value={form.progress}
                onChange={e => set("progress", e.target.value)}
                className="w-full accent-emerald-500" />
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
              <Label>Due Date</Label>
              <Input type="date" value={form.due_date} onChange={e => set("due_date", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Manager Notes</Label>
            <Textarea value={form.manager_notes} onChange={e => set("manager_notes", e.target.value)} rows={2} placeholder="Coaching notes or guidance from manager..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="text-white" style={{ background: "#0F1B2D" }}>
              {goal ? "Save Changes" : "Add Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}