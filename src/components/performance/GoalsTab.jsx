import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Target, Pencil, Trash2, CheckCircle2, Clock, CircleDot, XCircle } from "lucide-react";
import GoalModal from "./GoalModal";

const PERIODS = ["All", "Q1 2025","Q2 2025","Q3 2025","Q4 2025","Q1 2026","Q2 2026","Q3 2026","Q4 2026"];

const STATUS_CONFIG = {
  "Not Started": { color: "bg-gray-100 text-gray-600", icon: CircleDot },
  "In Progress":  { color: "bg-blue-100 text-blue-700", icon: Clock },
  "Completed":    { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  "Cancelled":    { color: "bg-red-100 text-red-600", icon: XCircle },
};

const CAT_COLORS = {
  Performance: "bg-amber-50 text-amber-700",
  Development: "bg-purple-50 text-purple-700",
  Leadership: "bg-blue-50 text-blue-700",
  Technical: "bg-cyan-50 text-cyan-700",
  Collaboration: "bg-pink-50 text-pink-700",
};

export default function GoalsTab({ goals, employees, onReload }) {
  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState("Q2 2026");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSave = async (data) => {
    try {
      if (editing) await base44.entities.PerformanceGoal.update(editing.id, data);
      else await base44.entities.PerformanceGoal.create(data);
      setModalOpen(false); setEditing(null); onReload();
    } catch {
      // Previously unhandled: a failed save left the modal open with no
      // feedback at all — no error, but also no confirmation, so a user
      // could easily assume it worked and navigate away losing their input.
      alert("Failed to save goal. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this goal?")) return;
    try {
      await base44.entities.PerformanceGoal.delete(id);
      onReload();
    } catch {
      alert("Failed to delete goal. Please try again.");
    }
  };

  const filtered = goals.filter(g => {
    const matchSearch = !search || g.employee_name?.toLowerCase().includes(search.toLowerCase()) || g.title?.toLowerCase().includes(search.toLowerCase());
    const matchPeriod = periodFilter === "All" || g.period === periodFilter;
    return matchSearch && matchPeriod;
  });

  // Group by employee
  const byEmployee = filtered.reduce((acc, g) => {
    const key = g.employee_id;
    if (!acc[key]) acc[key] = { name: g.employee_name, department: g.department, goals: [] };
    acc[key].goals.push(g);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input className="pl-9" placeholder="Search employee or goal…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>{PERIODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setModalOpen(true); }} className="text-white gap-1.5 text-xs" style={{ background: "#0F1B2D" }}>
          <Plus className="w-3.5 h-3.5" /> Add Goal
        </Button>
      </div>

      {Object.keys(byEmployee).length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Target className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No goals found</p>
          <p className="text-sm mt-1">Add goals for employees to track quarterly progress.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.values(byEmployee).map(({ name, department, goals: empGoals }) => {
            const avg = empGoals.length ? Math.round(empGoals.reduce((s,g) => s + (g.progress||0), 0) / empGoals.length) : 0;
            return (
              <div key={name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "#0F1B2D" }}>
                      {name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{name}</p>
                      <p className="text-xs text-gray-400">{department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Avg Progress</p>
                      <p className="text-sm font-bold text-gray-800">{avg}%</p>
                    </div>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${avg}%` }} />
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {empGoals.map(g => {
                    const cfg = STATUS_CONFIG[g.status] || STATUS_CONFIG["Not Started"];
                    const StatusIcon = cfg.icon;
                    return (
                      <div key={g.id} className="px-5 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <p className="font-medium text-sm text-gray-900">{g.title}</p>
                              <Badge className={`text-xs ${CAT_COLORS[g.category] || "bg-gray-100 text-gray-600"}`}>{g.category}</Badge>
                              <Badge className={`text-xs ${cfg.color}`}><StatusIcon className="w-3 h-3 mr-0.5 inline" />{g.status}</Badge>
                            </div>
                            {g.target && <p className="text-xs text-gray-500 mb-2">Target: {g.target}</p>}
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-48">
                                <div className="h-full rounded-full transition-all" style={{ width: `${g.progress||0}%`, background: g.status === "Completed" ? "#10b981" : "#6366f1" }} />
                              </div>
                              <span className="text-xs text-gray-400">{g.progress||0}%</span>
                              {g.due_date && <span className="text-xs text-gray-400">· Due {g.due_date}</span>}
                            </div>
                            {g.manager_notes && <p className="text-xs text-gray-400 mt-1.5 italic">"{g.manager_notes}"</p>}
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-300 hover:text-gray-600"
                              onClick={() => { setEditing(g); setModalOpen(true); }}><Pencil className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-300 hover:text-red-500"
                              onClick={() => handleDelete(g.id)}><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GoalModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave} employees={employees} goal={editing} />
    </div>
  );
}