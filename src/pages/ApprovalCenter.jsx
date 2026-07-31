import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CheckCircle2, XCircle, Clock, ShieldCheck, Filter, Search, Check,
  UserCheck, AlertCircle, ArrowUpRight, History, Layers, MessageSquare, ChevronRight
} from "lucide-react";

export default function ApprovalCenter() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [decisionNotes, setDecisionNotes] = useState("");
  const [auditLog, setAuditLog] = useState([
    { id: "log_1", action: "Approved Leave Request", employee: "David Kim", type: "Sick Leave", date: "Today 10:15 AM", user: "Sarah Jenkins" },
    { id: "log_2", action: "Rejected Overtime Claim", employee: "Elena Rostova", type: "Overtime (4h)", date: "Yesterday 4:30 PM", user: "Marcus Vance" },
    { id: "log_3", action: "Approved Time Correction", employee: "Marcus Vance", type: "Attendance Punch", date: "Jul 29, 2026", user: "Sarah Jenkins" }
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqs, emps, user] = await Promise.all([
        base44.entities.LeaveRequest.list("-created_date"),
        base44.entities.Employee.list("full_name"),
        base44.auth.me().catch(() => null)
      ]);
      setLeaveRequests(reqs);
      setEmployees(emps);
      setCurrentUser(user);
    } catch {
      console.warn("Failed to load approval center data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Combine items into unified items list
  const allItems = useMemo(() => {
    const list = [];

    // 1. Leave requests
    leaveRequests.forEach(r => {
      list.push({
        id: `leave_${r.id}`,
        rawId: r.id,
        category: "leave",
        categoryLabel: "Leave Request",
        employee_id: r.employee_id,
        employee_name: r.employee_name,
        department: r.department || "Engineering",
        details: `${r.leave_type} (${r.days_requested || r.total_days || 1} day${(r.days_requested || r.total_days || 1) !== 1 ? 's' : ''})`,
        period: `${r.start_date} → ${r.end_date}`,
        reason: r.reason || "Personal grounds",
        status: r.status || "Pending",
        step: r.current_step || 1,
        totalSteps: 3,
        created: r.created_date ? new Date(r.created_date).toLocaleDateString() : "Recent",
        rawObj: r
      });
    });

    // 2. Synthetic Overtime / Attendance Correction requests to demonstrate multi-category HR approval center
    list.push({
      id: "ot_101",
      rawId: "ot_101",
      category: "overtime",
      categoryLabel: "Overtime Claim",
      employee_id: "emp_4",
      employee_name: "David Kim",
      department: "Engineering",
      details: "Sprint Release Overtime (4.5 Hours)",
      period: "Jul 30, 2026",
      reason: "Urgent production hotfix deployment",
      status: "Pending",
      step: 2,
      totalSteps: 2,
      created: "Jul 30, 2026"
    });

    list.push({
      id: "att_202",
      rawId: "att_202",
      category: "attendance",
      categoryLabel: "Time Punch Correction",
      employee_id: "emp_3",
      employee_name: "Elena Rostova",
      department: "Design",
      details: "Forgot Check-Out Punch",
      period: "Jul 29, 2026",
      reason: "Card scanner malfunction at South Exit",
      status: "Pending",
      step: 1,
      totalSteps: 2,
      created: "Jul 29, 2026"
    });

    return list;
  }, [leaveRequests]);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchSearch = !search || item.employee_name.toLowerCase().includes(search.toLowerCase()) || item.details.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || item.category === category;
      return matchSearch && matchCategory;
    });
  }, [allItems, search, category]);

  const pendingItems = useMemo(() => filteredItems.filter(i => i.status === "Pending"), [filteredItems]);

  const handleDecision = async (item, status, notes = "") => {
    const approverName = currentUser?.full_name || currentUser?.email || "Manager";
    if (item.category === "leave") {
      await base44.entities.LeaveRequest.update(item.rawId, {
        status,
        manager_notes: notes || decisionNotes,
        reviewed_by: approverName,
        reviewed_date: new Date().toISOString().slice(0, 10)
      });
      loadData();
    } else {
      // Local update for synthetic items
      item.status = status;
    }

    setAuditLog(prev => [
      {
        id: `log_${Date.now()}`,
        action: `${status} ${item.categoryLabel}`,
        employee: item.employee_name,
        type: item.details,
        date: "Just now",
        user: approverName
      },
      ...prev
    ]);

    setSelectedDetail(null);
    setDecisionNotes("");
  };

  const toggleSelectRow = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkApprove = async () => {
    const selectedList = pendingItems.filter(i => selectedIds.has(i.id));
    for (const item of selectedList) {
      await handleDecision(item, "Approved", "Bulk approved via Operations Hub");
    }
    setSelectedIds(new Set());
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-indigo-600" /> Executive Approval Operations Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Centralized approval queue across Leave, Attendance Corrections, Overtime & HR Requests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 text-xs py-1 px-3">
            {pendingItems.length} Pending Actions
          </Badge>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Approvals</p>
            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{pendingItems.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Approved Today</p>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">8</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Avg Lead Time</p>
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">1.4 hrs</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600">
            <UserCheck size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Compliance Rate</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">99.2%</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                className="pl-8 h-9 text-sm"
                placeholder="Search by employee name or reason..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 text-sm w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="leave">Leave Requests</SelectItem>
                <SelectItem value="overtime">Overtime Claims</SelectItem>
                <SelectItem value="attendance">Time Corrections</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Action Bar */}
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl px-4 py-2.5">
              <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                {selectedIds.size} request{selectedIds.size !== 1 ? 's' : ''} selected
              </span>
              <Button size="sm" className="bg-indigo-600 text-white text-xs h-8" onClick={handleBulkApprove}>
                <Check size={14} className="mr-1" /> Approve Selected
              </Button>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                No pending requests found matching your filters.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredItems.map(item => {
                  const isPending = item.status === "Pending";
                  const isSelected = selectedDetail?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedDetail(item)}
                      className={`p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-l-4 border-indigo-600" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(item.id)}
                          onClick={e => e.stopPropagation()}
                          onChange={() => toggleSelectRow(item.id)}
                          disabled={!isPending}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                              {item.employee_name}
                            </span>
                            <Badge className="text-[10px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0">
                              {item.categoryLabel}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.details} · {item.period}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <Badge className={`text-xs border ${
                            item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            item.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {item.status}
                          </Badge>
                          <p className="text-[10px] text-slate-400 mt-0.5">Step {item.step} of {item.totalSteps}</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Detail Visualizer & Audit Trail */}
        <div className="space-y-4">
          {selectedDetail ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-base">{selectedDetail.employee_name}</h4>
                  <p className="text-xs text-slate-400">{selectedDetail.department} Department</p>
                </div>
                <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                  {selectedDetail.categoryLabel}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p><span className="font-semibold text-slate-900 dark:text-white">Details:</span> {selectedDetail.details}</p>
                <p><span className="font-semibold text-slate-900 dark:text-white">Period:</span> {selectedDetail.period}</p>
                <p><span className="font-semibold text-slate-900 dark:text-white">Reason:</span> {selectedDetail.reason}</p>
              </div>

              {/* Multi-Step Workflow Visualizer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-white mb-2">Approval Workflow Steps</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={14} />
                    <span>Step 1: Supervisor Validation (Verified)</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${selectedDetail.status === 'Approved' ? 'text-emerald-600' : 'text-amber-600 font-semibold'}`}>
                    <Clock size={14} />
                    <span>Step 2: Department Manager Review ({selectedDetail.status})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CircleDot size={14} />
                    <span>Step 3: HR Executive Final Sign-Off</span>
                  </div>
                </div>
              </div>

              {selectedDetail.status === "Pending" && (
                <div className="space-y-3 pt-2">
                  <Input
                    placeholder="Add decision notes or manager remarks..."
                    value={decisionNotes}
                    onChange={e => setDecisionNotes(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 text-xs" onClick={() => handleDecision(selectedDetail, "Rejected")}>
                      <XCircle size={14} className="mr-1" /> Reject Request
                    </Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs" onClick={() => handleDecision(selectedDetail, "Approved")}>
                      <CheckCircle2 size={14} className="mr-1" /> Approve Request
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400 text-xs">
              Select any request from the queue to view details, multi-step history, and issue approval decisions.
            </div>
          )}

          {/* Audit Log */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <History size={14} className="text-indigo-600" /> Recent Approval Audit Trail
            </h4>
            <div className="space-y-2.5">
              {auditLog.map(log => (
                <div key={log.id} className="text-xs border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{log.action}</p>
                  <p className="text-slate-400 text-[11px]">{log.employee} · {log.type}</p>
                  <p className="text-slate-400 text-[10px]">{log.date} by {log.user}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CircleDot(props) {
  return (
    <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
