import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Search, ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle,
  Sparkles, Settings2, Calculator, Download, Check, ShieldAlert
} from "lucide-react";
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
import AbsenceConflictBanner from "../components/leave/AbsenceConflictBanner";
import { computeEntitled } from "@/utils/leaveBalance";

const STATUS_STYLE = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  Rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_ICON = {
  Pending: <Clock className="w-3 h-3" />,
  Approved: <CheckCircle2 className="w-3 h-3" />,
  Rejected: <XCircle className="w-3 h-3" />,
};

const TYPE_COLORS = {
  Annual: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
  "Annual Leave": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
  Sick: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300",
  "Sick Leave": "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300",
  Unpaid: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  Maternity: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300",
  Paternity: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300",
  Compassionate: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
  Study: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300",
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

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState(new Set());

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
    const created = await base44.entities.LeaveRequest.create({
      ...data,
      current_step: 1,
      total_steps: 3,
      approval_history: [
        { step: 1, action: "SUBMITTED", timestamp: new Date().toISOString(), user: data.employee_name }
      ]
    });
    setAddOpen(false);

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
    
    const req = requestObj || requests.find(r => r.id === id);
    const existingHist = req?.approval_history || [];
    const newHistItem = {
      step: req?.current_step || 1,
      action: status === "Approved" ? "APPROVED" : "REJECTED",
      timestamp: new Date().toISOString(),
      user: reviewedBy,
      notes: manager_notes || ""
    };

    await base44.entities.LeaveRequest.update(id, {
      status, manager_notes,
      reviewed_by: reviewedBy,
      reviewed_date: today,
      approval_history: [...existingHist, newHistItem]
    });

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
    }

    reload();
  };

  // Bulk actions
  const toggleSelectRow = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (filteredItems) => {
    const pendingItems = filteredItems.filter(r => r.status === 'Pending');
    const allSelected = pendingItems.length > 0 && pendingItems.every(r => selectedIds.has(r.id));
    
    if (allSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        pendingItems.forEach(r => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedIds(prev => new Set([...prev, ...pendingItems.map(r => r.id)]));
    }
  };

  const handleBulkDecision = async (status) => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    
    for (const id of ids) {
      const r = requests.find(req => req.id === id);
      if (r && r.status === 'Pending') {
        await handleDecision(id, status, "Bulk processed", r);
      }
    }
    setSelectedIds(new Set());
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ["Employee", "Department", "Leave Type", "Start Date", "End Date", "Days", "Status", "Reason"];
    const rows = filtered.map(r => [
      r.employee_name || "Unknown",
      r.department || "",
      r.leave_type || "",
      r.start_date || "",
      r.end_date || "",
      r.days_requested || r.total_days || 0,
      r.status || "Pending",
      (r.reason || "").replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leave-operations-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    const ms = !search || r.employee_name?.toLowerCase().includes(search.toLowerCase()) || r.reason?.toLowerCase().includes(search.toLowerCase());
    const ss = statusFilter === "All" || r.status === statusFilter;
    const ts = typeFilter === "All" || r.leave_type === typeFilter;
    return ms && ss && ts;
  });

  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const pendingSelectedCount = Array.from(selectedIds).filter(id => requests.find(r => r.id === id)?.status === 'Pending').length;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#DCE6F2] dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF3FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 shrink-0 shadow-2xs">
            <Clock size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#102A43] dark:text-white">Leave Operations Center</h2>
            <p className="text-xs sm:text-sm text-[#52677F] dark:text-slate-400 mt-0.5">
              {requests.length} total requests · {pendingCount} pending approvals · {policies.filter(p=>p.is_enabled).length} active policies
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap shrink-0">
          <Button onClick={exportCSV} variant="outline" className="gap-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button onClick={() => setAiOpen(true)} variant="outline" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300">
            <Sparkles className="w-4 h-4" /> AI Assistant
          </Button>
          <Button onClick={() => setAddOpen(true)} className="bg-[#2563EB] hover:bg-blue-700 text-white gap-2 shadow-xs cursor-pointer">
            <Plus className="w-4 h-4" /> New Leave Request
          </Button>
        </div>
      </div>

      {/* ── Departmental Absence Conflict Warning Banner ── */}
      <AbsenceConflictBanner requests={requests} employees={employees} />

      {/* ── Pending approvals banner ── */}
      <PendingApprovalsBanner
        pending={requests.filter(r => r.status === "Pending")}
        onReview={setReviewing}
        onQuickDecision={(id, status, notes) => handleDecision(id, status, notes)}
      />

      <Tabs defaultValue="requests">
        <TabsList className="bg-slate-100 dark:bg-slate-900 flex-wrap h-auto gap-1 p-1 rounded-xl">
          <TabsTrigger value="requests" className="rounded-lg text-xs px-4">Leave Requests</TabsTrigger>
          <TabsTrigger value="balances" className="rounded-lg text-xs px-4">Leave Balances & Accruals</TabsTrigger>
          <TabsTrigger value="calendar" className="rounded-lg text-xs px-4">Workforce Calendar</TabsTrigger>
          <TabsTrigger value="insights" className="rounded-lg text-xs px-4">Absence Analytics</TabsTrigger>
          <TabsTrigger value="policy" className="flex items-center gap-1.5 rounded-lg text-xs px-4">
            <Settings2 className="w-3.5 h-3.5" /> Policy Engine
          </TabsTrigger>
          <TabsTrigger value="accrual" className="flex items-center gap-1.5 rounded-lg text-xs px-4">
            <Calculator className="w-3.5 h-3.5" /> Accrual Config
          </TabsTrigger>
        </TabsList>

        {/* ── REQUESTS TAB ── */}
        <TabsContent value="requests" className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input className="pl-8 h-9 text-sm" placeholder="Search employee name or reason..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-sm w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
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

          {/* Bulk Action Bar */}
          {pendingSelectedCount > 0 && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/40 dark:border-indigo-800 px-4 py-3 animate-fade-in">
              <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                {pendingSelectedCount} pending request{pendingSelectedCount !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleBulkDecision('Approved')}>
                  <Check className="w-3.5 h-3.5 mr-1" /> Approve Selected
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleBulkDecision('Rejected')}>
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Reject Selected
                </Button>
                <button onClick={() => setSelectedIds(new Set())} className="text-xs text-slate-500 hover:underline px-2">
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">No leave requests found matching your filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50">
                      <th className="w-10 px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={filtered.filter(r => r.status === 'Pending').length > 0 && filtered.filter(r => r.status === 'Pending').every(r => selectedIds.has(r.id))}
                          onChange={() => toggleSelectAll(filtered)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </th>
                      <th className="text-left px-4 py-3.5">Employee</th>
                      <th className="text-left px-4 py-3.5">Type</th>
                      <th className="text-left px-4 py-3.5">Period</th>
                      <th className="text-center px-4 py-3.5">Days</th>
                      <th className="text-center px-4 py-3.5">Status & Step</th>
                      <th className="text-left px-4 py-3.5">Reason</th>
                      <th className="px-4 py-3.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => {
                      const daysVal = r.days_requested || r.total_days || 1;
                      const isPending = r.status === 'Pending';
                      return (
                        <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3.5 text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(r.id)}
                              disabled={!isPending}
                              onChange={() => toggleSelectRow(r.id)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-30"
                            />
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-slate-900 dark:text-white">{r.employee_name}</p>
                            <p className="text-xs text-slate-400">{r.department || 'General'}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge className={`text-xs border ${TYPE_COLORS[r.leave_type] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                              {r.leave_type}
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                            {r.start_date} → {r.end_date}
                          </td>
                          <td className="px-4 py-3.5 text-center font-semibold text-slate-800 dark:text-slate-200">
                            {daysVal}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="inline-flex flex-col items-center gap-0.5">
                              <Badge className={`text-xs border inline-flex items-center gap-1 ${STATUS_STYLE[r.status]}`}>
                                {STATUS_ICON[r.status]} {r.status}
                              </Badge>
                              {isPending && (
                                <span className="text-[10px] text-slate-400 font-medium">
                                  Step {r.current_step || 1} of 3 (Mgr Review)
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-xs max-w-[160px] truncate">
                            {r.reason || "—"}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            {isPending && (
                              <button onClick={() => setReviewing(r)} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap">
                                Review & Decide
                              </button>
                            )}
                            {r.manager_notes && !isPending && (
                              <span className="text-xs text-slate-400 italic truncate max-w-[120px] block" title={r.manager_notes}>
                                "{r.manager_notes}"
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-900 dark:text-white">{format(calMonth, "MMMM yyyy")}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setCalMonth(m => subMonths(m, 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800">
                  <ChevronLeft className="w-4 h-4 text-slate-500" />
                </button>
                <button onClick={() => setCalMonth(new Date())}
                  className="text-xs px-3 h-8 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">Today</button>
                <button onClick={() => setCalMonth(m => addMonths(m, 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800">
                  <ChevronRight className="w-4 h-4 text-slate-500" />
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
