import { useEffect, useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, RefreshCw } from "lucide-react";
import BudgetSummaryBar from "@/components/budget/BudgetSummaryBar";
import DepartmentBudgetRow from "@/components/budget/DepartmentBudgetRow";
import BudgetSetupModal from "@/components/budget/BudgetSetupModal";

const DEPARTMENTS = ["Engineering","Sales","Marketing","HR","Finance","Operations","Design","Legal","Executive"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1];

export default function Budget() {
  const [employees, setEmployees] = useState([]);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [promotionRequests, setPromotionRequests] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [emps, pays, promos, budgs] = await Promise.all([
        base44.entities.Employee.list(),
        base44.entities.PayrollRecord.list(),
        base44.entities.PromotionRequest.list(),
        base44.entities.DepartmentBudget.list(),
      ]);
      setEmployees(emps);
      setPayrollRecords(pays);
      setPromotionRequests(promos);
      setBudgets(budgs);
    } catch {
      setLoadError("Failed to load budget data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Annual actual payroll cost per dept (sum all paid/approved records for the selected year)
  const actualByDept = useMemo(() => {
    const map = {};
    DEPARTMENTS.forEach(d => { map[d] = 0; });
    payrollRecords
      .filter(p => p.pay_period_year === year && (p.status === "Paid" || p.status === "Approved"))
      .forEach(p => {
        // find employee's dept
        const emp = employees.find(e => e.id === p.employee_id);
        if (emp?.department) map[emp.department] = (map[emp.department] || 0) + (p.net_pay || 0);
      });
    // Multiply monthly to annual (if we have < 12 months of data, still annualise proportionally)
    // Alternatively: use employee base_salary as a more reliable annual figure
    // Use base_salary sum as annual payroll (most reliable)
    const bySalary = {};
    DEPARTMENTS.forEach(d => { bySalary[d] = 0; });
    employees
      .filter(e => e.status !== "Terminated")
      .forEach(e => {
        if (e.department) bySalary[e.department] = (bySalary[e.department] || 0) + (e.base_salary || 0);
      });
    return bySalary;
  }, [employees, payrollRecords, year]);

  // Pending promotion impact per dept (annualised salary delta from pending requests)
  const promotionImpactByDept = useMemo(() => {
    const map = {};
    DEPARTMENTS.forEach(d => { map[d] = 0; });
    promotionRequests
      .filter(p => p.status === "Pending HR" || p.status === "Pending Finance")
      .forEach(p => {
        const delta = (p.proposed_salary || 0) - (p.current_salary || 0);
        if (p.department && delta > 0) map[p.department] = (map[p.department] || 0) + delta;
      });
    return map;
  }, [promotionRequests]);

  // Budget lookup
  const budgetByDept = useMemo(() => {
    const map = {};
    DEPARTMENTS.forEach(d => { map[d] = 0; });
    budgets.filter(b => b.fiscal_year === year).forEach(b => { map[b.department] = b.annual_budget; });
    return map;
  }, [budgets, year]);

  // Headcount
  const headcountByDept = useMemo(() => {
    const map = {};
    DEPARTMENTS.forEach(d => { map[d] = 0; });
    employees.filter(e => e.status !== "Terminated").forEach(e => {
      if (e.department) map[e.department] = (map[e.department] || 0) + 1;
    });
    return map;
  }, [employees]);

  // Summary totals
  const totalBudget = Object.values(budgetByDept).reduce((s, v) => s + v, 0);
  const totalActual = Object.values(actualByDept).reduce((s, v) => s + v, 0);
  const totalPromoImpact = Object.values(promotionImpactByDept).reduce((s, v) => s + v, 0);
  const totalForecasted = totalActual + totalPromoImpact;

  const overCount = DEPARTMENTS.filter(d => budgetByDept[d] > 0 && (actualByDept[d] + promotionImpactByDept[d]) > budgetByDept[d]).length;
  const atRiskCount = DEPARTMENTS.filter(d => {
    const b = budgetByDept[d]; const f = actualByDept[d] + promotionImpactByDept[d];
    return b > 0 && f <= b && (f / b) >= 0.85;
  }).length;

  // Sort: over budget first, then at-risk, then by dept name
  const sortedDepts = [...DEPARTMENTS].sort((a, b) => {
    const aOver = budgetByDept[a] > 0 && (actualByDept[a] + promotionImpactByDept[a]) > budgetByDept[a];
    const bOver = budgetByDept[b] > 0 && (actualByDept[b] + promotionImpactByDept[b]) > budgetByDept[b];
    const aRisk = budgetByDept[a] > 0 && !aOver && ((actualByDept[a] + promotionImpactByDept[a]) / budgetByDept[a]) >= 0.85;
    const bRisk = budgetByDept[b] > 0 && !bOver && ((actualByDept[b] + promotionImpactByDept[b]) / budgetByDept[b]) >= 0.85;
    if (aOver && !bOver) return -1;
    if (!aOver && bOver) return 1;
    if (aRisk && !bRisk) return -1;
    if (!aRisk && bRisk) return 1;
    return a.localeCompare(b);
  });

  const handleSaveBudgets = async (data) => {
    try {
      await Promise.all(data.map(item =>
        item.id
          ? base44.entities.DepartmentBudget.update(item.id, item)
          : base44.entities.DepartmentBudget.create(item)
      ));
      setModalOpen(false);
      load();
    } catch {
      alert("Failed to save budgets. Please try again.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
    </div>
  );

  if (loadError) return (
    <div className="text-center py-20">
      <p className="text-sm font-medium text-red-600">{loadError}</p>
      <button onClick={load} className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors">
        Retry
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Budget Tracker</h2>
          <p className="text-xs text-gray-400 mt-0.5">Departmental payroll costs, promotion forecasts & budget health</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={String(year)} onValueChange={v => setYear(Number(v))}>
            <SelectTrigger className="w-28 h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>{YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
          <Button onClick={() => setModalOpen(true)} className="text-white gap-2 h-9" style={{ background: "#0F1B2D" }}>
            <Settings2 className="w-4 h-4" /> Set Budgets
          </Button>
        </div>
      </div>

      {/* Summary */}
      <BudgetSummaryBar
        totalBudget={totalBudget}
        totalActual={totalActual}
        totalForecasted={totalForecasted}
        overCount={overCount}
        atRiskCount={atRiskCount}
      />

      {/* No budget hint */}
      {totalBudget === 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center">
          <Settings2 className="w-8 h-8 text-indigo-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-indigo-700">No budgets set for {year}</p>
          <p className="text-xs text-indigo-500 mt-1">Click <strong>Set Budgets</strong> to define annual payroll budgets per department.</p>
        </div>
      )}

      {/* Promotion impact callout */}
      {totalPromoImpact > 0 && (
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <span className="text-violet-600 text-sm font-bold">↑</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-800">
              Pending promotions could add <span className="text-violet-900">${(totalPromoImpact/1000).toFixed(1)}k/yr</span> to payroll costs
            </p>
            <p className="text-xs text-violet-500 mt-0.5">
              {promotionRequests.filter(p => p.status === "Pending HR" || p.status === "Pending Finance").length} pending request(s) across departments.
              Forecasted totals include these potential increases.
            </p>
          </div>
        </div>
      )}

      {/* Dept grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedDepts.map(dept => (
          <DepartmentBudgetRow
            key={dept}
            dept={dept}
            actual={actualByDept[dept] || 0}
            budget={budgetByDept[dept] || 0}
            promotionImpact={promotionImpactByDept[dept] || 0}
            headcount={headcountByDept[dept] || 0}
          />
        ))}
      </div>

      <BudgetSetupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveBudgets}
        existing={budgets}
        year={year}
      />
    </div>
  );
}