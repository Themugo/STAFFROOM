import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, RefreshCw, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function LeaveInsights({ requests, employees }) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true); setInsight("");

    const total = requests.length;
    const pending = requests.filter(r => r.status === "Pending").length;
    const approved = requests.filter(r => r.status === "Approved").length;
    const rejected = requests.filter(r => r.status === "Rejected").length;

    const byType = requests.reduce((acc, r) => { acc[r.leave_type] = (acc[r.leave_type] || 0) + 1; return acc; }, {});
    const byDept = requests.reduce((acc, r) => { if (r.department) acc[r.department] = (acc[r.department] || 0) + 1; return acc; }, {});
    const avgDays = total ? (requests.reduce((s, r) => s + (r.days_requested || 0), 0) / total).toFixed(1) : 0;

    const highAbsence = employees.filter(emp => {
      const empReqs = requests.filter(r => r.employee_id === emp.id && r.status === "Approved");
      return empReqs.reduce((s, r) => s + (r.days_requested || 0), 0) > 15;
    }).map(e => e.full_name);

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an HR analytics expert. Analyze this company's leave management data and provide strategic insights.

Leave Statistics:
- Total requests: ${total} (${pending} pending, ${approved} approved, ${rejected} rejected)
- Average days per request: ${avgDays}
- By leave type: ${Object.entries(byType).map(([t, c]) => `${t}: ${c}`).join(", ")}
- By department: ${Object.entries(byDept).map(([d, c]) => `${d}: ${c}`).join(", ")}
- High absence employees (>15 days): ${highAbsence.length > 0 ? highAbsence.join(", ") : "None"}

Provide:
## Key Patterns
- 2-3 bullet points about leave usage trends

## Risk Alerts
- Any employees or departments showing concerning patterns

## Policy Recommendations
- 2-3 actionable recommendations for leave policy improvements

Be concise, specific, and data-driven.`
      });
      setInsight(res);
    } catch {
      setInsight("⚠ Couldn't generate insights right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const byDept = requests.reduce((acc, r) => { if (r.department) acc[r.department] = (acc[r.department] || 0) + 1; return acc; }, {});
  const totalDays = requests.filter(r => r.status === "Approved").reduce((s, r) => s + (r.days_requested || 0), 0);

  return (
    <div className="space-y-4">
      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Pending Review</p>
            <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === "Pending").length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Days Approved</p>
            <p className="text-2xl font-bold text-gray-900">{totalDays}</p>
          </div>
        </div>
      </div>

      {/* Department breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Leave by Department</h3>
        <div className="space-y-2">
          {Object.entries(byDept).sort((a,b) => b[1]-a[1]).map(([dept, count]) => (
            <div key={dept}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">{dept}</span>
                <span className="font-semibold text-gray-700">{count}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-blue-400" style={{ width: `${(count / requests.length) * 100}%` }} />
              </div>
            </div>
          ))}
          {Object.keys(byDept).length === 0 && <p className="text-sm text-gray-400">No data available</p>}
        </div>
      </div>

      {/* AI Analysis */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">AI Leave Analysis</p>
              <p className="text-xs text-gray-400">Patterns, risks & policy recommendations</p>
            </div>
          </div>
          <Button onClick={analyze} disabled={loading || requests.length === 0} size="sm"
            className="gap-1.5 text-white text-xs" style={{ background: "#0F1B2D" }}>
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {loading ? "Analyzing…" : insight ? "Re-analyze" : "Analyze Now"}
          </Button>
        </div>

        {!insight && !loading && (
          <div className="text-center py-8 text-gray-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Click Analyze Now to get AI-powered leave insights</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin mr-2" />
            <p className="text-sm text-gray-500">Analyzing leave patterns…</p>
          </div>
        )}

        {insight && !loading && (
          <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
            <ReactMarkdown
              className="prose prose-sm max-w-none"
              components={{
                h2: ({ children }) => <h2 className="text-xs font-bold uppercase tracking-wide text-amber-700 mt-3 mb-1.5 first:mt-0">{children}</h2>,
                ul: ({ children }) => <ul className="space-y-1 my-1">{children}</ul>,
                li: ({ children }) => <li className="flex items-start gap-1.5 text-xs text-amber-900"><span className="text-amber-400 mt-0.5">•</span><span>{children}</span></li>,
                strong: ({ children }) => <strong className="font-semibold text-amber-900">{children}</strong>,
                p: ({ children }) => <p className="text-xs text-amber-800 my-1 leading-relaxed">{children}</p>,
              }}
            >
              {insight}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}