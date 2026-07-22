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
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#D4A843" }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">AI Payroll Analysis</h3>
            <p className="text-xs text-gray-400">Powered by AI — instant insights</p>
          </div>
        </div>
        <Button onClick={runAnalysis} disabled={loading} size="sm"
          className="gap-1.5 text-white text-xs" style={{ background: "#0F1B2D" }}>
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {loading ? "Analyzing…" : analysis ? "Re-analyze" : "Analyze Now"}
        </Button>
      </div>

      {!analysis && !loading && (
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-5 text-center">
          <div className="flex justify-center gap-4 mb-3 text-gray-300">
            <TrendingUp className="w-6 h-6" />
            <AlertTriangle className="w-6 h-6" />
            <Lightbulb className="w-6 h-6" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Get AI-powered payroll insights</p>
          <p className="text-xs text-gray-400 mt-1">Trend analysis, risk alerts & optimization recommendations based on your live data.</p>
        </div>
      )}

      {loading && (
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-6 text-center">
          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto mb-2" />
          <p className="text-sm text-amber-700 font-medium">Analyzing your payroll data…</p>
          <p className="text-xs text-amber-500 mt-1">This takes a few seconds</p>
        </div>
      )}

      {analysis && (
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
          <ReactMarkdown
            className="prose prose-sm max-w-none text-gray-700"
            components={{
              h2: ({ children }) => (
                <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 mt-4 mb-1.5 first:mt-0">{children}</h2>
              ),
              ul: ({ children }) => <ul className="space-y-1 my-1">{children}</ul>,
              li: ({ children }) => (
                <li className="flex items-start gap-1.5 text-xs text-gray-700">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">•</span>
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              p: ({ children }) => <p className="text-xs text-gray-600 my-1">{children}</p>,
            }}
          >
            {analysis}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}