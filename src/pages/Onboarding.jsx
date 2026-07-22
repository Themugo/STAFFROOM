import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, CheckCircle2, Circle, Sparkles, ChevronDown, ChevronUp, Trash2, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_TASKS = [
  { category: "IT Setup", label: "Create company email account" },
  { category: "IT Setup", label: "Set up laptop and required software" },
  { category: "IT Setup", label: "Grant access to necessary systems" },
  { category: "HR & Legal", label: "Sign employment contract" },
  { category: "HR & Legal", label: "Complete tax forms" },
  { category: "HR & Legal", label: "Submit ID and background check documents" },
  { category: "HR & Legal", label: "Review and sign company policies" },
  { category: "Orientation", label: "Company overview and culture session" },
  { category: "Orientation", label: "Meet the team" },
  { category: "Orientation", label: "Office / remote workspace tour" },
  { category: "Role Setup", label: "Review job description and goals" },
  { category: "Role Setup", label: "Meet with direct manager" },
  { category: "Role Setup", label: "Set 30/60/90-day objectives" },
];

const CATEGORY_COLORS = {
  "IT Setup": "bg-blue-100 text-blue-700",
  "HR & Legal": "bg-purple-100 text-purple-700",
  "Orientation": "bg-emerald-100 text-emerald-700",
  "Role Setup": "bg-amber-100 text-amber-700",
};

const STATUS_COLOR = {
  "Not Started": "bg-gray-100 text-gray-500",
  "In Progress": "bg-amber-100 text-amber-700",
  "Completed": "bg-emerald-100 text-emerald-700",
};

function NewChecklistModal({ open, onClose, onSave, employees }) {
  const [empId, setEmpId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleCreate = async () => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    setGenerating(true);
    let aiTasks = [];
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a tailored onboarding checklist for a new ${emp.job_title} joining the ${emp.department} department. Return 5-8 role-specific tasks (in addition to standard HR/IT tasks). Each task should be specific and actionable.`,
        response_json_schema: {
          type: "object",
          properties: {
            tasks: { type: "array", items: { type: "object", properties: { label: { type: "string" }, category: { type: "string" } } } }
          }
        }
      });
      aiTasks = (res.tasks || []).map(t => ({ ...t, category: t.category || "Role Setup" }));
    } catch(e) {}
    const allTasks = [...DEFAULT_TASKS, ...aiTasks].map((t, i) => ({
      id: String(i + 1), label: t.label, category: t.category, done: false, due_date: ""
    }));
    const completedCount = allTasks.filter(t => t.done).length;
    const status = completedCount === 0 ? "Not Started" : completedCount === allTasks.length ? "Completed" : "In Progress";
    try {
      await onSave({
        employee_id: emp.id,
        employee_name: emp.full_name,
        department: emp.department,
        start_date: startDate,
        tasks: allTasks,
        status
      });
      setEmpId(""); setStartDate("");
    } catch {
      // Previously unhandled: the AI generation step above already had a
      // fallback, but this final save call didn't — a failure here left
      // the button stuck on "Generating…" forever with no way to retry
      // short of closing and reopening the modal.
      alert("Failed to create checklist. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>New Onboarding Checklist</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Employee *</Label>
            <Select value={empId} onValueChange={setEmpId}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name} — {e.job_title}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Start Date</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
            <p className="text-xs text-amber-700 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI will generate role-specific tasks on top of the standard checklist.</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button disabled={!empId || generating} onClick={handleCreate} className="text-white gap-2" style={{ background: "#0F1B2D" }}>
              <Sparkles className="w-4 h-4" /> {generating ? "Generating…" : "Create with AI"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChecklistCard({ checklist, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const tasks = checklist.tasks || [];
  const done = tasks.filter(t => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const toggleTask = async (taskId) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t);
    const completedCount = updatedTasks.filter(t => t.done).length;
    const status = completedCount === 0 ? "Not Started" : completedCount === updatedTasks.length ? "Completed" : "In Progress";
    await base44.entities.OnboardingChecklist.update(checklist.id, { tasks: updatedTasks, status });
    onUpdate();
  };

  const grouped = tasks.reduce((acc, t) => {
    (acc[t.category] = acc[t.category] || []).push(t);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: "#0F1B2D" }}>
            {checklist.employee_name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{checklist.employee_name}</p>
            <p className="text-xs text-gray-400">{checklist.department}{checklist.start_date ? ` · Start: ${checklist.start_date}` : ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={STATUS_COLOR[checklist.status]}>{checklist.status}</Badge>
          <button onClick={() => onDelete(checklist.id)} className="text-gray-300 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{done} of {tasks.length} tasks completed</span>
          <span className="font-semibold text-gray-600">{pct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: pct === 100 ? "#10b981" : "#D4A843" }} />
        </div>
      </div>

      <button onClick={() => setExpanded(e => !e)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors mb-2">
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? "Hide tasks" : "View tasks"}
      </button>

      {expanded && (
        <div className="space-y-4 mt-2">
          {Object.entries(grouped).map(([cat, catTasks]) => (
            <div key={cat}>
              <p className={cn("text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2", CATEGORY_COLORS[cat] || "bg-gray-100 text-gray-600")}>{cat}</p>
              <div className="space-y-1.5">
                {catTasks.map(task => (
                  <button key={task.id} onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-2.5 w-full text-left group">
                    {task.done
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      : <Circle className="w-4 h-4 text-gray-300 group-hover:text-gray-400 flex-shrink-0 transition-colors" />}
                    <span className={cn("text-sm transition-colors", task.done ? "line-through text-gray-300" : "text-gray-700 group-hover:text-gray-900")}>{task.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Onboarding() {
  const [checklists, setChecklists] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    setLoadError(null);
    try {
      const [cl, emps] = await Promise.all([
        base44.entities.OnboardingChecklist.list("-created_date"),
        base44.entities.Employee.list("full_name"),
      ]);
      setChecklists(cl); setEmployees(emps);
    } catch {
      setLoadError("Failed to load onboarding data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      await base44.entities.OnboardingChecklist.create(data);
      setModalOpen(false); load();
    } catch {
      // Re-throw so NewChecklistModal's handleCreate catch block (which
      // resets its own `generating` state and shows the error) handles this
      // too, instead of two separate, disconnected failure paths.
      throw new Error("Failed to save checklist");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this checklist?")) return;
    try {
      await base44.entities.OnboardingChecklist.delete(id);
      load();
    } catch {
      alert("Failed to delete checklist. Please try again.");
    }
  };

  const completed = checklists.filter(c => c.status === "Completed").length;
  const inProgress = checklists.filter(c => c.status === "In Progress").length;

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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Onboarding Checklists</h2>
          <p className="text-xs text-gray-400 mt-0.5">{checklists.length} total · {inProgress} in progress · {completed} completed</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="text-white gap-2" style={{ background: "#0F1B2D" }}>
          <Plus className="w-4 h-4" /> New Checklist
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total", value: checklists.length, color: "bg-blue-50 text-blue-600" },
          { label: "In Progress", value: inProgress, color: "bg-amber-50 text-amber-600" },
          { label: "Completed", value: completed, color: "bg-emerald-50 text-emerald-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", s.color)}>
              <ListChecks className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {checklists.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <ListChecks className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No onboarding checklists yet</p>
          <p className="text-sm mt-1">Create one for your newest team member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {checklists.map(cl => (
            <ChecklistCard key={cl.id} checklist={cl} onUpdate={load} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <NewChecklistModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} employees={employees} />
    </div>
  );
}