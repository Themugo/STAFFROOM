import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  FileText,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  PieChart,
  ArrowRight,
  ShieldCheck,
  Building2,
  Receipt
} from "lucide-react";
import { payrollService, financeService } from "@/services/domainServices";
import { createPageUrl } from "@/utils";

export default function FinanceView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    async function loadFinanceData() {
      try {
        setLoading(true);
        const records = await payrollService.getPayrollRecords();
        setPayrolls(records || []);
      } catch (err) {
        setError("Unable to load finance dashboard records.");
      } finally {
        setLoading(false);
      }
    }
    loadFinanceData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* WHAT MATTERS (FINANCE & PAYROLL METRICS) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
            <DollarSign size={14} className="text-[#2563EB]" /> What Matters (Finance & Payroll KPIs)
          </h2>
          <span className="text-[11px] text-[#526581]">May 2026 Accounting Period</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <DollarSign size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Disbursed
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Monthly Payroll Spend</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">KES 128.4M</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                <ShieldCheck size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Due Jun 9
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Statutory Taxes (PAYE/NSSF)</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">KES 24.1M</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Receipt size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                14 Items
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Pending Expense Claims</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">KES 1.8M</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <PieChart size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Under Budget
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Departmental Budget Variance</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">-1.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT NEEDS ATTENTION + WHAT HAPPENED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
              <AlertCircle size={15} className="text-[#2563EB]" /> What Needs My Attention
            </h3>
            <Link to={createPageUrl("Payroll")} className="text-[11px] font-bold text-[#2563EB] hover:underline">
              Payroll Center →
            </Link>
          </div>

          <div className="space-y-2.5 font-sans text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">14 Staff Reimbursement Claims</strong>
                <span className="text-[11px] text-[#526581]">Travel & Subsistence Receipts attached</span>
              </div>
              <Link to={createPageUrl("Expenses")} className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold">
                Review Claims
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">KCB Bank Statement Reconciliation</strong>
                <span className="text-[11px] text-[#526581]">May 2026 Batch EFT Verification</span>
              </div>
              <Link to={createPageUrl("Payroll")} className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold">
                Verify
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider">
              What Happened Recently
            </h3>
            <span className="text-[10px] text-[#526581] font-mono">Financial Log</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Disbursed KES 128.4M Payroll for May 2026</strong>
                <span className="text-[11px] text-[#526581]">Automated payslips delivered to 2,458 staff</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">Yesterday</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <strong className="text-[#102A56] dark:text-white block">Submitted KRA eTIMS Tax Returns</strong>
                <span className="text-[11px] text-[#526581]">Acknowledgment ref #KRA-2026-0842</span>
              </div>
              <span className="text-[10px] text-[#526581] font-mono">3 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT SHOULD I DO NEXT */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#102A56] dark:text-white">
          What Should I Do Next? (Financial Workflows)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <Link
            to={createPageUrl("Payroll")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold group transition-all"
          >
            <span>Run Next Payroll Cycle</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={createPageUrl("Expenses")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold group transition-all"
          >
            <span>Batch Process Staff Claims</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={createPageUrl("Reports")}
            className="p-3 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 flex items-center justify-between font-semibold group transition-all"
          >
            <span>Export Statutory Returns (Form P9)</span>
            <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
