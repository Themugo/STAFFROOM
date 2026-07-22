import { Bell, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TYPE_COLORS = {
  Annual: "bg-blue-50 text-blue-700 border-blue-200",
  Sick: "bg-red-50 text-red-700 border-red-200",
  Unpaid: "bg-gray-100 text-gray-600 border-gray-200",
  Maternity: "bg-pink-50 text-pink-700 border-pink-200",
  Paternity: "bg-violet-50 text-violet-700 border-violet-200",
  Compassionate: "bg-amber-50 text-amber-700 border-amber-200",
  Study: "bg-teal-50 text-teal-700 border-teal-200",
};

export default function PendingApprovalsBanner({ pending, onReview, onQuickDecision }) {
  if (!pending || pending.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
          <Bell className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-900">
            {pending.length} leave request{pending.length > 1 ? "s" : ""} awaiting your approval
          </p>
          <p className="text-xs text-amber-600">Review and respond to keep employees informed</p>
        </div>
      </div>

      <div className="space-y-2">
        {pending.slice(0, 5).map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-amber-100 px-4 py-3 flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{r.employee_name}</p>
              <p className="text-xs text-gray-400">{r.department} · {r.start_date} → {r.end_date} · {r.days_requested} day{r.days_requested !== 1 ? "s" : ""}</p>
            </div>
            <Badge className={`text-xs border shrink-0 ${TYPE_COLORS[r.leave_type] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
              {r.leave_type}
            </Badge>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => onQuickDecision(r.id, "Rejected", "")}
              >
                <XCircle className="w-3 h-3 mr-1" /> Deny
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => onQuickDecision(r.id, "Approved", "")}
              >
                <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
              </Button>
              <button onClick={() => onReview(r)} className="text-xs text-blue-600 hover:underline ml-1">
                Details
              </button>
            </div>
          </div>
        ))}
        {pending.length > 5 && (
          <p className="text-xs text-amber-600 text-center pt-1">+{pending.length - 5} more — use the Requests tab to view all</p>
        )}
      </div>
    </div>
  );
}