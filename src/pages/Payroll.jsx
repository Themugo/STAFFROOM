import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Search, DollarSign, CheckCircle2, Clock, Banknote, Sparkles, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import PayrollModal from "../components/payroll/PayrollModal";
import AiChatPanel from "../components/shared/AiChatPanel";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const statusStyle = {
  Draft: "bg-gray-100 text-gray-600 border-gray-200",
  Approved: "bg-blue-50 text-blue-700 border-blue-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const statusIcon = {
  Draft: <Clock className="w-3 h-3" />,
  Approved: <CheckCircle2 className="w-3 h-3" />,
  Paid: <Banknote className="w-3 h-3" />,
};

export default function Payroll() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);

  const load = async () => {
    setLoadError(null);
    try {
      const [recs, emps] = await Promise.all([
        base44.entities.PayrollRecord.list("-pay_period_year"),
        base44.entities.Employee.list()
      ]);
      setRecords(recs);
      setEmployees(emps);
    } catch {
      setLoadError("Failed to load payroll data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r => {
    const matchSearch = !search || r.employee_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalNetPay = filtered.reduce((s, r) => s + (r.net_pay || 0), 0);
  const paidCount = records.filter(r => r.status === "Paid").length;
  const pendingCount = records.filter(r => r.status === "Draft" || r.status === "Approved").length;

  const handleSave = async (data) => {
    try {
      if (editing) {
        await base44.entities.PayrollRecord.update(editing.id, data);
      } else {
        await base44.entities.PayrollRecord.create(data);
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch {
      alert("Failed to save payroll record. Please try again.");
    }
  };

  const handleStatusChange = async (record, newStatus) => {
    try {
      await base44.entities.PayrollRecord.update(record.id, { status: newStatus });
      load();
    } catch {
      alert("Failed to update status. Please try again.");
    }
  };

  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [workflowResult, setWorkflowResult] = useState(null);

  const runAutoApprove = async () => {
    const drafts = records.filter(r => r.status === "Draft");
    if (!drafts.length) return;
    setWorkflowRunning(true);
    setWorkflowResult(null);
    // Auto-approve records with net_pay within reasonable range (no outliers)
    const netPays = drafts.map(r => r.net_pay || 0);
    const avg = netPays.reduce((a,b) => a+b, 0) / netPays.length;
    const threshold = avg * 2; // flag if > 2x average
    let approved = 0; let flagged = []; let failed = [];
    for (const r of drafts) {
      if ((r.net_pay || 0) > threshold && drafts.length > 1) {
        flagged.push(r.employee_name);
      } else {
        try {
          await base44.entities.PayrollRecord.update(r.id, { status: "Approved" });
          approved++;
        } catch {
          // Previously unhandled: one failed update here threw out of the
          // whole loop, leaving `workflowRunning` true forever (the button
          // gating on it stays disabled indefinitely) and silently
          // abandoning every record after the one that failed, with no
          // record of what did or didn't get approved.
          failed.push(r.employee_name);
        }
      }
    }
    setWorkflowResult({ approved, flagged, failed });
    setWorkflowRunning(false);
    load();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payroll</h2>
          <p className="text-sm text-gray-500 mt-0.5">{records.length} records total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={runAutoApprove} disabled={workflowRunning || records.filter(r=>r.status==="Draft").length===0}
            variant="outline" className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
            <Zap className="w-4 h-4" /> {workflowRunning ? "Processing…" : `Auto-Approve (${records.filter(r=>r.status==="Draft").length})`}
          </Button>
          <Button onClick={() => setAiOpen(true)} variant="outline" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50">
            <Sparkles className="w-4 h-4" /> AI Assistant
          </Button>
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}
            className="text-white gap-2" style={{ background: "#0F1B2D" }}>
            <Plus className="w-4 h-4" /> New Record
          </Button>
        </div>
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Filtered Net Pay</p>
            <p className="text-xl font-bold text-gray-900">${totalNetPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Paid Records</p>
            <p className="text-xl font-bold text-gray-900">{paidCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Pending</p>
            <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Workflow Result Banner */}
      {workflowResult && (
        <div className={`rounded-xl border p-4 flex items-start gap-3 ${workflowResult.failed.length ? "bg-red-50 border-red-200" : workflowResult.flagged.length ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
          {workflowResult.failed.length ? <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" /> : workflowResult.flagged.length ? <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />}
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {workflowResult.approved} record{workflowResult.approved !== 1 ? "s" : ""} auto-approved
              {workflowResult.flagged.length > 0 ? `, ${workflowResult.flagged.length} flagged for manual review` : ""}
              {workflowResult.failed.length > 0 ? `, ${workflowResult.failed.length} failed` : workflowResult.flagged.length === 0 ? " successfully" : ""}
            </p>
            {workflowResult.flagged.length > 0 && (
              <p className="text-xs text-amber-700 mt-0.5">Unusual amounts — requires manual review: {workflowResult.flagged.join(", ")}</p>
            )}
            {workflowResult.failed.length > 0 && (
              <p className="text-xs text-red-700 mt-0.5">Failed to approve (still Draft, please retry): {workflowResult.failed.join(", ")}</p>
            )}
          </div>
          <button onClick={() => setWorkflowResult(null)} className="ml-auto text-gray-400 hover:text-gray-600 text-xs">✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input className="pl-9" placeholder="Search by employee name…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-800 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg font-medium">No payroll records found</p>
          <p className="text-sm mt-1">Create your first payroll record.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Employee</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Period</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Base</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Bonus</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tax + Ded.</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Net Pay</th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{r.employee_name}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {MONTHS[(r.pay_period_month || 1) - 1]} {r.pay_period_year}
                    </td>
                    <td className="px-5 py-4 text-right text-gray-700">${(r.base_salary||0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-emerald-600">+${(r.bonus||0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-red-500">-${((r.tax||0)+(r.deductions||0)).toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-bold text-gray-900">${(r.net_pay||0).toLocaleString("en-US",{minimumFractionDigits:2})}</td>
                    <td className="px-5 py-4 text-center">
                      <Badge className={`text-xs border inline-flex items-center gap-1.5 ${statusStyle[r.status]||statusStyle.Draft}`}>
                        {statusIcon[r.status]} {r.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        {r.status === "Draft" && (
                          <button className="text-xs text-blue-600 hover:underline" onClick={() => handleStatusChange(r, "Approved")}>Approve</button>
                        )}
                        {r.status === "Approved" && (
                          <button className="text-xs text-emerald-600 hover:underline" onClick={() => handleStatusChange(r, "Paid")}>Mark Paid</button>
                        )}
                        <button className="text-xs text-gray-400 hover:text-gray-700" onClick={() => { setEditing(r); setModalOpen(true); }}>Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <PayrollModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave} record={editing} employees={employees} />

      {aiOpen && (
        <AiChatPanel
          agentName="payroll_assistant"
          title="Payroll Assistant"
          subtitle="AI-powered payroll help & calculations"
          suggestions={[
            "Summarize pending payroll records",
            "What's the total payroll cost this month?",
            "How do I calculate overtime pay?",
            "Show payroll breakdown by department",
          ]}
          onClose={() => setAiOpen(false)}
        />
      )}
    </div>
  );
}