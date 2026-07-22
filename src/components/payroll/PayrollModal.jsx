import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function PayrollModal({ open, onClose, onSave, record, employees }) {
  const [form, setForm] = useState({
    employee_id: "", pay_period_month: new Date().getMonth() + 1,
    pay_period_year: new Date().getFullYear(),
    base_salary: "", bonus: "0", deductions: "0", tax: "0",
    status: "Draft", payment_date: "", notes: ""
  });

  useEffect(() => {
    if (record) {
      setForm({ ...record, base_salary: record.base_salary || "", bonus: record.bonus || "0",
        deductions: record.deductions || "0", tax: record.tax || "0" });
    } else {
      setForm({ employee_id: "", pay_period_month: new Date().getMonth() + 1,
        pay_period_year: new Date().getFullYear(),
        base_salary: "", bonus: "0", deductions: "0", tax: "0",
        status: "Draft", payment_date: "", notes: "" });
    }
  }, [record, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleEmployeeChange = (empId) => {
    const emp = employees.find(e => e.id === empId);
    set("employee_id", empId);
    if (emp?.base_salary) {
      const monthly = (emp.base_salary / 12).toFixed(2);
      setForm(f => ({ ...f, employee_id: empId, base_salary: monthly }));
    }
  };

  const base = parseFloat(form.base_salary) || 0;
  const bonus = parseFloat(form.bonus) || 0;
  const deductions = parseFloat(form.deductions) || 0;
  const tax = parseFloat(form.tax) || 0;
  const netPay = base + bonus - deductions - tax;

  const handleSubmit = (e) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === form.employee_id);
    onSave({
      ...form,
      employee_name: emp?.full_name || "",
      base_salary: base,
      bonus,
      deductions,
      tax,
      net_pay: netPay,
      pay_period_month: parseInt(form.pay_period_month),
      pay_period_year: parseInt(form.pay_period_year),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {record ? "Edit Payroll Record" : "New Payroll Record"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Employee *</Label>
            <Select value={form.employee_id} onValueChange={handleEmployeeChange}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>
                {employees.filter(e => e.status !== "Terminated").map(e => (
                  <SelectItem key={e.id} value={e.id}>{e.full_name} — {e.department}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Month</Label>
              <Select value={String(form.pay_period_month)} onValueChange={v => set("pay_period_month", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{MONTHS.map((m, i) => <SelectItem key={i} value={String(i+1)}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Year</Label>
              <Input type="number" value={form.pay_period_year} onChange={e => set("pay_period_year", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Base Pay ($)</Label>
              <Input type="number" value={form.base_salary} onChange={e => set("base_salary", e.target.value)} placeholder="5000" />
            </div>
            <div className="space-y-1.5">
              <Label>Bonus ($)</Label>
              <Input type="number" value={form.bonus} onChange={e => set("bonus", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Deductions ($)</Label>
              <Input type="number" value={form.deductions} onChange={e => set("deductions", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Tax ($)</Label>
              <Input type="number" value={form.tax} onChange={e => set("tax", e.target.value)} />
            </div>
          </div>

          {/* Net Pay Preview */}
          <div className="rounded-xl p-4" style={{ background: "#0F1B2D" }}>
            <p className="text-white/60 text-xs mb-1">Net Pay</p>
            <p className="text-white text-2xl font-bold">${netPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Payment Date</Label>
              <Input type="date" value={form.payment_date} onChange={e => set("payment_date", e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="text-white" style={{ background: "#0F1B2D" }}>
              {record ? "Save Changes" : "Create Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}