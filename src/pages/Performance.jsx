import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Search, Star, Sparkles, TrendingUp, Target } from "lucide-react";
import ReviewModal from "@/components/performance/ReviewModal";
import ReviewCard from "@/components/performance/ReviewCard";
import GoalsTab from "@/components/performance/GoalsTab";

const PERIODS = ["All","Q1 2025","Q2 2025","Q3 2025","Q4 2025","Q1 2026","Q2 2026","Q3 2026","Q4 2026"];

export default function Performance() {
  const [reviews, setReviews] = useState([]);
  const [goals, setGoals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const load = async () => {
    setLoadError(null);
    try {
      const [r, g, e] = await Promise.all([
        base44.entities.PerformanceReview.list("-review_date"),
        base44.entities.PerformanceGoal.list("-created_date"),
        base44.entities.Employee.list("full_name"),
      ]);
      setReviews(r); setGoals(g); setEmployees(e);
    } catch {
      setLoadError("Failed to load performance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      if (editing) await base44.entities.PerformanceReview.update(editing.id, data);
      else await base44.entities.PerformanceReview.create(data);
      setModalOpen(false); setEditing(null); load();
    } catch {
      alert("Failed to save review. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await base44.entities.PerformanceReview.delete(id);
      load();
    } catch {
      alert("Failed to delete review. Please try again.");
    }
  };

  const runTeamInsight = async () => {
    if (reviews.length === 0) return;
    setAiLoading(true); setAiInsight("");
    const avgRating = (reviews.reduce((s,r) => s + (r.overall_rating||0), 0) / reviews.length).toFixed(1);
    const avgGoals = (reviews.reduce((s,r) => s + (r.goals_met||0), 0) / reviews.length).toFixed(0);
    const deptAvg = reviews.reduce((acc, r) => {
      if (!acc[r.department]) acc[r.department] = [];
      acc[r.department].push(r.overall_rating || 0);
      return acc;
    }, {});
    const completedGoals = goals.filter(g => g.status === "Completed").length;
    const totalGoals = goals.length;
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this team's performance data and give 3-4 concise, actionable insights for HR leadership.

Review stats:
- Total reviews: ${reviews.length}
- Avg overall rating: ${avgRating}/5
- Avg goals met: ${avgGoals}%
- Goals completed: ${completedGoals}/${totalGoals}
- By department: ${Object.entries(deptAvg).map(([d,r]) => `${d}: ${(r.reduce((a,b)=>a+b,0)/r.length).toFixed(1)}`).join(", ")}

Focus on: top performers, underperforming areas, goal completion patterns, coaching opportunities.`
      });
      setAiInsight(res);
    } catch {
      setAiInsight("⚠ Couldn't generate insights right now. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const filtered = reviews.filter(r => {
    const matchSearch = !search || r.employee_name?.toLowerCase().includes(search.toLowerCase()) || r.department?.toLowerCase().includes(search.toLowerCase());
    const matchPeriod = periodFilter === "All" || r.review_period === periodFilter;
    return matchSearch && matchPeriod;
  });

  const avgRating = reviews.length ? (reviews.reduce((s,r) => s + (r.overall_rating||0), 0) / reviews.length).toFixed(1) : "—";
  const avgGoals = reviews.length ? Math.round(reviews.reduce((s,r) => s + (r.goals_met||0), 0) / reviews.length) : 0;
  const completedGoals = goals.filter(g => g.status === "Completed").length;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" /></div>;

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
          <h2 className="text-2xl font-bold text-gray-900">Performance Review Cycles</h2>
          <p className="text-xs text-gray-400 mt-0.5">{reviews.length} reviews · {goals.length} goals tracked</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={runTeamInsight} disabled={aiLoading || reviews.length === 0} variant="outline"
            className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50">
            <Sparkles className="w-4 h-4" /> {aiLoading ? "Analyzing…" : "AI Insights"}
          </Button>
          <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="text-white gap-2" style={{ background: "#0F1B2D" }}>
            <Plus className="w-4 h-4" /> New Review
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Avg Rating", value: `${avgRating}/5`, icon: Star, color: "#f59e0b", bg: "bg-amber-50" },
          { label: "Avg Goals Met", value: `${avgGoals}%`, icon: Target, color: "#10b981", bg: "bg-emerald-50" },
          { label: "Total Reviews", value: reviews.length, icon: TrendingUp, color: "#6366f1", bg: "bg-violet-50" },
          { label: "Goals Completed", value: `${completedGoals}/${goals.length}`, icon: Target, color: "#0ea5e9", bg: "bg-sky-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-xl font-bold text-gray-900">{value}</p></div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      {(aiInsight || aiLoading) && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 mb-2"><Sparkles className="w-3.5 h-3.5" /> AI Team Insights</p>
          {aiLoading
            ? <p className="text-xs text-amber-600">Analyzing performance data…</p>
            : <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">{aiInsight}</p>}
        </div>
      )}

      <Tabs defaultValue="reviews">
        <TabsList className="bg-gray-100 rounded-xl p-1">
          <TabsTrigger value="reviews" className="rounded-lg text-xs px-4">Reviews</TabsTrigger>
          <TabsTrigger value="goals" className="rounded-lg text-xs px-4">Quarterly Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-4 space-y-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <Input className="pl-8 h-9 text-sm" placeholder="Search employee or department…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>{PERIODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <Star className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No reviews found</p>
              <p className="text-sm mt-1">Create your first performance review to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map(r => (
                <ReviewCard key={r.id} review={r}
                  onEdit={rev => { setEditing(rev); setModalOpen(true); }}
                  onDelete={handleDelete} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="goals" className="mt-4">
          <GoalsTab goals={goals} employees={employees} onReload={load} />
        </TabsContent>
      </Tabs>

      <ReviewModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave} employees={employees} review={editing} />
    </div>
  );
}