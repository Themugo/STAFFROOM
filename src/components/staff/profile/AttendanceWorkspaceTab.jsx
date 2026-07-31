import { Clock, Calendar, CheckCircle2, AlertCircle, Laptop, MapPin, Check } from "lucide-react";

export function AttendanceWorkspaceTab({ attendance = [] }) {
  const mockLogs = attendance.length > 0 ? attendance : [
    { id: "a1", date: "2026-07-31", checkIn: "08:54 AM", checkOut: "05:02 PM", status: "On Time", mode: "HQ Office" },
    { id: "a2", date: "2026-07-30", checkIn: "09:02 AM", checkOut: "05:15 PM", status: "On Time", mode: "Remote" },
    { id: "a3", date: "2026-07-29", checkIn: "09:18 AM", checkOut: "05:45 PM", status: "Late Arrival", mode: "HQ Office" },
    { id: "a4", date: "2026-07-28", checkIn: "08:48 AM", checkOut: "05:00 PM", status: "On Time", mode: "Remote" },
    { id: "a5", date: "2026-07-27", checkIn: "08:55 AM", checkOut: "05:10 PM", status: "On Time", mode: "HQ Office" },
  ];

  return (
    <div className="space-y-6">
      {/* Attendance Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Punctuality Score</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">98.2%</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Average Clock-In</p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">08:55 AM</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Remote Days (MTD)</p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">8 Days</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Missed Punches</p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">0</p>
        </div>
      </div>

      {/* Clock-In Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          Recent Clock-In / Clock-Out Punch Logs
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Clock In</th>
                <th className="py-2.5 px-3">Clock Out</th>
                <th className="py-2.5 px-3">Work Mode</th>
                <th className="py-2.5 px-3 text-right">Punctuality Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{log.date}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-semibold">{log.checkIn}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-semibold">{log.checkOut}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.mode}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                        log.status === "On Time"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
