import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Users, DollarSign, UserCheck, TrendingUp, ArrowRight } from "lucide-react";
import PayrollAnalysis from "../components/dashboard/PayrollAnalysis";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatCard from "../components/dashboard/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const load = () => {
    setLoadError(null);
    Promise.all([
      base44.entities.Employee.list(),
      base44.entities.PayrollRecord.list("-pay_period_year", 50)
    ]).then(([emps, pays]) => {
      setEmployees(emps);
      setPayroll(pays);
    }).catch(() => {
      setLoadError("Failed to load dashboard data. Please try again.");
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const activeCount = employees.filter(e => e.status === "Active" || !e.status).length;
  const onLeaveCount = employees.filter(e => e.status === "On Leave").length;
  const totalPayroll = payroll.filter(p => p.status === "Paid").reduce((s, p) => s + (p.net_pay || 0), 0);
  const pendingPayroll = payroll.filter(p => p.status === "Draft" || p.status === "Approved").length;

  // Chart: payroll by month (last 6)
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const total = payroll
      .filter(p => p.pay_period_month === m && p.pay_period_year === y)
      .reduce((s, p) => s + (p.net_pay || 0), 0);
    return { name: MONTHS[m - 1], total };
  });

  const deptBreakdown = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});

  const recentEmployees = [...employees].sort((a,b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 5);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-800 animate-spin" />
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Employees" value={employees.length} sub={`${activeCount} active`} icon={Users} color="bg-blue-50 text-blue-600" />
        <StatCard label="Active Staff" value={activeCount} sub={`${onLeaveCount} on leave`} icon={UserCheck} color="bg-emerald-50 text-emerald-600" />
        <StatCard label="Total Paid Payroll" value={`$${(totalPayroll/1000).toFixed(1)}k`} sub="all time" icon={DollarSign} color="bg-amber-50 text-amber-600" />
        <StatCard label="Pending Payroll" value={pendingPayroll} sub="awaiting approval" icon={TrendingUp} color="bg-rose-50 text-rose-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Payroll Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Payroll — Last 6 Months</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, "Net Pay"]}
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }} />
              <Bar dataKey="total" fill="#0F1B2D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dept Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">By Department</h3>
          <div className="space-y-3">
            {Object.entries(deptBreakdown).sort((a,b) => b[1]-a[1]).slice(0,7).map(([dept, count]) => (
              <div key={dept}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">{dept}</span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(count/employees.length)*100}%`, background: "#0F1B2D" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Payroll Analysis */}
      <PayrollAnalysis payroll={payroll} employees={employees} />

      {/* Recent Employees */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-900">Recently Added</h3>
          <Link to={createPageUrl("Staff")} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentEmployees.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No employees yet. Add your first staff member.</p>}
          {recentEmployees.map(emp => (
            <div key={emp.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                style={{ background: "#0F1B2D" }}>
                {emp.full_name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{emp.full_name}</p>
                <p className="text-xs text-gray-400 truncate">{emp.job_title} · {emp.department}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                emp.status === "Active" || !emp.status ? "bg-emerald-50 text-emerald-700"
                : emp.status === "On Leave" ? "bg-amber-50 text-amber-700"
                : "bg-red-50 text-red-700"
              }`}>{emp.status || "Active"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}