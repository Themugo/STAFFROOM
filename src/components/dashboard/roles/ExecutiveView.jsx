import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Users,
  DollarSign,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building2,
  FileText,
  Activity,
  Layers
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { peopleService, payrollService, reportsService } from "@/services/domainServices";
import { createPageUrl } from "@/utils";

const FINANCIAL_TREND = [
  { month: "Jan", payroll: 118, revenue: 450 },
  { month: "Feb", payroll: 120, revenue: 480 },
  { month: "Mar", payroll: 122, revenue: 510 },
  { month: "Apr", payroll: 125, revenue: 530 },
  { month: "May", payroll: 128, revenue: 560 },
  { month: "Jun", payroll: 130, revenue: 590 },
];

export default function ExecutiveView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await reportsService.getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        setError("Unable to load executive metrics. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
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

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
        <button onClick={() => window.location.reload()} className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SECTION 1: WHAT MATTERS (KEY STRATEGIC METRICS) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
            <Activity size={14} className="text-[#2563EB]" /> What Matters (Strategic Intelligence)
          </h2>
          <span className="text-[11px] text-[#526581] font-mono">Real-time org synchronization</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                <Users size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                ↑ 12.4% YTD
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Total Active Workforce</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">{metrics?.totalEmployees || 2458}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <DollarSign size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                100% Tax Compliant
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Gross Monthly Payroll</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">KES 128.4M</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <ShieldCheck size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Optimal
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Organization Health Index</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">87 / 100</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <TrendingUp size={18} />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                +1.8% vs target
              </span>
            </div>
            <div>
              <span className="text-xs text-[#526581] font-medium block">Annual Employee Retention</span>
              <span className="text-2xl font-black text-[#102A56] dark:text-white font-mono">94.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS + WHAT NEEDS MY ATTENTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider">
              Payroll Run vs Gross Revenue Trend (KES Millions)
            </h3>
            <span className="text-[10px] font-mono text-[#526581]">Q1 - Q2 2026</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FINANCIAL_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#081B4B", borderRadius: "12px", border: "none", color: "#fff", fontSize: "11px" }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revGrad)" name="Gross Revenue" />
                <Bar dataKey="payroll" fill="#10b981" barSize={12} radius={[4, 4, 0, 0]} name="Payroll Spend" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 2: WHAT NEEDS MY ATTENTION (3 cols / 5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
              <AlertCircle size={15} className="text-rose-500" /> What Needs My Attention
            </h3>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              3 Pending
            </span>
          </div>

          <div className="space-y-2.5 font-sans text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-[#102A56] dark:text-white block">Q3 Transport Fleet Expansion (KES 14.2M)</span>
                <span className="text-[11px] text-[#526581]">Procurement Board approval required</span>
              </div>
              <Link to={createPageUrl("ApprovalCenter")} className="px-2.5 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold shrink-0">
                Review
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-[#102A56] dark:text-white block">Director of Engineering Annual Leave</span>
                <span className="text-[11px] text-[#526581]">Requested July 12 - July 26</span>
              </div>
              <Link to={createPageUrl("ApprovalCenter")} className="px-2.5 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold shrink-0">
                Approve
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E4EAF3] dark:border-slate-800 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-[#102A56] dark:text-white block">Annual Statutory Tax Audit Sign-off</span>
                <span className="text-[11px] text-[#526581]">KRA eTIMS & PAYE Reconciliation</span>
              </div>
              <Link to={createPageUrl("Reports")} className="px-2.5 py-1 rounded-lg bg-[#2563EB] text-white text-[10px] font-bold shrink-0">
                Sign
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 & 4: WHAT HAPPENED & WHAT SHOULD I DO NEXT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* What Happened (Recent Events Timeline) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-[#102A56] dark:text-white tracking-wider flex items-center gap-1.5">
              <Calendar size={15} className="text-[#2563EB]" /> What Happened Recently
            </h3>
            <Link to={createPageUrl("AuditLog")} className="text-[11px] font-bold text-[#2563EB] hover:underline">
              Audit Log →
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { title: "Q2 Executive Board Meeting Minutes Published", detail: "Approved Q3 strategic workforce hiring targets", time: "2 hours ago" },
              { title: "May 2026 Monthly Payroll Disbursed", detail: "100% automated bank transfer completed via KCB Portal", time: "1 day ago" },
              { title: "Annual HR Compliance Audit Cleared", detail: "Zero critical non-compliance flags identified", time: "2 days ago" },
            ].map((ev, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <div>
                  <strong className="text-[#102A56] dark:text-white block">{ev.title}</strong>
                  <span className="text-[11px] text-[#526581]">{ev.detail}</span>
                </div>
                <span className="text-[10px] text-[#526581] font-mono shrink-0 ml-2">{ev.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What Should I Do Next (Quick Actions + AI Strategic Prompt) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#E4EAF3] dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E4EAF3] dark:border-slate-800 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-[#102A56] dark:text-white">
                <Sparkles size={16} className="text-[#2563EB] animate-pulse" /> What Should I Do Next? (Executive AI)
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active Context
              </span>
            </div>

            <p className="text-xs text-[#526581] dark:text-slate-300 mt-3 leading-relaxed">
              Based on your organization's May data, headcount growth is tracking 4% ahead of budget with zero compliance friction.
            </p>

            <div className="mt-3 space-y-2">
              <Link
                to={createPageUrl("Reports")}
                className="w-full p-2.5 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 text-xs flex items-center justify-between group transition-all"
              >
                <span>Run Q3 Strategic Workforce Productivity Analysis</span>
                <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={createPageUrl("ApprovalCenter")}
                className="w-full p-2.5 rounded-xl bg-[#F5F8FC] dark:bg-slate-800/60 hover:bg-[#2563EB] hover:text-white text-[#102A56] dark:text-slate-200 border border-[#E4EAF3] dark:border-slate-700/60 text-xs flex items-center justify-between group transition-all"
              >
                <span>Review & Finalize Departmental Budget Allocations</span>
                <ArrowRight size={14} className="text-[#2563EB] group-hover:text-white group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E4EAF3] dark:border-slate-800 flex items-center justify-between text-[11px] text-[#526581] font-mono">
            <span>Executive Authority Level: FULL_ORG_ACCESS</span>
            <span>StaffRoom v4.2 Pro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
