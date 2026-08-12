import { useState } from "react";
import { CheckSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const TASK_ITEMS = [
  { id: "t1", title: "Approve Q3 Promotion Batch", assignee: "Executive Board", dueDate: "Today", priority: "High", page: "Promotions" },
  { id: "t2", title: "Review 3 Pending Leave Requests", assignee: "HR Ops", dueDate: "Today", priority: "Medium", page: "Leave" },
  { id: "t3", title: "Sign Monthly Payroll Audit Statement", assignee: "Finance Dept", dueDate: "Tomorrow", priority: "High", page: "Payroll" },
  { id: "t4", title: "Verify New Hire Onboarding Documents", assignee: "People Ops", dueDate: "Aug 02", priority: "Low", page: "Onboarding" },
];

export default function TaskCenterPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState(TASK_ITEMS);

  const pendingCount = tasks.length;

  const handleCompleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] border border-[#DCE6F2] text-[#52677F] hover:text-[#2563EB] transition-colors cursor-pointer"
        title="Task & Approval Center"
      >
        <CheckSquare className="w-4 h-4" />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
            {pendingCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 bg-white rounded-2xl border border-[#DCE6F2] shadow-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE6F2]">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#102A43] text-xs uppercase tracking-wider">Tasks & Approvals</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF3FF] text-[#2563EB]">
                  {pendingCount} Pending
                </span>
              </div>
            </div>

            {/* List */}
            <div className="mt-3 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-[#F6F9FD] border border-[#DCE6F2] flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <span className="font-bold text-xs text-[#102A43] block">{task.title}</span>
                    <p className="text-[10px] text-[#7890A8]">
                      Due {task.dueDate} • {task.assignee}
                    </p>
                    <Link
                      to={createPageUrl(task.page)}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB] hover:text-[#1D4ED8] pt-0.5"
                    >
                      Open Module <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="p-1.5 rounded-lg bg-white text-[#159A68] hover:bg-emerald-50 border border-[#DCE6F2] transition-colors cursor-pointer shrink-0"
                    title="Mark Done"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {tasks.length === 0 && (
                <div className="py-8 text-center text-xs text-[#7890A8]">
                  All approvals and tasks completed!
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
