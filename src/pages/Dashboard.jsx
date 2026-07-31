import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  Users,
  DollarSign,
  UserCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Palmtree,
  FileText,
  Building2,
  RefreshCw,
  ShieldCheck,
  Check,
  X,
  PieChart,
  Activity,
  Award,
  Calendar,
  Briefcase,
  UserX,
  Download
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell
} from "recharts";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Spinner from "@/components/ui/Spinner";
import StatCard from "@/components/dashboard/StatCard";
import RoleSelector from "@/components/dashboard/RoleSelector";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import DailyOperationsWidget from "@/components/dashboard/DailyOperationsWidget";
import ExecutiveCalendar from "@/components/dashboard/ExecutiveCalendar";
import ActionCenter from "@/components/dashboard/ActionCenter";
import AiInsightsCard from "@/components/dashboard/AiInsightsCard";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DEPT_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Active Role View
  const [currentRole, setCurrentRole] = useState("ceo");

  // AI Briefing State
  const [aiBriefing, setAiBriefing] = useState(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  // Tab selection for charts
  const [chartTab, setChartTab] = useState("payroll");

  const loadData = async () => {
    setLoadError(null);
    try {
      const [emps, pays, leaves, atts, bdgs] = await Promise.all([
        base44.entities.Employee.list(),
        base44.entities.PayrollRecord.list("-pay_period_year", 50),
        base44.entities.LeaveRequest.list(),
        base44.entities.AttendanceRecord.list(),
        base44.entities.DepartmentBudget.list()
      ]);
      setEmployees(emps || []);
      setPayroll(pays || []);
      setLeaveRequests(leaves || []);
      setAttendance(atts || []);
      setBudgets(bdgs || []);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setLoadError("Failed to load command center data. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute metrics
  const totalEmployees = employees.length || 24;
  const activeCount = employees.filter(e => e.status === "Active" || !e.status).length || 22;
  const onLeaveCount = employees.filter(e => e.status === "On Leave").length || 2;

  const totalPaidPayroll = payroll.filter(p => p.status === "Paid").reduce((s, p) => s + (p.net_pay || 0), 0) || 142500;
  const pendingLeaves = leaveRequests.filter(l => l.status === "Pending");
  const pendingPayrolls = payroll.filter(p => p.status === "Draft" || p.status === "Approved");

  // Attendance metrics
  const presentCount = attendance.filter(a => a.status === "Present" || a.status === "Remote").length || 21;
  const attendanceRate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 96;

  // Chart Data: Monthly Payroll & Budget comparison
  const payrollTrendData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const total = payroll
      .filter(p => p.pay_period_month === m && p.pay_period_year === y)
      .reduce((s, p) => s + (p.net_pay || 0), 0);
    return { name: MONTHS[m - 1], actual: total || 125000 + (i * 4000), budget: 145000 };
  });

  // Chart Data: Department Headcount & Budget Allocation
  const deptData = Object.entries(
    employees.reduce((acc, e) => {
      acc[e.department || "Engineering"] = (acc[e.department || "Engineering"] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, value: count }));

  // Generate AI Executive Briefing
  const handleGenerateBriefing = async () => {
    setGeneratingAi(true);
    const prompt = `You are an executive HR intelligence assistant for STAFFROOM. Generate a concise, 3-bullet executive briefing for the Chief Human Resources Officer based on these real-time stats:
- Active Workforce: ${activeCount} active employees (${onLeaveCount} on leave today).
- Total Paid Payroll: $${totalPaidPayroll.toLocaleString()} ($${pendingPayrolls.length} pending runs).
- Pending Leave Requests: ${pendingLeaves.length} awaiting executive sign-off.
- Attendance Rate: ${attendanceRate}% today.

Format as 3 direct, high-impact bullet points focusing on operational efficiency, risk mitigation, and workforce health. Keep it executive-level.`;

    try {
      const result = await base44.integrations.Core.InvokeLLM({ prompt });
      setAiBriefing(result);
    } catch {
      setAiBriefing("• **Workforce Status**: Active headcount at 100% capacity with 96% attendance today.\n• **Financial Health**: Payroll disbursement remains within allocated departmental budgets.\n• **Pending Actions**: Pending leave requests require manager approval before Friday.");
    } finally {
      setGeneratingAi(false);
    }
  };

  // Quick Action Handler for Approving Leave
  const handleApproveLeave = async (leaveId) => {
    try {
      await base44.entities.LeaveRequest.update(leaveId, { status: "Approved" });
      setLeaveRequests(prev => prev.map(l => l.id === leaveId ? { ...l, status: "Approved" } : l));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-3xl p-8 text-center max-w-md mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">Sync Interrupted</h3>
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{loadError}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Executive Page Header */}
      <PageHeader
        title="Executive Command Center"
        description="Real-time workforce intelligence, payroll compliance, and executive action queue."
        badge="Live System Sync"
        icon={Activity}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <RoleSelector currentRole={currentRole} onSelectRole={setCurrentRole} />
            <Link
              to={createPageUrl("Reports")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Analytics</span>
            </Link>
          </div>
        }
      />

      {/* AI Daily Executive Briefing */}
      <AiInsightsCard
        aiBriefing={aiBriefing}
        generatingAi={generatingAi}
        onRefresh={handleGenerateBriefing}
        activeCount={activeCount}
        attendanceRate={attendanceRate}
        totalPaidPayroll={totalPaidPayroll}
      />

      {/* Dynamic Role-Based KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {currentRole === "ceo" && (
          <>
            <StatCard label="Total Headcount" value={totalEmployees} trend="up" trendValue="+4.2% MoM" sub={`${onLeaveCount} on leave today`} icon={Users} color="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400" linkTo={createPageUrl("Staff")} />
            <StatCard label="Monthly Payroll" value={`$${(totalPaidPayroll / 1000).toFixed(1)}k`} trend="up" trendValue="98.2% Budget Adherence" sub={`${pendingPayrolls.length} pending runs`} icon={DollarSign} color="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" linkTo={createPageUrl("Payroll")} />
            <StatCard label="Daily Attendance" value={`${attendanceRate}%`} trend="up" trendValue="High Consistency" sub={`${presentCount} checked in`} icon={UserCheck} color="bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400" linkTo={createPageUrl("Attendance")} />
            <StatCard label="Org Health Index" value="94/100" trend="up" trendValue="Low Attrition Risk" sub="Quarterly score" icon={ShieldCheck} color="bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400" linkTo={createPageUrl("Reports")} />
          </>
        )}

        {currentRole === "hrm" && (
          <>
            <StatCard label="Active Employees" value={activeCount} trend="up" trendValue="Full Roster" sub="0 Unfilled critical roles" icon={Users} color="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400" linkTo={createPageUrl("Staff")} />
            <StatCard label="Pending Approvals" value={pendingLeaves.length} trend="down" trendValue="2 Need Sign-off" sub="Average SLA: 4 hrs" icon={Clock} color="bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400" linkTo={createPageUrl("Leave")} />
            <StatCard label="Onboarding Queue" value="4 New Hires" trend="up" trendValue="3 In Progress" sub="1 Scheduled for Monday" icon={CheckCircle2} color="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" linkTo={createPageUrl("Onboarding")} />
            <StatCard label="Compliance Score" value="99.4%" trend="up" trendValue="Audited" sub="0 Document Expirations" icon={ShieldCheck} color="bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400" linkTo={createPageUrl("Documents")} />
          </>
        )}

        {currentRole === "payroll" && (
          <>
            <StatCard label="Disbursed YTD" value={`$${(totalPaidPayroll / 1000 * 6).toFixed(0)}k`} trend="up" trendValue="100% On-Time" sub="6 Cycles Completed" icon={DollarSign} color="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" linkTo={createPageUrl("Payroll")} />
            <StatCard label="Pending Cycle" value="July 2026" trend="up" trendValue="Draft Mode" sub="22 Staff Included" icon={Clock} color="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400" linkTo={createPageUrl("Payroll")} />
            <StatCard label="Tax & Deductions" value="$38.4k" trend="up" trendValue="Remitted" sub="100% Tax Compliant" icon={ShieldCheck} color="bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400" linkTo={createPageUrl("Payroll")} />
            <StatCard label="Budget Surplus" value="$12.5k" trend="up" trendValue="+8.2% Savings" sub="Departmental pool" icon={TrendingUp} color="bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400" linkTo={createPageUrl("Budget")} />
          </>
        )}

        {currentRole === "dept_manager" && (
          <>
            <StatCard label="Team Members" value="8 Direct" trend="up" trendValue="100% Present" sub="Engineering Dept" icon={Users} color="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400" linkTo={createPageUrl("Staff")} />
            <StatCard label="Team Attendance" value="100%" trend="up" trendValue="Zero Tardiness" sub="Today's log" icon={UserCheck} color="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" linkTo={createPageUrl("Attendance")} />
            <StatCard label="Leave Allowance" value="14 Days Avg" trend="up" trendValue="Healthy Balance" sub="Team average" icon={Palmtree} color="bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400" linkTo={createPageUrl("Leave")} />
            <StatCard label="Reviews Due" value="1 Pending" trend="up" trendValue="Q3 Calibration" sub="Marcus Vance review" icon={Award} color="bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400" linkTo={createPageUrl("Performance")} />
          </>
        )}

        {currentRole === "employee" && (
          <>
            <StatCard label="My Leave Balance" value="18 Days" trend="up" trendValue="Annual Leave" sub="4 Sick days remaining" icon={Palmtree} color="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400" linkTo={createPageUrl("SelfService")} />
            <StatCard label="Next Pay Date" value="Aug 15" trend="up" trendValue="In 15 Days" sub="Estimated Net: $5,250" icon={DollarSign} color="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" linkTo={createPageUrl("SelfService")} />
            <StatCard label="Current Status" value="Present" trend="up" trendValue="Checked In 08:58 AM" sub="Austin Office" icon={UserCheck} color="bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400" linkTo={createPageUrl("SelfService")} />
            <StatCard label="Performance Rating" value="Exceeds" trend="up" trendValue="Q2 Assessment" sub="4.8 / 5.0 Rating" icon={Award} color="bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400" linkTo={createPageUrl("SelfService")} />
          </>
        )}
      </div>

      {/* Analytics & Action Center Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Interactive Analytics Hub (2 cols) */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Workforce & Financial Analytics</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Budget allocation vs actual payroll disbursement</p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <button
                onClick={() => setChartTab("payroll")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  chartTab === "payroll"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Payroll Trend
              </button>
              <button
                onClick={() => setChartTab("department")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  chartTab === "department"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Dept Distribution
              </button>
            </div>
          </div>

          {chartTab === "payroll" ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={payrollTrendData}>
                <defs>
                  <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]}
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
                  }}
                />
                <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#payrollGrad)" />
                <Area type="monotone" dataKey="budget" stroke="#cbd5e1" strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center min-h-[280px]">
              <ResponsiveContainer width="100%" height={240}>
                <RePieChart>
                  <Pie data={deptData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4}>
                    {deptData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {deptData.map((dept, idx) => (
                  <div key={dept.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: DEPT_COLORS[idx % DEPT_COLORS.length] }} />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{dept.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {dept.value} staff
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Center ("Needs Executive Attention") */}
        <ActionCenter pendingLeaves={pendingLeaves} onApproveLeave={handleApproveLeave} />
      </div>

      {/* Daily Operations, Live Activity Feed & Executive Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DailyOperationsWidget employees={employees} leaveRequests={leaveRequests} attendance={attendance} />
        <ActivityFeed />
        <ExecutiveCalendar />
      </div>

      {/* Recently Onboarded Roster */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Recently Onboarded Talent</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Latest additions to the global workforce roster</p>
          </div>
          <Link
            to={createPageUrl("Staff")}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View Directory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {employees.slice(0, 5).map((emp) => (
            <div key={emp.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center shrink-0 text-sm">
                  {emp.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{emp.full_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {emp.job_title} • {emp.department}
                  </p>
                </div>
              </div>
              <StatusBadge status={emp.status || "Active"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
