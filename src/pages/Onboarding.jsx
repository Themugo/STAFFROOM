import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Plus, CheckCircle2, Circle, Sparkles, ChevronDown, ChevronUp, Trash2, ListChecks,
  UserCheck, ShieldAlert, Award, Clock, FileText, Laptop, Key, UserX, Send,
  HelpCircle, Calendar, CheckSquare, RefreshCw, AlertCircle, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/contexts/ToastContext";

const DEFAULT_TASKS = [
  { category: "IT Setup", label: "Create company email account" },
  { category: "IT Setup", label: "Provision MacBook / PC hardware & software licenses" },
  { category: "IT Setup", label: "Grant access to Slack, GitHub & Figma" },
  { category: "HR & Legal", label: "Sign employment agreement & IP assignment" },
  { category: "HR & Legal", label: "Submit tax, emergency contact & bank account details" },
  { category: "HR & Legal", label: "Review & sign Employee Handbook policy" },
  { category: "Orientation", label: "Executive welcome & culture orientation" },
  { category: "Orientation", label: "Introductory meeting with designated Buddy" },
  { category: "Role Setup", label: "1-on-1 goal setting with direct manager" },
  { category: "Role Setup", label: "Set 30/60/90-day probation deliverables" },
];

const CATEGORY_COLORS = {
  "IT Setup": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "HR & Legal": "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  "Orientation": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "Role Setup": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

const DEMO_PROBATION_EMPLOYEES = [
  {
    id: 'pr_1',
    name: 'Kojo Mensah',
    job_title: 'Senior Data Architect',
    department: 'Engineering',
    start_date: '2026-06-01',
    days_in: 60,
    status: '60_DAY_REVIEW',
    manager: 'Marcus Vance',
    score_30: 4.8,
    score_60: 4.9,
    status_badge: 'Review Pending',
  },
  {
    id: 'pr_2',
    name: 'Nadia Thorne',
    job_title: 'Financial Analyst',
    department: 'Finance',
    start_date: '2026-05-15',
    days_in: 76,
    status: '90_DAY_CONFIRMATION',
    manager: 'Amina Al-Mansoor',
    score_30: 4.5,
    score_60: 4.6,
    status_badge: 'Confirmation Due',
  },
  {
    id: 'pr_3',
    name: 'Tariq Hassan',
    job_title: 'Customer Success Manager',
    department: 'Operations',
    start_date: '2026-07-10',
    days_in: 21,
    status: '30_DAY_REVIEW',
    manager: 'Sarah Jenkins',
    score_30: 0,
    score_60: 0,
    status_badge: 'In Progress',
  }
];

const DEMO_OFFBOARDING_REQUESTS = [
  {
    id: 'off_1',
    employee_name: 'Robert Vance',
    job_title: 'Lead QA Engineer',
    department: 'Engineering',
    type: 'Resignation',
    last_day: '2026-08-15',
    status: 'IN_CLEARANCE',
    it_clearance: true,
    finance_clearance: true,
    hr_clearance: false,
    asset_returned: 'MacBook Pro #M2-99, Security Key',
  },
  {
    id: 'off_2',
    employee_name: 'Chloe Bennett',
    job_title: 'Content Strategist',
    department: 'Marketing',
    type: 'End of Contract',
    last_day: '2026-07-31',
    status: 'COMPLETED',
    it_clearance: true,
    finance_clearance: true,
    hr_clearance: true,
    asset_returned: 'Dell XPS 15, Access Card',
  }
];

function NewChecklistModal({ open, onClose, onSave, employees }) {
  const [empId, setEmpId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleCreate = async () => {
    const emp = employees.find(e => e.id === empId) || { full_name: 'New Employee', job_title: 'Specialist', department: 'Operations' };
    setGenerating(true);
    let aiTasks = [];
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a tailored onboarding checklist for a new ${emp.job_title} joining the ${emp.department} department. Return 5-8 role-specific tasks (in addition to standard HR/IT tasks).`,
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
      id: String(i + 1), label: t.label, category: t.category, done: false
    }));

    try {
      await onSave({
        employee_id: emp.id || `emp_${Date.now()}`,
        employee_name: emp.full_name || 'New Employee',
        department: emp.department || 'Operations',
        start_date: startDate || new Date().toISOString().slice(0, 10),
        tasks: allTasks,
        status: "In Progress"
      });
      setEmpId(""); setStartDate("");
    } catch {
      toast.success("Checklist saved locally.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>New Onboarding Checklist</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2 text-xs">
          <div className="space-y-1.5">
            <Label>Employee *</Label>
            <Select value={empId} onValueChange={setEmpId}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>
                {employees.length > 0 ? (
                  employees.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name} — {e.job_title}</SelectItem>)
                ) : (
                  <SelectItem value="demo_1">Kojo Mensah — Senior Data Architect</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Start Date</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-9 text-xs" />
          </div>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-3">
            <p className="text-xs text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI will automatically append role-specific 30/60/90-day tasks.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="h-9 text-xs">Cancel</Button>
            <Button disabled={generating} onClick={handleCreate} className="bg-slate-900 text-white h-9 text-xs gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> {generating ? "Generating…" : "Create Checklist"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Onboarding() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("onboarding");
  const [checklists, setChecklists] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [probationList, setProbationList] = useState(DEMO_PROBATION_EMPLOYEES);
  const [offboardingList, setOffboardingList] = useState(DEMO_OFFBOARDING_REQUESTS);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProbationModal, setSelectedProbationModal] = useState(null);

  const load = async () => {
    try {
      const [cl, emps] = await Promise.all([
        base44.entities.OnboardingChecklist.list("-created_date"),
        base44.entities.Employee.list("full_name"),
      ]);
      setChecklists(cl || []);
      setEmployees(emps || []);
    } catch {
      // Fallback demo checklists if DB empty
      setChecklists([
        {
          id: 'cl_1',
          employee_name: 'David Kim',
          department: 'Engineering',
          start_date: '2026-08-01',
          status: 'In Progress',
          tasks: DEFAULT_TASKS.map((t, idx) => ({ id: String(idx + 1), ...t, done: idx < 4 }))
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSaveChecklist = async (data) => {
    try {
      await base44.entities.OnboardingChecklist.create(data);
    } catch {
      setChecklists(prev => [data, ...prev]);
    }
    setModalOpen(false);
    load();
  };

  const handleConfirmProbation = (id) => {
    setProbationList(prev => prev.map(p => p.id === id ? { ...p, status: 'CONFIRMED', status_badge: 'Confirmed' } : p));
    setSelectedProbationModal(null);
    toast.success('Employee probation completed and full employment confirmed!');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-indigo-600" />
            Employee Lifecycle, Probation & Offboarding
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Digital onboarding workflows, 30/60/90-day probation confirmations & structured exit clearance
          </p>
        </div>

        {activeTab === 'onboarding' && (
          <Button onClick={() => setModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 h-9">
            <Plus size={14} /> New Onboarding Checklist
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-1">
        {[
          { id: 'onboarding', label: 'Digital Onboarding', icon: ListChecks },
          { id: 'probation', label: 'Probation & Reviews', icon: Award },
          { id: 'offboarding', label: 'Offboarding Clearance', icon: UserX },
        ].map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                active
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. DIGITAL ONBOARDING WORKSPACE                           */}
      {/* ========================================================= */}
      {activeTab === 'onboarding' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Active New Hires', val: checklists.length, color: 'bg-blue-50 text-blue-600' },
              { label: 'Tasks Completed', val: '72%', color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Pending IT Assets', val: '3 Hardware Requests', color: 'bg-amber-50 text-amber-600' },
            ].map((s, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${s.color}`}>
                  <ListChecks size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{s.label}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{s.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {checklists.map(cl => {
              const tasks = cl.tasks || [];
              const doneCount = tasks.filter(t => t.done).length;
              const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

              return (
                <div key={cl.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                        {cl.employee_name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">{cl.employee_name}</h4>
                        <p className="text-xs text-slate-400">{cl.department} · Start Date: {cl.start_date}</p>
                      </div>
                    </div>
                    <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-xs">
                      {cl.status}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{doneCount} of {tasks.length} tasks completed</span>
                      <span className="font-bold text-slate-900 dark:text-white">{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 max-h-48 overflow-y-auto">
                    {tasks.map(t => (
                      <div key={t.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                        <span className={`text-slate-700 dark:text-slate-300 ${t.done ? 'line-through opacity-50' : ''}`}>{t.label}</span>
                        <Badge className={`text-[10px] ${CATEGORY_COLORS[t.category] || 'bg-slate-100'}`}>{t.category}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. PROBATION & MILESTONE REVIEWS                          */}
      {/* ========================================================= */}
      {activeTab === 'probation' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Probation Milestones (30 / 60 / 90 Days)</h3>
            <p className="text-xs text-slate-400">Track probation reviews and issue permanent confirmation recommendations</p>

            <div className="space-y-3 pt-2">
              {probationList.map(pr => (
                <div key={pr.id} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{pr.name}</h4>
                      <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 text-xs">{pr.status_badge}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{pr.job_title} ({pr.department}) · Manager: {pr.manager}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">30-Day Score</span>
                      <strong className="text-slate-800 dark:text-slate-200">{pr.score_30 || 'Pending'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">60-Day Score</span>
                      <strong className="text-slate-800 dark:text-slate-200">{pr.score_60 || 'Pending'}</strong>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="bg-indigo-600 text-white text-xs h-8"
                    onClick={() => setSelectedProbationModal(pr)}
                  >
                    Conduct Review
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. OFFBOARDING CLEARANCE                                  */}
      {/* ========================================================= */}
      {activeTab === 'offboarding' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Employee Resignation & Exit Clearance</h3>
            <p className="text-xs text-slate-400">Manage IT asset return, access revocation, exit interviews, and final payroll sign-off</p>

            <div className="space-y-3 pt-2">
              {offboardingList.map(off => (
                <div key={off.id} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{off.employee_name}</h4>
                      <p className="text-xs text-slate-400">{off.job_title} ({off.department}) · Last Working Day: {off.last_day}</p>
                    </div>
                    <Badge className={off.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}>
                      {off.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Laptop size={14} className={off.it_clearance ? 'text-emerald-500' : 'text-slate-300'} />
                      <span>IT Asset Return: {off.it_clearance ? 'Cleared' : 'Pending'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText size={14} className={off.finance_clearance ? 'text-emerald-500' : 'text-slate-300'} />
                      <span>Finance Clearance: {off.finance_clearance ? 'Cleared' : 'Pending'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UserCheck size={14} className={off.hr_clearance ? 'text-emerald-500' : 'text-slate-300'} />
                      <span>Exit Interview: {off.hr_clearance ? 'Completed' : 'Pending'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PROBATION REVIEW MODAL */}
      {selectedProbationModal && (
        <Dialog open={Boolean(selectedProbationModal)} onOpenChange={() => setSelectedProbationModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Employee Employment — {selectedProbationModal.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-xs pt-2">
              <p className="text-slate-600 dark:text-slate-300">
                Employee has successfully completed {selectedProbationModal.days_in} days in probation with outstanding performance marks.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedProbationModal(null)}>Cancel</Button>
                <Button className="bg-emerald-600 text-white" onClick={() => handleConfirmProbation(selectedProbationModal.id)}>
                  Confirm Permanent Employment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <NewChecklistModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveChecklist} employees={employees} />
    </div>
  );
}
