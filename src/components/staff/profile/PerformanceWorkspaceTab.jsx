import { TrendingUp, Target, Award, CheckCircle2, Star, Sparkles } from "lucide-react";

export function PerformanceWorkspaceTab() {
  const goals = [
    { id: "g1", title: "Automate Employee Onboarding Workflows", target: "Q3 2026", progress: 85, status: "On Track" },
    { id: "g2", title: "Achieve 95%+ Talent Retention Rate in Engineering", target: "Annual", progress: 98, status: "Exceeding" },
    { id: "g3", title: "Roll Out Global HR Compliance Certification", target: "Q4 2026", progress: 40, status: "In Progress" },
  ];

  const reviews = [
    { id: "r1", cycle: "Annual Review 2025", rating: "4.8 / 5.0", evaluator: "Sarah Jenkins", comments: "Exceptional leadership in driving organizational culture and automated compliance." },
    { id: "r2", cycle: "Mid-Year Review 2025", rating: "4.7 / 5.0", evaluator: "Sarah Jenkins", comments: "Strong execution across remote workplace policies." },
  ];

  return (
    <div className="space-y-6">
      {/* Performance & Promotion Readiness Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Executive Talent Assessment</span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white uppercase tracking-wider">
            Promotion Ready
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <p className="text-[10px] text-indigo-300 font-bold uppercase">Overall Performance Rating</p>
            <p className="text-2xl font-black mt-0.5">4.8 / 5.0</p>
          </div>
          <div>
            <p className="text-[10px] text-indigo-300 font-bold uppercase">Competency Mastery</p>
            <p className="text-2xl font-black mt-0.5">Senior Level (Tier 4)</p>
          </div>
          <div>
            <p className="text-[10px] text-indigo-300 font-bold uppercase">Next Career Milestone</p>
            <p className="text-2xl font-black mt-0.5">Senior Director Track</p>
          </div>
        </div>
      </div>

      {/* Active Goals & OKRs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-500" />
          Active Objectives & Key Results (OKRs)
        </h3>

        <div className="space-y-3">
          {goals.map((g) => (
            <div key={g.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900 dark:text-slate-100">{g.title}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{g.progress}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${g.progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 font-semibold">
                <span>Target Deadline: {g.target}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{g.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Performance Review Records */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Performance Review History
        </h3>

        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{r.cycle}</span>
                <span className="px-2.5 py-0.5 rounded-md font-black bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  Rating: {r.rating}
                </span>
              </div>
              <p className="text-slate-500 font-medium">Evaluator: {r.evaluator}</p>
              <p className="text-slate-600 dark:text-slate-300 italic pt-1">{`"${r.comments}"`}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
