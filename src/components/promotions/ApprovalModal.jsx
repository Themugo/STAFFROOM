import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, DollarSign, Star, Calendar } from "lucide-react";

export default function ApprovalModal({ open, onClose, request, onDecision }) {
  const [notes, setNotes] = useState("");
  const [reviewer, setReviewer] = useState("");

  if (!request) return null;

  const stage = request.status === "Pending HR" ? "HR" : "Finance";

  const handleDecision = (decision) => {
    onDecision(request.id, stage, decision, notes, reviewer);
    setNotes(""); setReviewer("");
  };

  const salaryDelta = (request.proposed_salary || 0) - (request.current_salary || 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${stage === "HR" ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"}`}>{stage} Review</span>
            Promotion: {request.employee_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Title Change</span>
              <span className="font-medium text-gray-800">{request.current_title} → <span className="text-indigo-700">{request.proposed_title}</span></span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Salary Change</span>
              <span className="font-medium text-emerald-700">
                ${(request.current_salary||0).toLocaleString()} → ${(request.proposed_salary||0).toLocaleString()}
                {salaryDelta > 0 && <span className="ml-1 text-xs">(+{request.salary_increase_pct}%)</span>}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1"><Star className="w-3.5 h-3.5" /> Performance</span>
              <span className="font-medium">{request.performance_rating}/5 · {request.goals_met_pct}% goals met</span>
            </div>
            {request.effective_date && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Effective</span>
                <span className="font-medium">{request.effective_date}</span>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Manager Justification</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-white border border-gray-100 rounded-xl p-3">{request.justification}</p>
          </div>

          {request.supporting_notes && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Supporting Notes</p>
              <p className="text-sm text-gray-600 italic">{request.supporting_notes}</p>
            </div>
          )}

          {/* Prior approval */}
          {request.hr_decision && stage === "Finance" && (
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-sm">
              <p className="text-xs font-semibold text-violet-700 mb-1">HR Decision: {request.hr_decision}</p>
              {request.hr_notes && <p className="text-violet-800 text-xs">{request.hr_notes}</p>}
            </div>
          )}

          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Your Name ({stage} Reviewer)</Label>
            <input className="w-full h-9 border border-gray-200 rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              value={reviewer} onChange={e => setReviewer(e.target.value)} placeholder="Your name…" />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Decision Notes</Label>
            <Textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Add any conditions, concerns, or approval notes…" />
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={() => handleDecision("Rejected")} variant="outline" className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50">
            <XCircle className="w-4 h-4" /> Reject
          </Button>
          <Button onClick={() => handleDecision("Approved")} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
            <CheckCircle2 className="w-4 h-4" /> Approve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}