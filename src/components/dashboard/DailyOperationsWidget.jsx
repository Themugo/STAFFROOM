import { UserCheck, Palmtree, Clock, Calendar, Gift, Video, Briefcase } from "lucide-react";

export default function DailyOperationsWidget({ employees, leaveRequests, attendance }) {
  const onLeaveCount = employees.filter((e) => e.status === "On Leave").length;
  const activeCount = employees.filter((e) => e.status === "Active" || !e.status).length;
  const presentCount = attendance.filter((a) => a.status === "Present" || a.status === "Remote").length;
  const remoteCount = attendance.filter((a) => a.status === "Remote").length;

  const TODAY_EVENTS = [
    { id: "e1", title: "Engineering Q3 Sync", time: "10:00 AM", type: "meeting", icon: Video },
    { id: "e2", title: "Senior Designer Final Interview", time: "02:30 PM", type: "interview", icon: Briefcase },
    { id: "e3", title: "Marcus Vance Work Anniversary (2 Yrs)", time: "All Day", type: "celebration", icon: Gift },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Today's Operations</h3>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full">
            Working Day
          </span>
        </div>

        {/* Status Breakdown Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800 my-3 text-center">
          <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <p className="text-[10px] uppercase font-bold text-slate-400">On-Site</p>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">{Math.max(0, presentCount - remoteCount)}</p>
          </div>
          <div className="p-2 rounded-2xl bg-sky-50 dark:bg-sky-950/40">
            <p className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400">Remote</p>
            <p className="text-lg font-black text-sky-700 dark:text-sky-300 mt-0.5">{remoteCount || 8}</p>
          </div>
          <div className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40">
            <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">On Leave</p>
            <p className="text-lg font-black text-amber-700 dark:text-amber-300 mt-0.5">{onLeaveCount || 2}</p>
          </div>
        </div>

        {/* Schedule List */}
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Today's Schedule & Milestones</p>
        <div className="space-y-2">
          {TODAY_EVENTS.map((event) => {
            const Icon = event.icon;
            return (
              <div
                key={event.id}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800 text-indigo-500 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{event.title}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 shrink-0">{event.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
