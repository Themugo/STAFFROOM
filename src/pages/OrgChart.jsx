import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Users, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const DEPT_COLORS = {
  Engineering: "#3b82f6",
  Sales: "#10b981",
  Marketing: "#f59e0b",
  HR: "#8b5cf6",
  Finance: "#ef4444",
  Operations: "#6366f1",
  Design: "#ec4899",
  Legal: "#64748b",
  Executive: "#0F1B2D",
};

function EmployeeNode({ emp }) {
  const initials = emp.full_name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
  const color = DEPT_COLORS[emp.department] || "#6b7280";
  return (
    <div className="flex flex-col items-center group">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-sm border-2 border-white transition-transform group-hover:scale-105"
        style={{ background: color }}>
        {initials}
      </div>
      <div className="mt-2 text-center max-w-[100px]">
        <p className="text-xs font-semibold text-gray-800 truncate">{emp.full_name}</p>
        <p className="text-xs text-gray-400 truncate">{emp.job_title}</p>
      </div>
    </div>
  );
}

function DeptSection({ dept, employees }) {
  const [collapsed, setCollapsed] = useState(false);
  const color = DEPT_COLORS[dept] || "#6b7280";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ background: color }} />
          <span className="font-semibold text-gray-800 text-sm">{dept}</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{employees.length}</span>
        </div>
        {collapsed ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
      </button>

      {!collapsed && (
        <div className="px-5 pb-6">
          {/* Manager row (highest salary or first) */}
          {employees.length > 0 && (() => {
            const sorted = [...employees].sort((a,b) => (b.base_salary||0) - (a.base_salary||0));
            const manager = sorted[0];
            const rest = sorted.slice(1);
            return (
              <div className="flex flex-col items-center">
                {/* Manager */}
                <div className="relative">
                  <EmployeeNode emp={manager} />
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold text-center leading-none" style={{ fontSize: "9px" }}>LEAD</span>
                </div>
                {rest.length > 0 && (
                  <>
                    {/* Connector line */}
                    <div className="w-px h-6 bg-gray-200 my-2" />
                    <div className="w-full border-t border-gray-200" />
                    {/* Team */}
                    <div className="flex flex-wrap justify-center gap-6 mt-4">
                      {rest.map(emp => <EmployeeNode key={emp.id} emp={emp} />)}
                    </div>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default function OrgChart() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [view, setView] = useState("department"); // department | list

  const load = () => {
    setLoadError(null);
    base44.entities.Employee.list("full_name").then(emps => {
      setEmployees(emps.filter(e => e.status !== "Terminated"));
    }).catch(() => {
      setLoadError("Failed to load org chart data. Please try again.");
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const byDept = employees.reduce((acc, e) => {
    const d = e.department || "Other";
    (acc[d] = acc[d] || []).push(e);
    return acc;
  }, {});

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" /></div>;

  if (loadError) return (
    <div className="text-center py-20">
      <p className="text-sm font-medium text-red-600">{loadError}</p>
      <button onClick={load} className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors">
        Retry
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Organization Chart</h2>
          <p className="text-xs text-gray-400 mt-0.5">{employees.length} active employees · {Object.keys(byDept).length} departments</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          <button onClick={() => setView("department")}
            className={cn("px-4 py-1.5 rounded-lg text-xs font-medium transition-all", view === "department" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
            By Department
          </button>
          <button onClick={() => setView("list")}
            className={cn("px-4 py-1.5 rounded-lg text-xs font-medium transition-all", view === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
            All Staff
          </button>
        </div>
      </div>

      {/* Department legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(byDept).map(([dept, emps]) => (
          <div key={dept} className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full" style={{ background: DEPT_COLORS[dept] || "#6b7280" }} />
            <span className="text-xs text-gray-600">{dept}</span>
            <span className="text-xs font-semibold text-gray-400">{emps.length}</span>
          </div>
        ))}
      </div>

      {view === "department" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(byDept).sort((a,b) => b[1].length - a[1].length).map(([dept, emps]) => (
            <DeptSection key={dept} dept={dept} employees={emps} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Job Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...employees].sort((a,b) => (a.department||"").localeCompare(b.department||"")).map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: DEPT_COLORS[emp.department] || "#6b7280" }}>
                        {emp.full_name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{emp.full_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full font-medium text-white" style={{ background: DEPT_COLORS[emp.department] || "#6b7280" }}>{emp.department}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{emp.job_title}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs hidden lg:table-cell">{emp.email || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {employees.length === 0 && (
        <div className="text-center py-24 text-gray-400">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No active employees found</p>
        </div>
      )}
    </div>
  );
}