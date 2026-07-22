import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function calcHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const [h1, m1] = checkIn.split(":").map(Number);
  const [h2, m2] = checkOut.split(":").map(Number);
  const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
  return diff > 0 ? diff / 60 : 0;
}

// Get last N months (YYYY-MM strings)
function getMonthOptions() {
  const opts = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    opts.push({
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    });
  }
  return opts;
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AttendanceDashboard({ records, employees }) {
  const monthOptions = getMonthOptions();
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value);

  const monthRecords = useMemo(() =>
    records.filter(r => r.date?.startsWith(selectedMonth)),
    [records, selectedMonth]
  );

  // Overall stats for selected month
  const totalRecords = monthRecords.length;
  const presentCount = monthRecords.filter(r => ["Present", "Remote"].includes(r.status)).length;
  const lateCount = monthRecords.filter(r => r.status === "Late").length;
  const absentCount = monthRecords.filter(r => r.status === "Absent").length;
  const attendanceRate = totalRecords ? Math.round((presentCount / totalRecords) * 100) : 0;
  const totalHours = monthRecords.reduce((s, r) => s + calcHours(r.check_in, r.check_out), 0);

  // Per-employee stats
  const empStats = useMemo(() => {
    const map = {};
    for (const r of monthRecords) {
      if (!map[r.employee_id]) {
        map[r.employee_id] = { name: r.employee_name, present: 0, late: 0, absent: 0, hours: 0, days: 0 };
      }
      const s = map[r.employee_id];
      s.days++;
      // "Present" here means the same thing it means everywhere else in this
      // component (the top-level attendanceRate KPI and the daily chart both
      // count only Present/Remote as present, Late as separate). This used
      // to also do `s.present++` inside the Late branch, silently
      // double-counting late arrivals as full presents — present + late +
      // absent no longer summed to days logged for anyone with a late
      // arrival, and this table's numbers wouldn't reconcile against the
      // Attendance Rate KPI card above it.
      if (["Present", "Remote"].includes(r.status)) s.present++;
      if (r.status === "Late") s.late++;
      if (r.status === "Absent") s.absent++;
      s.hours += calcHours(r.check_in, r.check_out);
    }
    return Object.values(map).sort((a, b) => b.hours - a.hours);
  }, [monthRecords]);

  // Daily attendance chart (count of Present+Late per day)
  const dailyChart = useMemo(() => {
    const dayMap = {};
    for (const r of monthRecords) {
      if (!dayMap[r.date]) dayMap[r.date] = { date: r.date, present: 0, late: 0, absent: 0 };
      if (["Present", "Remote"].includes(r.status)) dayMap[r.date].present++;
      if (r.status === "Late") dayMap[r.date].late++;
      if (r.status === "Absent") dayMap[r.date].absent++;
    }
    return Object.values(dayMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(d => ({ ...d, day: d.date.slice(8) }));
  }, [monthRecords]);

  // Late arrivals list
  const lateArrivals = monthRecords
    .filter(r => r.status === "Late")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Month selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm font-semibold text-gray-700">Analytics Overview</p>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-52 h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>{monthOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Attendance Rate" value={`${attendanceRate}%`} sub={`${presentCount} of ${totalRecords} records`} color="bg-emerald-50 text-emerald-600" />
        <StatCard icon={Clock} label="Total Hours Worked" value={totalHours.toFixed(0) + "h"} sub="across all employees" color="bg-blue-50 text-blue-600" />
        <StatCard icon={AlertTriangle} label="Late Arrivals" value={lateCount} sub="this period" color="bg-amber-50 text-amber-600" />
        <StatCard icon={Users} label="Absences" value={absentCount} sub="this period" color="bg-red-50 text-red-500" />
      </div>

      {/* Daily chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">Daily Attendance Breakdown</p>
        {dailyChart.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No data for this period.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyChart} barSize={16} barGap={2}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #f0f0f0", fontSize: 12 }}
                formatter={(val, name) => [val, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Bar dataKey="present" stackId="a" fill="#10b981" name="Present" radius={[0, 0, 0, 0]} />
              <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
              <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hours per employee */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">Hours Worked per Employee</p>
          {empStats.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No data for this period.</p>
          ) : (
            <div className="space-y-3">
              {empStats.map(e => {
                const maxHours = Math.max(...empStats.map(x => x.hours), 1);
                const pct = Math.round((e.hours / maxHours) * 100);
                return (
                  <div key={e.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700 truncate">{e.name}</span>
                      <span className="text-gray-400 ml-2 flex-shrink-0">{e.hours.toFixed(1)}h · {e.days} days</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Late arrivals */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Late Arrivals
          </p>
          {lateArrivals.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No late arrivals this period. 🎉</p>
          ) : (
            <div className="space-y-2.5">
              {lateArrivals.map(r => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{r.employee_name}</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                      In: {r.check_in || "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Per-employee summary table */}
      {empStats.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-700">Employee Summary — {monthOptions.find(m => m.value === selectedMonth)?.label}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 font-semibold uppercase tracking-wide border-b border-gray-50 bg-gray-50">
                  <th className="text-left px-5 py-3">Employee</th>
                  <th className="text-center px-4 py-3">Days Logged</th>
                  <th className="text-center px-4 py-3">Present</th>
                  <th className="text-center px-4 py-3">Late</th>
                  <th className="text-center px-4 py-3">Absent</th>
                  <th className="text-right px-5 py-3">Total Hours</th>
                  <th className="text-right px-5 py-3">Avg/Day</th>
                </tr>
              </thead>
              <tbody>
                {empStats.map(e => (
                  <tr key={e.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800">{e.name}</td>
                    <td className="px-4 py-3.5 text-center text-gray-500">{e.days}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-emerald-600 font-semibold">{e.present}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={e.late > 0 ? "text-amber-600 font-semibold" : "text-gray-300"}>{e.late}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={e.absent > 0 ? "text-red-500 font-semibold" : "text-gray-300"}>{e.absent}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-800">{e.hours.toFixed(1)}h</td>
                    <td className="px-5 py-3.5 text-right text-gray-500">{e.days ? (e.hours / e.days).toFixed(1) + "h" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}