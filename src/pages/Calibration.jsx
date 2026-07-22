import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, TrendingUp, TrendingDown, Users, BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import RatingDistributionChart from "@/components/calibration/RatingDistributionChart";
import DepartmentHeatmap from "@/components/calibration/DepartmentHeatmap";
import PerformerTable from "@/components/calibration/PerformerTable";

const PERIODS = ["All","Q1 2025","Q2 2025","Q3 2025","Q4 2025","Q1 2026","Q2 2026","Q3 2026","Q4 2026"];

export default function Calibration() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [period, setPeriod] = useState("All");
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const load = () => {
    setLoadError(null);
    base44.entities.PerformanceReview.list("-review_date").then(r => {
      setReviews(r);
    }).catch(() => {
      setLoadError("Failed to load review data. Please try again.");
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const filtered = period === "All" ? reviews : reviews.filter(r => r.review_period === period);

  // Department aggregates
  const deptMap = filtered.reduce((acc, r) => {
    const d = r.department || "Unknown";
    if (!acc[d]) acc[d] = { dept: d, ratings: [], goalsMet: [], count: 0 };
    acc[d].ratings.push(r.overall_rating || 0);
    acc[d].goalsMet.push(r.goals_met || 0);
    acc[d].count++;
    return acc;
  }, {});

  const deptData = Object.values(deptMap).map(d => ({
    dept: d.dept,
    count: d.count,
    avgRating: parseFloat((d.ratings.reduce((a,b) => a+b, 0) / d.count).toFixed(2)),
    avgGoals: Math.round(d.goalsMet.reduce((a,b) => a+b, 0) / d.count),
    minRating: Math.min(...d.ratings),
    maxRating: Math.max(...d.ratings),
    rating1: d.ratings.filter(r => r >= 1 && r < 2).length,
    rating2: d.ratings.filter(r => r >= 2 && r < 3).length,
    rating3: d.ratings.filter(r => r >= 3 && r < 4).length,
    rating4: d.ratings.filter(r => r >= 4 && r < 5).length,
    rating5: d.ratings.filter(r => r === 5).length,
  })).sort((a,b) => b.avgRating - a.avgRating);

  // Rating distribution buckets
  const buckets = [1,2,3,4,5].map(n => ({
    rating: `${n}★`,
    count: filtered.filter(r => Math.round(r.overall_rating) === n).length,
    label: ["Poor","Below Avg","Average","Good","Excellent"][n-1]
  }));

  // High/low performers
  const topPerformers = [...filtered].sort((a,b) => (b.overall_rating||0) - (a.overall_rating||0)).slice(0,5);
  const lowPerformers = [...filtered].sort((a,b) => (a.overall_rating||0) - (b.overall_rating||0)).slice(0,5);

  // Bias flags: departments where EVERY review is ≥4 or EVERY review is ≤2
  // (i.e. a manager giving suspiciously uniform high/low ratings), with a
  // minimum sample size so one enthusiastic (or harsh) review in a small
  // department doesn't get flagged as "bias" on its own. Previously this
  // checked the department *average* against the same 4.5/1.5 thresholds,
  // which doesn't match what the label/comment claims ("all reviews ≥4 or
  // all ≤2") and could flag a single 5-star review in a 1-person department
  // as a bias pattern, or miss a real uniform-rating department whose
  // average happened to land at, say, 4.3 instead of 4.5+.
  const MIN_REVIEWS_FOR_BIAS_FLAG = 3;
  const biasFlags = deptData.filter(d =>
    d.count >= MIN_REVIEWS_FOR_BIAS_FLAG && (d.minRating >= 4 || d.maxRating <= 2)
  );

  const runInsight = async () => {
    if (!filtered.length) return;
    setAiLoading(true); setAiInsight("");
    const deptSummary = deptData.map(d => `${d.dept}: avg ${d.avgRating}/5, ${d.count} reviews, ${d.avgGoals}% goals met`).join("; ");
    const ratingDist = buckets.map(b => `${b.label}: ${b.count}`).join(", ");
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an HR analytics expert. Analyze this calibration data and identify: 1) potential rating biases, 2) departments needing coaching, 3) calibration consistency issues, 4) standout performers. Be specific and actionable.

Period: ${period}
Total reviews: ${filtered.length}
Rating distribution: ${ratingDist}
Department averages: ${deptSummary}

Respond in 4 concise bullet points for leadership.`
      });
      setAiInsight(res);
    } catch {
      setAiInsight("⚠ Couldn't generate insights right now. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const overallAvg = filtered.length ? (filtered.reduce((s,r) => s + (r.overall_rating||0), 0) / filtered.length).toFixed(2) : "—";
  const spread = deptData.length > 1 ? (Math.max(...deptData.map(d=>d.avgRating)) - Math.min(...deptData.map(d=>d.avgRating))).toFixed(2) : "—";

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
          <h2 className="text-2xl font-bold text-gray-900">Calibration Dashboard</h2>
          <p className="text-xs text-gray-400 mt-0.5">Rating distribution & bias detection across departments</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>{PERIODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <Button onClick={runInsight} disabled={aiLoading || !filtered.length} variant="outline"
            className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 h-9">
            <Sparkles className="w-4 h-4" /> {aiLoading ? "Analyzing…" : "AI Calibration Insights"}
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Reviews Analyzed", value: filtered.length, icon: BarChart3, color: "#6366f1", bg: "bg-violet-50" },
          { label: "Overall Avg Rating", value: `${overallAvg}/5`, icon: TrendingUp, color: "#10b981", bg: "bg-emerald-50" },
          { label: "Dept Rating Spread", value: spread !== "—" ? `${spread} pts` : "—", icon: Users, color: "#f59e0b", bg: "bg-amber-50" },
          { label: "Bias Flags", value: biasFlags.length, icon: AlertTriangle, color: biasFlags.length > 0 ? "#ef4444" : "#10b981", bg: biasFlags.length > 0 ? "bg-red-50" : "bg-emerald-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-xl font-bold text-gray-900">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Bias warnings */}
      {biasFlags.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800 mb-1">Calibration Flags Detected</p>
            <p className="text-xs text-red-700">
              {biasFlags.map(d => `${d.dept} (avg ${d.avgRating}/5)`).join(" · ")} — unusually high or low averages may indicate rating bias.
            </p>
          </div>
        </div>
      )}

      {/* AI Insight */}
      {(aiInsight || aiLoading) && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Calibration Analysis
          </p>
          {aiLoading
            ? <p className="text-xs text-amber-600 animate-pulse">Analyzing distribution data…</p>
            : <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">{aiInsight}</p>}
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RatingDistributionChart buckets={buckets} />
        <DepartmentHeatmap deptData={deptData} />
      </div>

      {/* Dept avg rating bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Average Rating by Department</h3>
        {deptData.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No data for selected period.</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={deptData} layout="vertical" margin={{ left: 20, right: 30, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
              <XAxis type="number" domain={[0,5]} tickCount={6} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="dept" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v) => [`${v}/5`, "Avg Rating"]} />
              <Bar dataKey="avgRating" radius={[0,6,6,0]} maxBarSize={22}>
                {deptData.map((d, i) => (
                  <Cell key={i} fill={d.avgRating >= 4 ? "#10b981" : d.avgRating >= 3 ? "#6366f1" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        {/* legend */}
        <div className="flex gap-4 mt-3 justify-center">
          {[["#10b981","≥ 4.0 Strong"],["#6366f1","3.0–3.9 Average"],["#ef4444","< 3.0 At-Risk"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: c }} />{l}
            </div>
          ))}
        </div>
      </div>

      {/* High / Low performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformerTable title="Top Performers" icon={TrendingUp} iconColor="#10b981" performers={topPerformers} type="top" />
        <PerformerTable title="Needs Attention" icon={TrendingDown} iconColor="#ef4444" performers={lowPerformers} type="low" />
      </div>
    </div>
  );
}