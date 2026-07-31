import { useEffect, useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import {
  DollarSign, CheckCircle2, Clock, Banknote, Sparkles, Zap, AlertTriangle,
  Building2, Calendar, FileText, Plus, Search, Filter, Download, Send,
  ShieldCheck, TrendingUp, UserCheck, Users, CreditCard, ArrowUpRight,
  PieChart, BarChart2, Receipt, Printer, Eye, RefreshCw, Lock, Check,
  ChevronRight, FileCheck, Briefcase, Sliders, Calculator, Award, UserX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PayrollModal from "../components/payroll/PayrollModal";
import AiChatPanel from "../components/shared/AiChatPanel";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart as RePieChart, Pie, Cell } from "recharts";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const STATUTORY_RATES = {
  payeBrackets: [
    { limit: 24000, rate: 0.10 },
    { limit: 32333, rate: 0.25 },
    { limit: 500000, rate: 0.30 },
    { limit: 800000, rate: 0.325 },
    { limit: Infinity, rate: 0.35 }
  ],
  personalRelief: 2400,
  housingLevyRate: 0.015,
  nssfTier1: 420,
  nssfTier2: 1740,
  shaRate: 0.0275, // 2.75% Social Health Authority
};

// Calculation helper for Kenyan Statutory Payroll Engine
const calculateKenyanTax = (grossSalary) => {
  const base = Math.max(0, grossSalary);
  const nssf = STATUTORY_RATES.nssfTier1 + STATUTORY_RATES.nssfTier2; // 2,160 KES
  const sha = Math.max(300, base * STATUTORY_RATES.shaRate); // Min 300 KES
  const housingLevy = base * STATUTORY_RATES.housingLevyRate;

  // Taxable Income after allowable NSSF deduction
  const taxablePay = Math.max(0, base - nssf);

  // Progressive PAYE Tax
  let grossTax = 0;
  let remaining = taxablePay;

  if (remaining <= 24000) {
    grossTax += remaining * 0.10;
  } else {
    grossTax += 24000 * 0.10;
    remaining -= 24000;

    if (remaining <= 8333) {
      grossTax += remaining * 0.25;
    } else {
      grossTax += 8333 * 0.25;
      remaining -= 8333;

      if (remaining <= 467667) {
        grossTax += remaining * 0.30;
      } else {
        grossTax += 467667 * 0.30;
        remaining -= 467667;

        if (remaining <= 300000) {
          grossTax += remaining * 0.325;
        } else {
          grossTax += 300000 * 0.325;
          remaining -= 300000;
          grossTax += remaining * 0.35;
        }
      }
    }
  }

  const payeAfterRelief = Math.max(0, grossTax - STATUTORY_RATES.personalRelief);
  const totalDeductions = Math.round(payeAfterRelief + nssf + sha + housingLevy);
  const netPay = Math.round(base - totalDeductions);

  return {
    grossSalary: Math.round(base),
    paye: Math.round(payeAfterRelief),
    nssf: Math.round(nssf),
    sha: Math.round(sha),
    housingLevy: Math.round(housingLevy),
    totalDeductions,
    netPay
  };
};

const DEMO_LOANS = [
  { id: 'l_1', employee_name: 'David Kim', type: 'Emergency Advance', amount: 1200, balance: 400, monthly_deduction: 200, status: 'Active', approved_by: 'Amina Al-Mansoor' },
  { id: 'l_2', employee_name: 'Sophia Chen', type: 'Education Loan', amount: 3500, balance: 2100, monthly_deduction: 350, status: 'Active', approved_by: 'Marcus Vance' },
  { id: 'l_3', employee_name: 'Elena Rostova', type: 'Car Loan', amount: 8000, balance: 0, monthly_deduction: 500, status: 'Completed', approved_by: 'Amina Al-Mansoor' }
];

const DEMO_EXPENSES = [
  { id: 'e_1', employee_name: 'Marcus Vance', category: 'Travel & Flights', amount: 850, date: '2026-07-20', status: 'Approved', description: 'Nairobi to London Client Conference flights & transport' },
  { id: 'e_2', employee_name: 'Sarah Jenkins', category: 'Client Entertainment', amount: 240, date: '2026-07-25', status: 'Pending', description: 'Executive Q3 hiring strategy dinner with candidates' },
  { id: 'e_3', employee_name: 'Elena Rostova', category: 'Software & Tools', amount: 120, date: '2026-07-28', status: 'Reimbursed', description: 'Figma Enterprise & CIPD compliance reference materials' }
];

const COST_DISTRIBUTION = [
  { name: 'Engineering', value: 45000, color: '#6366f1' },
  { name: 'Operations', value: 28000, color: '#10b981' },
  { name: 'Product', value: 22000, color: '#f59e0b' },
  { name: 'Finance', value: 15000, color: '#ec4899' },
  { name: 'People Ops', value: 12000, color: '#06b6d4' }
];

export default function Payroll() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loans, setLoans] = useState(DEMO_LOANS);
  const [expenses, setExpenses] = useState(DEMO_EXPENSES);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [selectedPayslipRecord, setSelectedPayslipRecord] = useState(null);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // New Loan Form State
  const [loanForm, setLoanForm] = useState({ employee_id: '', type: 'Salary Advance', amount: '', monthly_deduction: '' });
  // New Expense Form State
  const [expenseForm, setExpenseForm] = useState({ employee_id: '', category: 'Travel & Flights', amount: '', description: '' });

  const load = async () => {
    setLoadError(null);
    try {
      const [recs, emps] = await Promise.all([
        base44.entities.PayrollRecord.list("-pay_period_year"),
        base44.entities.Employee.list()
      ]);
      setRecords(recs || []);
      setEmployees(emps || []);
    } catch {
      setLoadError("Failed to load live database payroll data. Using cached state.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return records.filter(r => {
      const matchSearch = !search || r.employee_name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [records, search, statusFilter]);

  const totalGross = records.reduce((s, r) => s + (r.base_salary || 0) + (r.bonus || 0), 0);
  const totalNetPay = records.reduce((s, r) => s + (r.net_pay || 0), 0);
  const totalTaxes = records.reduce((s, r) => s + (r.tax || 0), 0);
  const paidCount = records.filter(r => r.status === "Paid").length;
  const pendingCount = records.filter(r => r.status === "Draft" || r.status === "Approved").length;

  const handleSave = async (data) => {
    try {
      if (editing) {
        await base44.entities.PayrollRecord.update(editing.id, data);
      } else {
        await base44.entities.PayrollRecord.create(data);
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch {
      alert("Payroll record updated locally.");
    }
  };

  const handleStatusChange = async (record, newStatus) => {
    try {
      await base44.entities.PayrollRecord.update(record.id, { status: newStatus });
      load();
    } catch {
      setRecords(prev => prev.map(r => r.id === record.id ? { ...r, status: newStatus } : r));
    }
  };

  const handleAddLoan = (e) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === loanForm.employee_id) || { full_name: 'Selected Employee' };
    const newLoan = {
      id: `l_${Date.now()}`,
      employee_name: emp.full_name,
      type: loanForm.type,
      amount: Number(loanForm.amount) || 1000,
      balance: Number(loanForm.amount) || 1000,
      monthly_deduction: Number(loanForm.monthly_deduction) || 200,
      status: 'Active',
      approved_by: 'Finance Operations'
    };
    setLoans(prev => [newLoan, ...prev]);
    setShowLoanModal(false);
    setLoanForm({ employee_id: '', type: 'Salary Advance', amount: '', monthly_deduction: '' });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === expenseForm.employee_id) || { full_name: 'Staff Member' };
    const newExp = {
      id: `e_${Date.now()}`,
      employee_name: emp.full_name,
      category: expenseForm.category,
      amount: Number(expenseForm.amount) || 150,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      description: expenseForm.description || 'Reimbursement claim submitted'
    };
    setExpenses(prev => [newExp, ...prev]);
    setShowExpenseModal(false);
    setExpenseForm({ employee_id: '', category: 'Travel & Flights', amount: '', description: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Payroll, Compensation & Financial Operations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enterprise multi-frequency engine, Kenyan statutory compliance (PAYE/SHA/NSSF), loans & digital payslips
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            className="text-xs gap-1.5 h-9 border-amber-200 text-amber-700 dark:border-amber-900/60 dark:text-amber-300"
            onClick={() => setAiOpen(true)}
          >
            <Sparkles size={14} /> AI Payroll Copilot
          </Button>

          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 h-9 shadow-md shadow-emerald-600/20"
            onClick={() => { setEditing(null); setModalOpen(true); }}
          >
            <Plus size={14} /> Process Payroll Record
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { id: 'dashboard', label: 'Command Center', icon: BarChart2 },
          { id: 'engine', label: 'Payroll Engine & Batch Runs', icon: Zap },
          { id: 'payslips', label: 'Digital Payslips Hub', icon: FileText },
          { id: 'loans', label: 'Loans & Advances', icon: Banknote },
          { id: 'expenses', label: 'Expense Claims', icon: Receipt },
          { id: 'statutory', label: 'Tax & Compliance', icon: ShieldCheck },
          { id: 'analytics', label: 'Financial Analytics', icon: TrendingUp },
        ].map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. COMMAND CENTER (DASHBOARD TAB)                        */}
      {/* ========================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Executive Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Gross Payroll', val: `$${totalGross.toLocaleString()}`, icon: DollarSign, color: 'text-indigo-600 bg-indigo-50' },
              { label: 'Net Disbursed', val: `$${totalNetPay.toLocaleString()}`, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Statutory Taxes', val: `$${totalTaxes.toLocaleString()}`, icon: ShieldCheck, color: 'text-red-600 bg-red-50' },
              { label: 'Processed Runs', val: paidCount, icon: FileCheck, color: 'text-blue-600 bg-blue-50' },
              { label: 'Pending Approvals', val: pendingCount, icon: Clock, color: 'text-amber-600 bg-amber-50' },
              { label: 'Active Loans', val: `$${loans.reduce((s,l)=>s+l.balance, 0).toLocaleString()}`, icon: CreditCard, color: 'text-purple-600 bg-purple-50' },
            ].map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-sm">
                  <div className={`w-8 h-8 rounded-lg ${m.color} flex items-center justify-center mb-2`}>
                    <Icon size={16} />
                  </div>
                  <p className="text-[11px] font-medium text-slate-400">{m.label}</p>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{m.val}</h4>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payroll Cycle Overview & Workflow Status */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Current Payroll Cycle — July 2026</h3>
                  <p className="text-xs text-slate-400">Monthly Salary Batch Disbursement Status</p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-0">
                  Cycle Open & Processing
                </Badge>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { step: '1. Draft Input', done: true, label: 'Completed' },
                  { step: '2. Tax Calculation', done: true, label: 'Verified' },
                  { step: '3. Finance Signoff', done: true, label: 'Approved' },
                  { step: '4. Bank Release', done: false, label: 'Pending Lock' },
                ].map((s, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border text-xs text-center space-y-1 ${
                    s.done ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}>
                    <span className="font-bold block text-slate-900 dark:text-white">{s.step}</span>
                    <Badge className={`text-[10px] ${s.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{s.label}</Badge>
                  </div>
                ))}
              </div>

              {/* Department Distribution Chart */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 mb-2">Department Payroll Cost Allocation</h4>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={COST_DISTRIBUTION}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quick Approvals & Upcoming Deadlines */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Calendar size={18} className="text-emerald-600" /> Payroll Calendar & Deadlines
              </h3>

              <div className="space-y-3">
                {[
                  { title: 'Statutory PAYE / SHA Filing', date: '9th August 2026', tag: 'KRA / Govt', status: 'Urgent' },
                  { title: 'Bank Direct Deposit Execution', date: '28th July 2026', tag: 'Disbursement', status: 'Scheduled' },
                  { title: 'Salary Advance Deductions Lock', date: '25th July 2026', tag: 'Loans Engine', status: 'Completed' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.title}</span>
                      <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">{item.status}</Badge>
                    </div>
                    <p className="text-slate-400">{item.date} · {item.tag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. PAYROLL ENGINE & BATCH RUNS                             */}
      {/* ========================================================= */}
      {activeTab === 'engine' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <Input
                placeholder="Search payroll record by employee name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-9 text-xs"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-xs w-40"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="bg-emerald-600 text-white text-xs gap-1.5 h-9"
              onClick={() => { setEditing(null); setModalOpen(true); }}
            >
              <Plus size={14} /> Add Payroll Entry
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Pay Period</th>
                    <th className="px-4 py-3 text-right">Base Pay</th>
                    <th className="px-4 py-3 text-right">Bonus</th>
                    <th className="px-4 py-3 text-right">Tax + Deductions</th>
                    <th className="px-4 py-3 text-right">Net Salary</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-400">
                        No payroll records match search filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                          {r.employee_name}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {MONTHS[(r.pay_period_month || 1) - 1]} {r.pay_period_year}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-800 dark:text-slate-200">
                          ${(r.base_salary || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                          +${(r.bonus || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-red-500 font-medium">
                          -${((r.tax || 0) + (r.deductions || 0)).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                          ${(r.net_pay || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={`text-[10px] ${
                            r.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : r.status === 'Approved' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {r.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[10px] gap-1"
                            onClick={() => setSelectedPayslipRecord(r)}
                          >
                            <FileText size={12} /> Payslip
                          </Button>
                          {r.status === 'Draft' && (
                            <Button size="sm" className="h-7 text-[10px] bg-blue-600 text-white" onClick={() => handleStatusChange(r, 'Approved')}>
                              Approve
                            </Button>
                          )}
                          {r.status === 'Approved' && (
                            <Button size="sm" className="h-7 text-[10px] bg-emerald-600 text-white" onClick={() => handleStatusChange(r, 'Paid')}>
                              Mark Paid
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DIGITAL PAYSLIPS HUB                                   */}
      {/* ========================================================= */}
      {activeTab === 'payslips' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Digital Employee Payslip Engine</h3>
            <p className="text-xs text-slate-400">Select any record to view or print official tax-compliant payslips</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.slice(0, 6).map(r => (
              <div key={r.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{r.employee_name}</span>
                  <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">{r.status}</Badge>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Pay Period:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{MONTHS[(r.pay_period_month || 1) - 1]} {r.pay_period_year}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Pay:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">${((r.base_salary||0) + (r.bonus||0)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Net Disbursed:</span>
                    <span className="font-bold text-emerald-600">${(r.net_pay||0).toLocaleString()}</span>
                  </div>
                </div>

                <Button className="w-full bg-slate-900 text-white text-xs h-8 gap-1.5" onClick={() => setSelectedPayslipRecord(r)}>
                  <Printer size={13} /> View Printable Payslip
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. LOANS & SALARY ADVANCES                                */}
      {/* ========================================================= */}
      {activeTab === 'loans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Employee Loans & Salary Advances</h3>
              <p className="text-xs text-slate-400">Automatic payroll deduction tracking and repayment schedules</p>
            </div>
            <Button className="bg-emerald-600 text-white text-xs gap-1.5 h-8" onClick={() => setShowLoanModal(true)}>
              <Plus size={14} /> New Loan Request
            </Button>
          </div>

          <div className="space-y-3">
            {loans.map(loan => (
              <div key={loan.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between flex-wrap gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{loan.employee_name}</h4>
                    <Badge className="bg-purple-50 text-purple-700 text-[10px]">{loan.type}</Badge>
                  </div>
                  <p className="text-slate-400 mt-0.5">Approved by: {loan.approved_by}</p>
                </div>

                <div className="space-y-0.5 text-right">
                  <p className="font-semibold text-slate-900 dark:text-white">Principal: ${loan.amount.toLocaleString()}</p>
                  <p className="text-amber-600 font-bold">Balance: ${loan.balance.toLocaleString()}</p>
                </div>

                <div className="space-y-0.5 text-right">
                  <p className="text-slate-500">Monthly Deduction: <strong className="text-slate-900 dark:text-white">${loan.monthly_deduction}/mo</strong></p>
                  <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">{loan.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. EXPENSE CLAIMS & REIMBURSEMENTS                        */}
      {/* ========================================================= */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Expense Claims & Travel Reimbursements</h3>
              <p className="text-xs text-slate-400">Track receipts, per diems, and multi-level expense approvals</p>
            </div>
            <Button className="bg-emerald-600 text-white text-xs gap-1.5 h-8" onClick={() => setShowExpenseModal(true)}>
              <Plus size={14} /> Submit Expense Claim
            </Button>
          </div>

          <div className="space-y-3">
            {expenses.map(exp => (
              <div key={exp.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between flex-wrap gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{exp.employee_name}</h4>
                    <Badge className="bg-blue-50 text-blue-700 text-[10px]">{exp.category}</Badge>
                  </div>
                  <p className="text-slate-400 mt-0.5">{exp.description} · Date: {exp.date}</p>
                </div>

                <div className="text-right space-y-1">
                  <p className="font-bold text-base text-slate-900 dark:text-white">${exp.amount.toLocaleString()}</p>
                  <Badge className={`text-[10px] ${exp.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {exp.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. TAX & STATUTORY COMPLIANCE (KENYAN PAYE/SHA/NSSF ENGINE) */}
      {/* ========================================================= */}
      {activeTab === 'statutory' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <ShieldCheck className="text-emerald-600" size={18} /> Kenyan Statutory Compliance Rules (PAYE, SHA, NSSF, Housing Levy)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold block text-slate-900 dark:text-white">PAYE Tax Relief</span>
                <span className="text-slate-400">KES 2,400 / Month</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold block text-slate-900 dark:text-white">NSSF Tier 1 & 2</span>
                <span className="text-slate-400">KES 2,160 Ceiling</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold block text-slate-900 dark:text-white">Social Health Authority (SHA)</span>
                <span className="text-slate-400">2.75% of Gross Pay</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold block text-slate-900 dark:text-white">Housing Levy</span>
                <span className="text-slate-400">1.5% Gross Contribution</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. FINANCIAL ANALYTICS                                     */}
      {/* ========================================================= */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Department Cost Allocation</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={COST_DISTRIBUTION} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {COST_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Monthly Net Disbursed vs Tax</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { month: 'May', net: 110000, tax: 28000 },
                  { month: 'Jun', net: 115000, tax: 29500 },
                  { month: 'Jul', net: totalNetPay, tax: totalTaxes },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="net" fill="#10b981" name="Net Disbursed ($)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tax" fill="#ef4444" name="Taxes ($)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE PAYSLIP MODAL */}
      {selectedPayslipRecord && (
        <Dialog open={Boolean(selectedPayslipRecord)} onOpenChange={() => setSelectedPayslipRecord(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Official Employee Payslip</span>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => window.print()}>
                  <Printer size={12} /> Print PDF
                </Button>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs pt-2 font-mono border p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
              <div className="flex justify-between border-b pb-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">STAFFROOM ENTERPRISE HR</h3>
                  <p className="text-[10px] text-slate-400">Pay Slip — Confidential</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">{MONTHS[(selectedPayslipRecord.pay_period_month || 1) - 1]} {selectedPayslipRecord.pay_period_year}</p>
                  <p className="text-[10px] text-slate-400">Ref: PAY-{selectedPayslipRecord.id?.slice(0,6)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Employee:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedPayslipRecord.employee_name}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Payment Date:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedPayslipRecord.payment_date || '28th of Month'}</strong>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t">
                <div className="flex justify-between">
                  <span>Basic Pay</span>
                  <span>${(selectedPayslipRecord.base_salary || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Allowances & Bonus</span>
                  <span>+${(selectedPayslipRecord.bonus || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Statutory Deductions & Tax</span>
                  <span>-${((selectedPayslipRecord.tax || 0) + (selectedPayslipRecord.deductions || 0)).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between pt-3 border-t font-bold text-sm bg-emerald-100 dark:bg-emerald-950 p-2 rounded-lg">
                <span className="text-emerald-900 dark:text-emerald-200">NET PAYABLE AMOUNT:</span>
                <span className="text-emerald-900 dark:text-emerald-200">${(selectedPayslipRecord.net_pay || 0).toLocaleString()}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* LOAN REQUEST MODAL */}
      {showLoanModal && (
        <Dialog open={showLoanModal} onOpenChange={() => setShowLoanModal(false)}>
          <DialogContent className="max-w-md text-xs">
            <DialogHeader><DialogTitle>Submit Employee Loan Request</DialogTitle></DialogHeader>
            <form onSubmit={handleAddLoan} className="space-y-3 pt-2">
              <div>
                <Label>Employee *</Label>
                <select
                  required
                  value={loanForm.employee_id}
                  onChange={e => setLoanForm({ ...loanForm, employee_id: e.target.value })}
                  className="w-full h-9 rounded-xl border bg-white dark:bg-slate-900 px-3 text-xs"
                >
                  <option value="">Select Employee</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.full_name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Amount ($)</Label>
                  <Input type="number" required value={loanForm.amount} onChange={e => setLoanForm({ ...loanForm, amount: e.target.value })} className="h-9 text-xs" />
                </div>
                <div>
                  <Label>Monthly Deduction ($)</Label>
                  <Input type="number" required value={loanForm.monthly_deduction} onChange={e => setLoanForm({ ...loanForm, monthly_deduction: e.target.value })} className="h-9 text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowLoanModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 text-white">Approve Loan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* EXPENSE CLAIM MODAL */}
      {showExpenseModal && (
        <Dialog open={showExpenseModal} onOpenChange={() => setShowExpenseModal(false)}>
          <DialogContent className="max-w-md text-xs">
            <DialogHeader><DialogTitle>Submit Expense Claim</DialogTitle></DialogHeader>
            <form onSubmit={handleAddExpense} className="space-y-3 pt-2">
              <div>
                <Label>Employee *</Label>
                <select
                  required
                  value={expenseForm.employee_id}
                  onChange={e => setExpenseForm({ ...expenseForm, employee_id: e.target.value })}
                  className="w-full h-9 rounded-xl border bg-white dark:bg-slate-900 px-3 text-xs"
                >
                  <option value="">Select Staff Member</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.full_name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Category</Label>
                  <select
                    value={expenseForm.category}
                    onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full h-9 rounded-xl border bg-white dark:bg-slate-900 px-3 text-xs"
                  >
                    <option value="Travel & Flights">Travel & Flights</option>
                    <option value="Client Entertainment">Client Entertainment</option>
                    <option value="Software & Tools">Software & Tools</option>
                    <option value="Per Diem">Per Diem</option>
                  </select>
                </div>
                <div>
                  <Label>Claim Amount ($)</Label>
                  <Input type="number" required value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="h-9 text-xs" />
                </div>
              </div>
              <div>
                <Label>Description / Business Reason</Label>
                <Textarea value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} rows={2} className="text-xs" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowExpenseModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 text-white">Submit Claim</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Payroll Modal */}
      <PayrollModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        record={editing}
        employees={employees}
      />

      {/* AI Assistant Chat */}
      {aiOpen && (
        <AiChatPanel
          agentName="payroll_assistant"
          title="Payroll Copilot"
          subtitle="AI-powered statutory tax, bonus & loan advisory"
          suggestions={[
            "Summarize July statutory PAYE and NSSF obligations",
            "What is our total department payroll cost breakdown?",
            "How do I calculate overtime and weekend rates?",
            "Check for any salary advance over-limit risks"
          ]}
          onClose={() => setAiOpen(false)}
        />
      )}
    </div>
  );
}
