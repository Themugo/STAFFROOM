import { useState } from "react";
import { Sparkles, RefreshCw, Lightbulb, ArrowRight, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AiInsightsCard({ aiBriefing, generatingAi, onRefresh, activeCount, attendanceRate, totalPaidPayroll }) {
  const RECOMMENDATIONS = [
    { title: "Optimize Overtime in Engineering", detail: "Overtime hours spiked 12% last week. Consider adjusting team shift coverage.", category: "Payroll Savings" },
    { title: "Recruitment Bottleneck Detected", detail: "Senior Designer role has been open for 28 days with 14 candidates stuck in stage 2.", category: "Hiring Velocity" },
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-indigo-800/50 relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 text-indigo-300 font-bold text-xs tracking-wider uppercase">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>AI Executive Briefing & Strategic Recommendations</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={generatingAi}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-800/50 hover:bg-indigo-700/60 text-indigo-200 font-bold text-xs transition-colors cursor-pointer border border-indigo-700/50 self-start sm:self-auto"
        >
          {generatingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          <span>{aiBriefing ? "Refresh Briefing" : "Generate Brief"}</span>
        </button>
      </div>

      {aiBriefing ? (
        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 space-y-2">
          <ReactMarkdown>{aiBriefing}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-xs text-indigo-200/80">
          Click "Generate Brief" to run real-time executive analysis on workforce health, payroll compliance, and attendance anomalies.
        </p>
      )}

      {/* Strategic Recommendation Cards */}
      <div className="mt-5 pt-4 border-t border-indigo-800/60 grid grid-cols-1 md:grid-cols-2 gap-3">
        {RECOMMENDATIONS.map((rec, i) => (
          <div key={i} className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-white">{rec.title}</p>
                <span className="text-[9px] uppercase font-bold text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded-md">
                  {rec.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">{rec.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
