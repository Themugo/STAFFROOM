import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEPARTMENTS = ["Engineering","Sales","Marketing","HR","Finance","Operations","Design","Legal","Executive"];

export default function BudgetSetupModal({ open, onClose, onSave, existing, year }) {
  const [rows, setRows] = useState({});

  useEffect(() => {
    if (!open) return;
    const init = {};
    DEPARTMENTS.forEach(d => {
      const found = existing.find(e => e.department === d && e.fiscal_year === year);
      init[d] = found ? found.annual_budget : "";
    });
    setRows(init);
  }, [open, existing, year]);

  const handleSave = () => {
    const data = DEPARTMENTS
      .filter(d => rows[d] !== "" && rows[d] !== undefined)
      .map(d => {
        const found = existing.find(e => e.department === d && e.fiscal_year === year);
        return { id: found?.id, department: d, fiscal_year: year, annual_budget: parseFloat(rows[d]) };
      });
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Set Departmental Budgets — {year}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-xs text-gray-400">Enter annual payroll budget per department. Leave blank to skip.</p>
          {DEPARTMENTS.map(dept => (
            <div key={dept} className="flex items-center gap-3">
              <Label className="w-28 text-xs text-gray-600 flex-shrink-0">{dept}</Label>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <Input
                  type="number"
                  className="pl-6"
                  placeholder="0"
                  value={rows[dept] ?? ""}
                  onChange={e => setRows(r => ({ ...r, [dept]: e.target.value }))}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} style={{ background: "#0F1B2D" }} className="text-white">Save Budgets</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}