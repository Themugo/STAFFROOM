import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileBarChart2, Users, DollarSign, TrendingUp } from "lucide-react";

const COLORS = ["#0F1B2D", "#D4A843", "#1A2D45", "#F0C96B", "#4B6A8E", "#8BA3BE"];

export default function Reports() {
  const [employees, setEmployees] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const load = () => {
    setLoadError(null);
    Promise.all([
      base44.entities.Employee.list(),
      base44.entities.PayrollRecord.list("-pay_period_year"),
    ]).then(([emps, pay]) => {
      setEmployees(emps);
      setPayroll(pay);
    }).catch(() => {
      setLoadError("Failed to load report data. Please try again.");
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  // Department breakdown
  const deptData = employees.reduce((acc, emp) => {
    const d = emp.department || "Unknown";
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});
  const deptChart = Object.entries(deptData).map(([name, value]) => ({ name, value }));

  // Employment type breakdown
  const typeData = employees.reduce((acc, emp) => {
    const t = emp.employment_type || "Full-time";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const typeChart = Object.entries(typeData).map(([name, value]) => ({ name, value }));

  // Monthly payroll spend (last 6 months)
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const total = payroll
      .filter(p => p.pay_period_month === m && p.pay_period_year === y)
      .reduce((s, p) => s + (p.net_pay || 0), 0);
    return {
      name: d.toLocaleString("default", { month: "short" }),
      total,
    };
  });

  // Status breakdown
  const statusData = employees.reduce((acc, emp) => {
    const s = emp.status || "Active";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const totalPayroll = payroll.filter(p => p.status === "Paid").reduce((s, p) => s + (p.net_pay || 0), 0);
  const avgSalary = employees.length
    ? Math.round(employees.reduce((s, e) => s + (e.base_salary || 0), 0) / employees.length)
    : 0;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
    </div>
  );

  if (loadError) return (
    <div className="text-center py-20">
      <p className="text-sm font-medium text-red-600">{loadError}</p>
      <button onClick={load} className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors">
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Employees", value: employees.length, icon: Users, color: "#0F1B2D" },
          { label: "Active Staff", value: statusData["Active"] || 0, icon: TrendingUp, color: "#10b981" },
          { label: "Total Paid Out", value: `$${totalPayroll.toLocaleString()}`, icon: DollarSign, color: "#D4A843" },
          { label: "Avg. Salary", value: `$${avgSalary.toLocaleString()}`, icon: FileBarChart2, color: "#6366f1" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + "15" }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Payroll */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Payroll Spend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, "Net Pay"]} />
              <Bar dataKey="total" fill="#D4A843" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Headcount by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={deptChart} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {deptChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Employment Type */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Employment Types</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={typeChart} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#0F1B2D" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Status */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Employee Status</h3>
          <div className="space-y-3 mt-2">
            {Object.entries(statusData).map(([status, count], i) => {
              const pct = Math.round((count / employees.length) * 100);
              const colors = { Active: "#10b981", "On Leave": "#f59e0b", Terminated: "#ef4444" };
              return (
                <div key={status}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{status}</span>
                    <span className="font-semibold">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[status] || "#6366f1" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}