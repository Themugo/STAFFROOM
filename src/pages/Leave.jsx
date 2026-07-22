import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle, Sparkles, Settings2, Calculator } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import LeaveRequestModal from "../components/leave/LeaveRequestModal";
import ReviewModal from "../components/leave/ReviewModal";
import TeamCalendar from "../components/leave/TeamCalendar";
import AiAssistantPanel from "../components/leave/AiAssistantPanel";
import LeaveInsights from "../components/leave/LeaveInsights";
import LeavePolicyTab from "../components/leave/LeavePolicyTab";
import LeaveBalancesTab from "../components/leave/LeaveBalancesTab";
import AccrualConfigTab from "../components/leave/accrual/AccrualConfigTab";
import PendingApprovalsBanner from "../components/leave/PendingApprovalsBanner";
import { computeEntitled } from "@/utils/leaveBalance";

const STATUS_STYLE = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};
const STATUS_ICON = {
  Pending: <Clock className="w-3 h-3" />,
  Approved: <CheckCircle2 className="w-3 h-3" />,
  Rejected: <XCircle className="w-3 h-3" />,
};

const TYPE_COLORS = {
  Annual: "bg-blue-50 text-blue-700 border-blue-200",
  Sick: "bg-red-50 text-red-700 border-red-200",
  Unpaid: "bg-gray-100 text-gray-600 border-gray-200",
  Maternity: "bg-pink-50 text-pink-700 border-pink-200",
  Paternity: "bg-violet-50 text-violet-700 border-violet-200",
  Compassionate: "bg-amber-50 text-amber-700 border-amber-200",
  Study: "bg-teal-50 text-teal-700 border-teal-200",
};

export default function Leave() {
  const [requests, setRequests] = useState([]);
  const [balances, setBalances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [accrualRules, setAccrualRules] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [reviewing, setReviewing] = useState(null);
  const [calMonth, setCalMonth] = useState(new Date());
  const [aiOpen, setAiOpen] = useState(false);

  const loadAll = () => {
    setLoadError(null);
    return Promise.all([
      base44.entities.LeaveRequest.list("-created_date"),
      base44.entities.LeaveBalance.list(),
      base44.entities.Employee.list(),
      base44.entities.LeavePolicy.list(),
      base44.entities.LeaveAccrual.list(),
      base44.auth.me().catch(() => null),
    ]).then(([reqs, bals, emps, pols, accruals, user]) => {
      setRequests(reqs);
      setBalances(bals);
      setEmployees(emps);
      setPolicies(pols);
      setAccrualRules(accruals);
      setCurrentUser(user);
    }).catch(() => {
      setLoadError("Failed to load leave data. Please try again.");
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { loadAll(); }, []);

  const reload = () => base44.entities.LeaveRequest.list("-created_date").then(setRequests).catch(() => {});

  const handleSave = async (data) => {
    const created = await base44.entities.LeaveRequest.create(data);
    setAddOpen(false);

    // Log notification record for new submission
    await base44.entities.ApprovalNotification.create({
      leave_request_id: created.id,
      employee_id: data.employee_id,
      employee_name: data.employee_name,
      employee_email: data.employee_email || "",
      leave_type: data.leave_type,
      start_date: data.start_date,
      end_date: data.end_date,
      days_requested: data.days_requested,
      reason: data.reason || "",
      action: "submitted",
      email_sent: false,
    });

    reload();
  };

  const handleDecision = async (id, status, manager_notes, requestObj) => {
    const today = new Date().toISOString().split("T")[0];
    const reviewedBy = currentUser?.full_name || currentUser?.email || "Manager";
    await base44.entities.LeaveRequest.update(id, {
      status, manager_notes,
      reviewed_by: reviewedBy,
      reviewed_date: today,
    });

    // Log approval notification record
    const req = requestObj || requests.find(r => r.id === id);
    if (req) {
      await base44.entities.ApprovalNotification.create({
        leave_request_id: id,
        employee_id: req.employee_id,
        employee_name: req.employee_name,
        employee_email: req.employee_email || "",
        manager_email: currentUser?.email || "",
        leave_type: req.leave_type,
        start_date: req.start_date,
        end_date: req.end_date,
        days_requested: req.days_requested,
        reason: req.reason || "",
        action: status === "Approved" ? "approved" : "rejected",
        manager_notes: manager_notes || "",
        reviewed_by: reviewedBy,
        email_sent: false,
      });

      // Send email notification to employee if email is available
      if (req.employee_email) {
        const verb = status === "Approved" ? "approved" : "rejected";
        const emoji = status === "Approved" ? "✅" : "❌";
        base44.integrations.Core.SendEmail({
          to: req.employee_email,
          subject: `${emoji} Your ${req.leave_type} leave request has been ${verb}`,
          body: `Hi ${req.employee_name},\n\nYour ${req.leave_type} leave request from ${req.start_date} to ${req.end_date} (${req.days_requested} day${req.days_requested !== 1 ? "s" : ""}) has been <strong>${verb}</strong> by ${reviewedBy}.\n\n${manager_notes ? `Manager notes: ${manager_notes}\n\n` : ""}Please log in to the HR portal for more details.\n\nBest regards,\nHR Team`,
        }).catch(() => null); // fire and forget
      }
    }

    reload();
  };

  const handleSavePolicy = async (data) => {
    if (data.id) {
      await base44.entities.LeavePolicy.update(data.id, data);
    } else {
      await base44.entities.LeavePolicy.create(data);
    }
    base44.entities.LeavePolicy.list().then(setPolicies);
  };

  const handleDeletePolicy = async (id) => {
    await base44.entities.LeavePolicy.delete(id);
    base44.entities.LeavePolicy.list().then(setPolicies);
  };

  const handleSaveAccrualRule = async (data) => {
    if (data.id) await base44.entities.LeaveAccrual.update(data.id, data);
    else await base44.entities.LeaveAccrual.create(data);
    base44.entities.LeaveAccrual.list().then(setAccrualRules);
  };

  const handleDeleteAccrualRule = async (id) => {
    await base44.entities.LeaveAccrual.delete(id);
    base44.entities.LeaveAccrual.list().then(setAccrualRules);
  };

  // Recalculate accruals: update LeaveBalance entries for each employee
  const handleRunAccrual = async () => {
    const year = new Date().getFullYear();
    for (const emp of employees.filter(e => e.status !== "Terminated")) {
      const existing = balances.find(b => b.employee_id === emp.id && b.year === year);
      const newBalances = policies.filter(p => p.is_enabled).map(p => {
        const entry = existing?.balances?.find(b => b.leave_type === p.leave_type) || {};
        return {
          leave_type: p.leave_type,
          entitled: computeEntitled(p, emp, accrualRules),
          used: entry.used || 0,
          carried_over: entry.carried_over || 0,
          pending: entry.pending || 0,
          last_accrual_month: new Date().getMonth() + 1,
        };
      });
      const payload = { employee_id: emp.id, employee_name: emp.full_name, year, balances: newBalances };
      if (existing) {
        await base44.entities.LeaveBalance.update(existing.id, payload);
      } else {
        await base44.entities.LeaveBalance.create(payload);
      }
    }
    base44.entities.LeaveBalance.list().then(setBalances);
  };

  const allTypes = ["All", ...new Set(requests.map(r => r.leave_type).filter(Boolean))];

  const filtered = requests.filter(r => {
    const ms = !search || r.employee_name?.toLowerCase().includes(search.toLowerCase());
    const ss = statusFilter === "All" || r.status === statusFilter;
    const ts = typeFilter === "All" || r.leave_type === typeFilter;
    return ms && ss && ts;
  });

  const pendingCount = requests.filter(r => r.status === "Pending").length;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
    </div>
  );

  if (loadError) return (
    <div className="text-center py-20">
      <p className="text-sm font-medium text-red-600">{loadError}</p>
      <button onClick={() => { setLoading(true); loadAll(); }} className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors">
        Retry
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-xs text-gray-400 mt-0.5">{requests.length} total requests · {pendingCount} pending · {policies.filter(p=>p.is_enabled).length} active leave types</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setAiOpen(true)} variant="outline" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50">
            <Sparkles className="w-4 h-4" /> AI Assistant
          </Button>
          <Button onClick={() => setAddOpen(true)} className="text-white gap-2" style={{ background: "#0F1B2D" }}>
            <Plus className="w-4 h-4" /> New Request
          </Button>
        </div>
      </div>

      {/* ── Pending approvals banner ── */}
      <PendingApprovalsBanner
        pending={requests.filter(r => r.status === "Pending")}
        onReview={setReviewing}
        onQuickDecision={(id, status, notes) => handleDecision(id, status, notes)}
      />

      <Tabs defaultValue="requests">
        <TabsList className="bg-gray-100 flex-wrap h-auto gap-1">
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="balances">Leave Balances</TabsTrigger>
          <TabsTrigger value="calendar">Team Calendar</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="policy" className="flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5" /> Policy Settings
          </TabsTrigger>
          <TabsTrigger value="accrual" className="flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" /> Accrual Config
          </TabsTrigger>
        </TabsList>

        {/* ── REQUESTS TAB ── */}
        <TabsContent value="requests" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <Input className="pl-8 h-9 text-sm" placeholder="Search employee…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-sm w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 text-sm w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {allTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">No leave requests found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-50 text-xs text-gray-400 font-medium bg-gray-50">
                      <th className="text-left px-5 py-3">Employee</th>
                      <th className="text-left px-4 py-3">Type</th>
                      <th className="text-left px-4 py-3">Period</th>
                      <th className="text-center px-4 py-3">Days</th>
                      <th className="text-center px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3">Reason</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => (
                      <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900">{r.employee_name}</p>
                          <p className="text-xs text-gray-400">{r.department}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`text-xs border ${TYPE_COLORS[r.leave_type] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                            {r.leave_type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{r.start_date} → {r.end_date}</td>
                        <td className="px-4 py-3 text-center font-semibold text-gray-800">{r.days_requested}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={`text-xs border inline-flex items-center gap-1 ${STATUS_STYLE[r.status]}`}>
                            {STATUS_ICON[r.status]} {r.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs max-w-[160px] truncate">{r.reason || "—"}</td>
                        <td className="px-4 py-3">
                          {r.status === "Pending" && (
                            <button onClick={() => setReviewing(r)} className="text-xs text-blue-600 hover:underline whitespace-nowrap">Review</button>
                          )}
                          {r.manager_notes && r.status !== "Pending" && (
                            <span className="text-xs text-gray-300 italic truncate max-w-[100px] block" title={r.manager_notes}>"{r.manager_notes}"</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── BALANCES TAB ── */}
        <TabsContent value="balances" className="mt-4">
          <LeaveBalancesTab
            employees={employees}
            requests={requests}
            policies={policies}
            balances={balances}
            accrualRules={accrualRules}
            onRunAccrual={handleRunAccrual}
          />
        </TabsContent>

        {/* ── TEAM CALENDAR TAB ── */}
        <TabsContent value="calendar" className="mt-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">{format(calMonth, "MMMM yyyy")}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setCalMonth(m => subMonths(m, 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
                <button onClick={() => setCalMonth(new Date())}
                  className="text-xs px-3 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">Today</button>
                <button onClick={() => setCalMonth(m => addMonths(m, 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <TeamCalendar requests={requests} month={calMonth} employees={employees} />
          </div>
        </TabsContent>

        {/* ── AI INSIGHTS TAB ── */}
        <TabsContent value="insights" className="mt-4">
          <LeaveInsights requests={requests} employees={employees} />
        </TabsContent>

        {/* ── POLICY SETTINGS TAB ── */}
        <TabsContent value="policy" className="mt-4">
          <LeavePolicyTab
            policies={policies}
            onSave={handleSavePolicy}
            onDelete={handleDeletePolicy}
          />
        </TabsContent>

        {/* ── ACCRUAL CONFIG TAB ── */}
        <TabsContent value="accrual" className="mt-4">
          <AccrualConfigTab
            rules={accrualRules}
            onSave={handleSaveAccrualRule}
            onDelete={handleDeleteAccrualRule}
          />
        </TabsContent>
      </Tabs>

      {aiOpen && <AiAssistantPanel onClose={() => setAiOpen(false)} />}

      <LeaveRequestModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleSave}
        employees={employees}
        currentUser={currentUser}
        policies={policies}
      />

      <ReviewModal
        open={!!reviewing}
        onClose={() => setReviewing(null)}
        request={reviewing}
        onDecision={handleDecision}
        balances={balances}
        policies={policies}
        employees={employees}
        requests={requests}
        accrualRules={accrualRules}
      />
    </div>
  );
}