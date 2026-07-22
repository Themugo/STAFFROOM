import { useMemo, useState } from "react";
import {
  format, eachDayOfInterval, isWeekend,
  startOfMonth, endOfMonth, isToday,
} from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Users, Eye } from "lucide-react";

const TYPE_BG = {
  Annual:       { bg: "#3b82f6", light: "#eff6ff", text: "#1d4ed8" },
  Sick:         { bg: "#ef4444", light: "#fef2f2", text: "#b91c1c" },
  Unpaid:       { bg: "#6b7280", light: "#f9fafb", text: "#374151" },
  Maternity:    { bg: "#ec4899", light: "#fdf2f8", text: "#be185d" },
  Paternity:    { bg: "#8b5cf6", light: "#f5f3ff", text: "#6d28d9" },
  Compassionate:{ bg: "#f59e0b", light: "#fffbeb", text: "#b45309" },
  Study:        { bg: "#14b8a6", light: "#f0fdfa", text: "#0f766e" },
};

const DEPT_COLORS = {
  Engineering: "#6366f1", Sales: "#f59e0b", Marketing: "#ec4899",
  HR: "#14b8a6", Finance: "#3b82f6", Operations: "#8b5cf6",
  Design: "#ef4444", Legal: "#6b7280", Executive: "#0f172a",
};

// How many staff on leave on a given day is "risky" (≥ this fraction of team)
const GAP_THRESHOLD = 0.3;

export default function TeamCalendar({ requests, month, employees: allEmployees = [] }) {
  const [deptFilter, setDeptFilter] = useState("All");
  const [viewMode, setViewMode] = useState("leave"); // "leave" | "dept"
  const [tooltip, setTooltip] = useState(null); // { x, y, leave }

  const approved = useMemo(() => requests.filter(r => r.status === "Approved"), [requests]);
  const pending  = useMemo(() => requests.filter(r => r.status === "Pending"),  [requests]);

  const days = useMemo(() => {
    return eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
      .filter(d => !isWeekend(d));
  }, [month]);

  // Build unique employee list from approved + pending
  const staffOnLeave = useMemo(() => {
    const seen = new Set();
    return [...approved, ...pending].filter(r => {
      if (seen.has(r.employee_id)) return false;
      seen.add(r.employee_id);
      return true;
    }).map(r => {
      const emp = allEmployees.find(e => e.id === r.employee_id);
      return { id: r.employee_id, name: r.employee_name, department: r.department || emp?.department || "" };
    });
  }, [approved, pending, allEmployees]);

  const departments = useMemo(() => {
    const depts = [...new Set(staffOnLeave.map(e => e.department).filter(Boolean))].sort();
    return ["All", ...depts];
  }, [staffOnLeave]);

  const filteredStaff = useMemo(() => {
    if (deptFilter === "All") return staffOnLeave;
    return staffOnLeave.filter(e => e.department === deptFilter);
  }, [staffOnLeave, deptFilter]);

  const getLeaveOnDay = (empId, date) => {
    const ds = format(date, "yyyy-MM-dd");
    const app = approved.find(r => r.employee_id === empId && ds >= r.start_date && ds <= r.end_date);
    if (app) return { ...app, _type: "approved" };
    const pend = pending.find(r => r.employee_id === empId && ds >= r.start_date && ds <= r.end_date);
    if (pend) return { ...pend, _type: "pending" };
    return null;
  };

  // Day headcount: how many approved-leave staff per day
  const dayStats = useMemo(() => {
    return days.map(d => {
      const ds = format(d, "yyyy-MM-dd");
      const onLeave = approved.filter(r =>
        ds >= r.start_date && ds <= r.end_date &&
        (deptFilter === "All" || r.department === deptFilter)
      );
      // teamSize intentionally has no fallback here. It previously fell
      // back to `filteredStaff.length` (the count of people ON LEAVE) when
      // there were zero matching active employees on file for this
      // department — e.g. a department with everyone marked Terminated, or
      // a brand-new department not yet reflected in the roster. Using "how
      // many people are on leave" as a stand-in for "total team size" isn't
      // a rough approximation, it's backwards: it produces a false 100%
      // "staffing gap" reading precisely in the scenario where the real
      // denominator is unknown, which is exactly when this indicator
      // matters most to get right. With no fallback, `teamSize` is 0 in
      // that case and `teamSize > 0` below correctly suppresses the risk
      // flag instead of fabricating one.
      const teamSize = deptFilter === "All"
        ? allEmployees.filter(e => e.status !== "Terminated").length
        : allEmployees.filter(e => e.department === deptFilter && e.status !== "Terminated").length;
      const risk = teamSize > 0 && onLeave.length / teamSize >= GAP_THRESHOLD;
      return { count: onLeave.length, teamSize, risk, names: onLeave.map(r => r.employee_name) };
    });
  }, [days, approved, deptFilter, allEmployees]);

  if (staffOnLeave.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
        No approved leave for this month.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Dept filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                deptFilter === d
                  ? "text-white border-transparent"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
              style={deptFilter === d ? { background: d === "All" ? "#0F1B2D" : (DEPT_COLORS[d] || "#0F1B2D") } : {}}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-1">
          {[{ v: "leave", label: "Leave Type" }, { v: "dept", label: "Department" }].map(opt => (
            <button
              key={opt.v}
              onClick={() => setViewMode(opt.v)}
              className={`px-3 py-1 rounded-lg text-xs border transition-all ${
                viewMode === opt.v ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Risk summary bar */}
      {dayStats.some(d => d.risk) && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-amber-800">Staffing gaps detected</span>
            <span className="text-amber-700 ml-1">—</span>
            <span className="text-amber-700 ml-1">
              {dayStats.filter(d => d.risk).length} day{dayStats.filter(d => d.risk).length !== 1 ? "s" : ""} have ≥30% of staff on leave:
            </span>
            <span className="text-amber-600 ml-1 font-medium">
              {days.filter((_, i) => dayStats[i]?.risk).map(d => format(d, "MMM d")).join(", ")}
            </span>
          </div>
        </div>
      )}

      {/* Calendar grid */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="text-xs border-collapse" style={{ minWidth: days.length * 36 + 160 }}>
          <thead>
            {/* Month day numbers row */}
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-2.5 text-gray-500 font-medium w-40 sticky left-0 bg-gray-50 z-20 border-r border-gray-100">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Employee
                </div>
              </th>
              {days.map((d, i) => {
                const stat = dayStats[i];
                return (
                  <th
                    key={d.toISOString()}
                    className={`px-0 py-2 text-center font-normal min-w-[34px] relative ${
                      isToday(d) ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className={`text-xs font-semibold ${isToday(d) ? "text-blue-600" : "text-gray-600"}`}>
                      {format(d, "d")}
                    </div>
                    <div className="text-gray-300 text-[10px]">{format(d, "EEE")}</div>
                    {/* Gap indicator dot */}
                    {stat?.risk && (
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mx-auto mt-0.5" title="Staffing gap risk" />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {filteredStaff.map((emp, ri) => (
              <tr key={emp.id} className={`border-t border-gray-50 ${ri % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                <td className={`px-4 py-2 sticky left-0 z-10 border-r border-gray-100 whitespace-nowrap ${ri % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                  <p className="font-medium text-gray-800 text-xs">{emp.name}</p>
                  {emp.department && (
                    <p className="text-[10px] mt-0.5" style={{ color: DEPT_COLORS[emp.department] || "#6b7280" }}>
                      {emp.department}
                    </p>
                  )}
                </td>
                {days.map(d => {
                  const leave = getLeaveOnDay(emp.id, d);
                  const isPending = leave?._type === "pending";
                  const color = leave
                    ? (viewMode === "dept"
                        ? DEPT_COLORS[emp.department] || "#6b7280"
                        : TYPE_BG[leave.leave_type]?.bg || "#6b7280")
                    : null;

                  return (
                    <td
                      key={d.toISOString()}
                      className={`py-1 px-0.5 text-center relative ${isToday(d) ? "bg-blue-50/40" : ""}`}
                      onMouseEnter={e => {
                        if (leave) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({ x: rect.left, y: rect.bottom + 6, leave, emp });
                        }
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      {leave ? (
                        <div
                          className={`h-5 rounded mx-0.5 ${isPending ? "opacity-40 border border-dashed" : "opacity-75"}`}
                          style={{ background: color, borderColor: isPending ? color : undefined }}
                        />
                      ) : (
                        <div className="h-5 mx-0.5" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Daily count footer row */}
            <tr className="border-t-2 border-gray-200 bg-white">
              <td className="px-4 py-2 sticky left-0 bg-white z-10 border-r border-gray-100">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">On Leave</p>
              </td>
              {dayStats.map((stat, i) => (
                <td key={i} className={`py-2 text-center ${isToday(days[i]) ? "bg-blue-50/40" : ""}`}>
                  {stat.count > 0 ? (
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                        stat.risk ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                      }`}
                      title={stat.names.join(", ")}
                    >
                      {stat.count}
                    </span>
                  ) : (
                    <span className="text-gray-200 text-xs">—</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
        <div className="flex flex-wrap gap-3">
          {Object.entries(TYPE_BG).map(([type, c]) => (
            <div key={type} className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-sm" style={{ background: c.bg }} />
              {type}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 ml-auto">
          <div className="w-3 h-3 rounded-sm opacity-40 border border-dashed border-gray-400 bg-gray-300" />
          Pending approval
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          Staffing gap risk (≥30%)
        </div>
      </div>

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl pointer-events-none space-y-1"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="font-semibold">{tooltip.emp.name}</p>
          <p className="text-gray-300">{tooltip.leave.leave_type} leave</p>
          <p className="text-gray-400">{tooltip.leave.start_date} → {tooltip.leave.end_date}</p>
          {tooltip.leave.reason && <p className="text-gray-400 italic">"{tooltip.leave.reason}"</p>}
          {tooltip.leave._type === "pending" && (
            <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0">Pending approval</Badge>
          )}
        </div>
      )}
    </div>
  );
}