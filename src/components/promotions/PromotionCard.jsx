import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, DollarSign, Pencil, Trash2, Clock } from "lucide-react";

const STATUS_STYLES = {
  Draft:           "bg-gray-100 text-gray-600",
  "Pending HR":    "bg-violet-100 text-violet-700",
  "Pending Finance": "bg-amber-100 text-amber-700",
  Approved:        "bg-emerald-100 text-emerald-700",
  Rejected:        "bg-red-100 text-red-600",
};

const WORKFLOW_STEPS = ["Draft", "Pending HR", "Pending Finance", "Approved"];

export default function PromotionCard({ request, onEdit, onDelete, onReview, canReview }) {
  const stepIdx = WORKFLOW_STEPS.indexOf(request.status);
  const isRejected = request.status === "Rejected";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: "#0F1B2D" }}>
            {request.employee_name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{request.employee_name}</p>
            <p className="text-xs text-gray-400">{request.department} · {request.review_period || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={STATUS_STYLES[request.status] || "bg-gray-100"}>{request.status}</Badge>
          <button onClick={() => onEdit(request)} className="text-gray-300 hover:text-gray-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={() => onDelete(request.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Title & Comp */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Promotion</p>
          <p className="text-xs font-medium text-gray-700 truncate">{request.current_title}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <ArrowRight className="w-3 h-3 text-indigo-400" />
            <p className="text-sm font-semibold text-indigo-700 truncate">{request.proposed_title}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Salary Change</p>
          <p className="text-xs text-gray-500">${(request.current_salary||0).toLocaleString()}</p>
          <p className="text-sm font-semibold text-emerald-700">
            ${(request.proposed_salary||0).toLocaleString()}
            {request.salary_increase_pct ? <span className="text-xs ml-1">(+{request.salary_increase_pct}%)</span> : ""}
          </p>
        </div>
      </div>

      {/* Perf row */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> Rating: <strong className="text-gray-700">{request.performance_rating || "—"}/5</strong></span>
        <span>Goals Met: <strong className="text-gray-700">{request.goals_met_pct ?? "—"}%</strong></span>
        <span>Mgr: <strong className="text-gray-700">{request.manager_name || "—"}</strong></span>
      </div>

      {/* Workflow stepper */}
      {!isRejected && (
        <div className="flex items-center gap-1 pt-1">
          {WORKFLOW_STEPS.map((step, i) => {
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <div key={step} className="flex items-center gap-1 flex-1">
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${done || active ? (done ? "bg-emerald-400" : "bg-indigo-400") : "bg-gray-200"}`} />
                {i === WORKFLOW_STEPS.length - 1 && (
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${done || active ? "bg-emerald-400" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {isRejected ? "Rejected" : request.status === "Approved" ? "Fully Approved" : `Awaiting ${request.status.replace("Pending ", "")}`}
          {request.effective_date && ` · Effective ${request.effective_date}`}
        </p>
        {canReview && (request.status === "Pending HR" || request.status === "Pending Finance") && (
          <Button size="sm" onClick={() => onReview(request)} className="h-7 text-xs gap-1"
            style={{ background: request.status === "Pending HR" ? "#6366f1" : "#f59e0b", color: "white" }}>
            Review →
          </Button>
        )}
      </div>

      {/* Rejection info */}
      {isRejected && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-700">
          <strong>Rejected</strong>{request.hr_decision === "Rejected" && request.hr_notes ? ` by HR: ${request.hr_notes}` : ""}
          {request.finance_decision === "Rejected" && request.finance_notes ? ` by Finance: ${request.finance_notes}` : ""}
        </div>
      )}
    </div>
  );
}