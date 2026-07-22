import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const PERIODS = ["Q1 2025","Q2 2025","Q3 2025","Q4 2025","Q1 2026","Q2 2026","Q3 2026","Q4 2026"];

export function StarRating({ value, onChange, size = "w-5 h-5" }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange && onChange(n)}>
          <Star className={cn(size, "transition-colors", n <= value ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
        </button>
      ))}
    </div>
  );
}

const BLANK = {
  employee_id: "", review_period: "Q2 2026",
  review_date: new Date().toISOString().split("T")[0],
  overall_rating: 3, goals_met: 80,
  strengths: "", improvements: "", goals_next_period: "",
  self_assessment: "", manager_feedback: "",
  status: "Draft", reviewer_name: "", ai_summary: ""
};

export default function ReviewModal({ open, onClose, onSave, employees, review }) {
  const [form, setForm] = useState(BLANK);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    setForm(review ? { ...BLANK, ...review } : BLANK);
  }, [review, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const emp = employees.find(e => e.id === form.employee_id);

  const generateAiSummary = async () => {
    if (!emp) return;
    setGenerating(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Write a professional performance review summary for HR records.

Employee: ${emp.full_name} (${emp.job_title}, ${emp.department})
Period: ${form.review_period}
Overall rating: ${form.overall_rating}/5
Goals met: ${form.goals_met}%
Strengths: ${form.strengths || "Not provided"}
Areas for improvement: ${form.improvements || "Not provided"}
Goals next period: ${form.goals_next_period || "Not provided"}
Self-assessment: ${form.self_assessment || "Not provided"}
Manager feedback: ${form.manager_feedback || "Not provided"}

Write a concise 2-3 paragraph professional HR summary. Be balanced, specific and constructive. Start directly with the summary, no preamble.`
      });
      set("ai_summary", res);
    } catch {
      set("ai_summary", "⚠ Couldn't generate a summary right now. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, employee_name: emp?.full_name || "", department: emp?.department || "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{review ? "Edit Review" : "New Performance Review"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Employee *</Label>
              <Select value={form.employee_id} onValueChange={v => set("employee_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name} — {e.job_title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Review Period</Label>
              <Select value={form.review_period} onValueChange={v => set("review_period", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PERIODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Review Date</Label>
              <Input type="date" value={form.review_date} onChange={e => set("review_date", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Overall Rating</Label>
              <StarRating value={form.overall_rating} onChange={v => set("overall_rating", v)} />
            </div>
            <div className="space-y-1.5">
              <Label>Goals Met: {form.goals_met}%</Label>
              <input type="range" min={0} max={100} value={form.goals_met}
                onChange={e => set("goals_met", parseInt(e.target.value))}
                className="w-full accent-amber-400" />
            </div>
          </div>

          <Tabs defaultValue="manager">
            <TabsList className="bg-gray-100 rounded-xl p-1 w-full">
              <TabsTrigger value="manager" className="flex-1 rounded-lg text-xs">Manager</TabsTrigger>
              <TabsTrigger value="self" className="flex-1 rounded-lg text-xs">Self-Assessment</TabsTrigger>
              <TabsTrigger value="ai" className="flex-1 rounded-lg text-xs">AI Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="manager" className="space-y-3 mt-3">
              <div className="space-y-1.5">
                <Label>Strengths</Label>
                <Textarea value={form.strengths} onChange={e => set("strengths", e.target.value)} rows={2} placeholder="Key achievements and strengths observed this period..." />
              </div>
              <div className="space-y-1.5">
                <Label>Areas for Improvement</Label>
                <Textarea value={form.improvements} onChange={e => set("improvements", e.target.value)} rows={2} placeholder="Areas where growth is needed..." />
              </div>
              <div className="space-y-1.5">
                <Label>Goals for Next Period</Label>
                <Textarea value={form.goals_next_period} onChange={e => set("goals_next_period", e.target.value)} rows={2} placeholder="Objectives and targets for the next review period..." />
              </div>
              <div className="space-y-1.5">
                <Label>Manager Feedback</Label>
                <Textarea value={form.manager_feedback} onChange={e => set("manager_feedback", e.target.value)} rows={2} placeholder="Direct feedback from the manager to the employee..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Reviewer Name</Label>
                  <Input value={form.reviewer_name} onChange={e => set("reviewer_name", e.target.value)} placeholder="Manager name" />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => set("status", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="self" className="mt-3">
              <div className="space-y-1.5">
                <Label>Self-Assessment</Label>
                <Textarea
                  value={form.self_assessment}
                  onChange={e => set("self_assessment", e.target.value)}
                  rows={6}
                  placeholder="Employee's self-assessment: accomplishments, challenges, goals achieved, reflections on growth this period..."
                />
                <p className="text-xs text-gray-400">Written by the employee themselves or filled in by HR on their behalf.</p>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="mt-3">
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Summary for HR
                  </p>
                  <Button type="button" size="sm" onClick={generateAiSummary}
                    disabled={generating || !form.employee_id}
                    className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white">
                    {generating ? "Generating…" : "Generate Summary"}
                  </Button>
                </div>
                {form.ai_summary ? (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-900 leading-relaxed whitespace-pre-wrap">{form.ai_summary}</p>
                    <Textarea value={form.ai_summary} onChange={e => set("ai_summary", e.target.value)} rows={4} className="text-xs bg-white/70" />
                  </div>
                ) : (
                  <p className="text-xs text-amber-600">Fill in manager feedback and self-assessment, then generate a professional HR summary using AI.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="text-white" style={{ background: "#0F1B2D" }}>
              {review ? "Save Changes" : "Create Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}