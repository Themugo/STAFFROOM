import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { StarRating } from "./ReviewModal";

const STATUS_COLOR = {
  Draft: "bg-gray-100 text-gray-600",
  Submitted: "bg-blue-100 text-blue-700",
  Acknowledged: "bg-emerald-100 text-emerald-700"
};

export default function ReviewCard({ review, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: "#0F1B2D" }}>
            {review.employee_name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{review.employee_name}</p>
            <p className="text-xs text-gray-400">{review.department} · {review.review_period}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={STATUS_COLOR[review.status]}>{review.status}</Badge>
          <button onClick={() => onDelete(review.id)} className="text-gray-300 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Rating</p>
          <div className="flex justify-center"><StarRating value={review.overall_rating} size="w-4 h-4" /></div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Goals Met</p>
          <p className="text-lg font-bold text-gray-900">{review.goals_met}%</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Reviewer</p>
          <p className="text-sm font-medium text-gray-700 truncate">{review.reviewer_name || "—"}</p>
        </div>
      </div>

      <button onClick={() => setExpanded(e => !e)} className="mt-3 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? "Hide details" : "Show details"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 text-sm">
          {review.strengths && <div><p className="text-xs font-semibold text-gray-400 mb-1">STRENGTHS</p><p className="text-gray-700">{review.strengths}</p></div>}
          {review.improvements && <div><p className="text-xs font-semibold text-gray-400 mb-1">AREAS FOR IMPROVEMENT</p><p className="text-gray-700">{review.improvements}</p></div>}
          {review.goals_next_period && <div><p className="text-xs font-semibold text-gray-400 mb-1">NEXT PERIOD GOALS</p><p className="text-gray-700">{review.goals_next_period}</p></div>}
          {review.manager_feedback && <div><p className="text-xs font-semibold text-gray-400 mb-1">MANAGER FEEDBACK</p><p className="text-gray-700">{review.manager_feedback}</p></div>}
          {review.self_assessment && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-blue-700 mb-1">SELF-ASSESSMENT</p>
              <p className="text-xs text-blue-900 leading-relaxed">{review.self_assessment}</p>
            </div>
          )}
          {review.ai_summary && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Summary</p>
              <p className="text-xs text-amber-900 leading-relaxed">{review.ai_summary}</p>
            </div>
          )}
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={() => onEdit(review)} className="h-7 text-xs">Edit</Button>
          </div>
        </div>
      )}
    </div>
  );
}