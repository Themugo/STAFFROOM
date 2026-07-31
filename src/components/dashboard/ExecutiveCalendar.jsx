import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const CALENDAR_EVENTS = [
  { date: "2026-07-31", title: "Monthly Payroll Sign-Off", type: "payroll" },
  { date: "2026-08-03", title: "Summer Civic Holiday (Public)", type: "holiday" },
  { date: "2026-08-07", title: "Q3 Performance Reviews Open", type: "review" },
  { date: "2026-08-14", title: "Mid-Month Compensation Review", type: "payroll" },
];

export default function ExecutiveCalendar() {
  const [currentMonth, setCurrentMonth] = useState("August 2026");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Corporate Calendar</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mr-2">{currentMonth}</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {CALENDAR_EVENTS.map((event, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex flex-col items-center justify-center shrink-0 text-xs">
                <span>{event.date.split("-")[2]}</span>
                <span className="text-[9px] uppercase font-bold text-indigo-400">AUG</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{event.title}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{event.type}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Scheduled
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
