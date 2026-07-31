import { useState } from "react";
import { CheckSquare, Clock, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
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
        className="relative p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
        title="Task & Approval Center"
      >
        <CheckSquare className="w-5 h-5" />
        {pendingCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
            {pendingCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Tasks & Approvals</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {pendingCount} Pending
                </span>
              </div>
            </div>

            {/* List */}
            <div className="mt-3 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{task.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Due {task.dueDate} • {task.assignee}
                    </p>
                    <Link
                      to={createPageUrl(task.page)}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 pt-1"
                    >
                      Open Module <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="p-1.5 rounded-xl bg-white dark:bg-slate-700 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors cursor-pointer"
                    title="Mark Done"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {tasks.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
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
