import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Calendar, User, Clock } from "lucide-react";
import { computeLiveBalance, resolveAccrualRule } from "@/utils/leaveBalance";

const TYPE_COLORS = {
  Annual: "bg-blue-50 text-blue-700 border-blue-200",
  Sick: "bg-red-50 text-red-700 border-red-200",
  Unpaid: "bg-gray-100 text-gray-600 border-gray-200",
  Maternity: "bg-pink-50 text-pink-700 border-pink-200",
  Paternity: "bg-violet-50 text-violet-700 border-violet-200",
  Compassionate: "bg-amber-50 text-amber-700 border-amber-200",
  Study: "bg-teal-50 text-teal-700 border-teal-200",
};

export default function ReviewModal({ open, onClose, request, onDecision, balances, policies, employees, requests, accrualRules }) {
  const [notes, setNotes] = useState("");

  if (!request) return null;

  // Compute balance live from the current policy + approved/pending requests,
  // rather than trusting the stored LeaveBalance.entitled value (which is only
  // as fresh as the last "Recalculate Accruals" run and can be stale or 0
  // if that has never been run for this employee/year).
  const employee = employees?.find(e => e.id === request.employee_id);
  const policy = policies?.find(p => p.leave_type === request.leave_type);
  const matchingRule = resolveAccrualRule(accrualRules, request.leave_type, employee);
  // A leave type can be configured purely via an Accrual Config rule with no
  // corresponding LeavePolicy row. computeEntitled only needs policy.leave_type
  // to look the rule up, so fall back to a minimal stand-in rather than
  // silently showing "no policy configured" when a rule actually applies.
  const effectivePolicy = policy || (matchingRule ? { leave_type: request.leave_type, is_enabled: true } : null);
  const storedBalance = balances
    ?.find(b => b.employee_id === request.employee_id)
    ?.balances?.find(b => b.leave_type === request.leave_type);

  const live = effectivePolicy
    ? computeLiveBalance({ policy: effectivePolicy, employee, requests, storedBalance, accrualRules })
    : null;

  // typeBalance kept for display shape compatibility below
  const typeBalance = live ? { entitled: live.entitled, used: live.used, carried_over: live.carried } : null;
  const remaining = live ? live.remaining : null;

  const handleDecision = (status) => {
    onDecision(request.id, status, notes, request);
    setNotes("");
    onClose();
  };

  const daysAfter = remaining !== null && Number.isFinite(remaining) ? remaining - (request.days_requested || 0) : null;
  const isUnlimited = live?.isUnlimited;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Review Leave Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          {/* Request details */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-1"><User className="w-3 h-3" /> Employee</span>
              <span className="font-medium text-gray-900">{request.employee_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Department</span>
              <span className="text-gray-700">{request.department || "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Leave Type</span>
              <Badge className={`text-xs border ${TYPE_COLORS[request.leave_type] || ""}`}>{request.leave_type}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Period</span>
              <span className="text-gray-700 text-xs">{request.start_date} → {request.end_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Days Requested</span>
              <span className="font-semibold text-gray-900">{request.days_requested}</span>
            </div>
            {request.reason && (
              <div>
                <span className="text-gray-500 block mb-1">Reason</span>
                <p className="text-gray-700 bg-white rounded-lg p-2 border border-gray-100 text-xs">{request.reason}</p>
              </div>
            )}
          </div>

          {/* Balance summary */}
          {typeBalance && isUnlimited && (
            <div className="rounded-xl border p-3 text-sm bg-indigo-50 border-indigo-200">
              <p className="text-xs font-medium text-indigo-700">{request.leave_type} is an unlimited leave type — no balance cap applies.</p>
            </div>
          )}
          {typeBalance && !isUnlimited && (
            <div className={`rounded-xl border p-3 text-sm ${daysAfter !== null && daysAfter < 0 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}>
              <p className="text-xs font-medium mb-1.5 text-gray-600">{request.leave_type} Balance for {request.employee_name}</p>
              <div className="flex items-center gap-4 text-xs">
                <div><span className="text-gray-500">Entitled</span><br /><span className="font-semibold text-gray-900">{(typeBalance.entitled + (typeBalance.carried_over || 0)).toFixed(1)}d</span></div>
                <div><span className="text-gray-500">Used</span><br /><span className="font-semibold text-gray-900">{typeBalance.used || 0}d</span></div>
                <div><span className="text-gray-500">Remaining</span><br /><span className="font-semibold text-gray-900">{remaining.toFixed(1)}d</span></div>
                <div>
                  <span className="text-gray-500">After Approval</span><br />
                  <span className={`font-semibold ${daysAfter < 0 ? "text-red-600" : "text-emerald-600"}`}>{daysAfter.toFixed(1)}d</span>
                </div>
              </div>
              {daysAfter < 0 && (
                <p className="text-xs text-red-600 mt-1.5 font-medium">⚠ Approval would exceed available balance</p>
              )}
            </div>
          )}
          {!typeBalance && (
            <div className="rounded-xl border p-3 text-sm bg-gray-50 border-gray-200 text-gray-500">
              No leave policy configured for "{request.leave_type}" — balance cannot be checked.
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>Manager Notes (optional)</Label>
            <Textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add a comment for the employee…"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white gap-1"
              onClick={() => handleDecision("Rejected")}
            >
              <XCircle className="w-4 h-4" /> Reject
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
              onClick={() => handleDecision("Approved")}
            >
              <CheckCircle2 className="w-4 h-4" /> Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}