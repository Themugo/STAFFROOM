import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function PayrollAnalysis({ payroll, employees }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    setAnalysis(null);

    const totalPaid = payroll.filter(p => p.status === "Paid").reduce((s, p) => s + (p.net_pay || 0), 0);
    const totalBonus = payroll.reduce((s, p) => s + (p.bonus || 0), 0);
    const totalTax = payroll.reduce((s, p) => s + (p.tax || 0), 0);
    const avgNetPay = payroll.length ? (payroll.reduce((s, p) => s + (p.net_pay || 0), 0) / payroll.length) : 0;
    const deptSalaries = employees.reduce((acc, e) => {
      if (e.department && e.base_salary) {
        if (!acc[e.department]) acc[e.department] = [];
        acc[e.department].push(e.base_salary);
      }
      return acc;
    }, {});
    const deptAvgs = Object.entries(deptSalaries).map(([dept, sals]) => ({
      dept, avg: Math.round(sals.reduce((a, b) => a + b, 0) / sals.length)
    }));

    const prompt = `You are an HR payroll analyst. Analyze the following payroll data and provide actionable insights.

Summary:
- Total paid payroll (all time): $${totalPaid.toLocaleString()}
- Average net pay per record: $${Math.round(avgNetPay).toLocaleString()}
- Total bonuses distributed: $${totalBonus.toLocaleString()}
- Total tax withheld: $${totalTax.toLocaleString()}
- Payroll records: ${payroll.length} (${payroll.filter(p => p.status === "Draft").length} drafts, ${payroll.filter(p => p.status === "Approved").length} approved, ${payroll.filter(p => p.status === "Paid").length} paid)
- Total employees: ${employees.length}

Salary by department (avg annual):
${deptAvgs.map(d => `- ${d.dept}: $${d.avg.toLocaleString()}`).join("\n")}

Provide:
1. **Key Trends** (2-3 bullet points)
2. **Risk Alerts** (any concerns: pending approvals, salary imbalances, etc.)
3. **Recommendations** (2-3 actionable suggestions to optimize payroll)

Be specific and concise. Format with markdown headings and bullets.`;

    try {
      const res = await base44.integrations.Core.InvokeLLM({ prompt });
      setAnalysis(res);
    } catch {
      setAnalysis("⚠ Couldn't generate analysis right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">AI Payroll & Expenditure Analysis</h3>
            <p className="text-xs text-slate-400">Instant intelligence & anomaly audit</p>
          </div>
        </div>
        <Button onClick={runAnalysis} disabled={loading} size="sm"
          className="gap-2 text-white text-xs bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer">
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {loading ? "Analyzing…" : analysis ? "Re-analyze" : "Analyze Now"}
        </Button>
      </div>

      {!analysis && !loading && (
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6 text-center">
          <div className="flex justify-center gap-5 mb-3 text-slate-400">
            <TrendingUp className="w-6 h-6 text-indigo-500" />
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <Lightbulb className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-sm text-slate-700 font-bold">Generate AI-Powered Operational Insights</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">Analyze expenditure patterns, flag salary discrepancies, and generate actionable recommendations.</p>
        </div>
      )}

      {loading && (
        <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 p-6 text-center">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-sm text-indigo-900 font-bold">Analyzing payroll & department datasets…</p>
          <p className="text-xs text-indigo-600 mt-1">Synthesizing trends and risk alerts</p>
        </div>
      )}

      {analysis && (
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
          <ReactMarkdown
            className="prose prose-sm max-w-none text-slate-700"
            components={{
              h2: ({ children }) => (
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mt-4 mb-2 first:mt-0">{children}</h2>
              ),
              ul: ({ children }) => <ul className="space-y-1.5 my-2">{children}</ul>,
              li: ({ children }) => (
                <li className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="text-indigo-500 font-bold mt-0.5 flex-shrink-0">•</span>
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
              p: ({ children }) => <p className="text-xs text-slate-600 my-1 leading-relaxed">{children}</p>,
            }}
          >
            {analysis}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}