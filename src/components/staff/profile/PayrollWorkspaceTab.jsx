import { DollarSign, Download, ShieldCheck, FileSpreadsheet, TrendingUp, CreditCard } from "lucide-react";

export function PayrollWorkspaceTab({ employee, payrollRecords = [] }) {
  const baseSalary = employee?.base_salary || 95000;
  const monthlyGross = Math.round(baseSalary / 12);
  const monthlyTax = Math.round(monthlyGross * 0.22);
  const monthlyBenefits = 350;
  const monthlyNet = monthlyGross - monthlyTax - monthlyBenefits;

  const handleDownloadPayslip = (period) => {
    alert(`Downloading Official Payslip for ${period}...`);
  };

  return (
    <div className="space-y-6">
      {/* Compensation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Annual Base Salary</p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">${baseSalary.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">+8.5% Revision in Jan 2026</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Monthly Gross</p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">${monthlyGross.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Base pay rate</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Est. Tax & Deductions</p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">-${(monthlyTax + monthlyBenefits).toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Federal + Health Insurance</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Monthly Net Pay</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">${monthlyNet.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Direct Deposit Active</p>
        </div>
      </div>

      {/* Payslips Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
          Payslip History & Tax Statements
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Pay Period</th>
                <th className="py-2.5 px-3">Payment Date</th>
                <th className="py-2.5 px-3">Gross Pay</th>
                <th className="py-2.5 px-3">Deductions</th>
                <th className="py-2.5 px-3">Net Pay</th>
                <th className="py-2.5 px-3 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {["July 2026", "June 2026", "May 2026", "April 2026", "March 2026"].map((period, idx) => (
                <tr key={period} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{period}</td>
                  <td className="py-3 px-3 text-slate-500">{`2026-0${7 - idx}-28`}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">${monthlyGross.toLocaleString()}</td>
                  <td className="py-3 px-3 font-semibold text-rose-500">-${(monthlyTax + monthlyBenefits).toLocaleString()}</td>
                  <td className="py-3 px-3 font-extrabold text-emerald-600 dark:text-emerald-400">${monthlyNet.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDownloadPayslip(period)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-200 hover:text-indigo-600 font-bold transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
