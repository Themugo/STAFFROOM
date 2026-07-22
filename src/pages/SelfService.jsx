import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { User, DollarSign, CalendarDays, Heart, FileText, Plus, Clock } from "lucide-react";
import { eachDayOfInterval, isWeekend, parseISO } from "date-fns";
import { computeLiveBalance, resolveAccrualRule } from "@/utils/leaveBalance";

const LEAVE_TYPES = ["Annual", "Sick", "Unpaid", "Maternity", "Paternity", "Compassionate", "Study"];

const LEAVE_STATUS_COLORS = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Previously computed raw calendar days ((end - start) in ms, +1), which
// counts weekends as full leave days. The HR-facing LeaveRequestModal.jsx
// counts business days only (via eachDayOfInterval + isWeekend), which
// means the exact same start/end date range submitted through this
// self-service form vs. that one produced a *different* days_requested
// value — e.g. a Friday-to-Monday request came out to 4 days here but 2
// days there, silently deducting more (or less) from the same employee's
// balance depending only on which form they happened to use. Matched to
// the same business-days-only logic so both agree.
function calcDays(start, end) {
  if (!start || !end || end < start) return 0;
  return eachDayOfInterval({ start: parseISO(start), end: parseISO(end) }).filter(d => !isWeekend(d)).length;
}

export default function SelfService() {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [leaveAccrualRules, setLeaveAccrualRules] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ leave_type: "Annual", start_date: "", end_date: "", reason: "" });

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const me = await base44.auth.me();
      setUser(me);

      // Find employee record by email
      const employees = await base44.entities.Employee.list("full_name");
      const emp = employees.find(e => e.email?.toLowerCase() === me.email?.toLowerCase());
      setEmployee(emp);

      if (emp) {
        const [leaves, balances, pays, bens, docs, att, policies, accrualRules] = await Promise.all([
          base44.entities.LeaveRequest.filter({ employee_id: emp.id }, "-start_date"),
          base44.entities.LeaveBalance.filter({ employee_id: emp.id }),
          base44.entities.PayrollRecord.filter({ employee_id: emp.id }, "-pay_period_year", 12),
          base44.entities.BenefitEnrollment.filter({ employee_id: emp.id }),
          base44.entities.EmployeeDocument.filter({ employee_id: emp.id }),
          base44.entities.AttendanceRecord.filter({ employee_id: emp.id }, "-date", 30),
          base44.entities.LeavePolicy.list(),
          base44.entities.LeaveAccrual.list(),
        ]);
        setLeaveRequests(leaves);
        setLeaveBalance(balances.find(b => b.year === new Date().getFullYear()) || null);
        setPayslips(pays);
        setBenefits(bens);
        setDocuments(docs);
        setAttendance(att);
        setLeavePolicies(policies);
        setLeaveAccrualRules(accrualRules);
      }
    } catch {
      setLoadError("Failed to load your data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const [leaveSubmitError, setLeaveSubmitError] = useState(null);

  const submitLeave = async () => {
    if (!employee) return;
    const days = calcDays(leaveForm.start_date, leaveForm.end_date);
    if (!leaveForm.start_date || !leaveForm.end_date) {
      setLeaveSubmitError("Please select a start and end date.");
      return;
    }
    if (days === 0) {
      // days can be 0 either because the range is weekend-only, or because
      // end_date is before start_date — the date inputs don't have a `min`
      // constraint tying end to start, so the browser doesn't prevent
      // picking a backwards range on its own.
      setLeaveSubmitError(
        leaveForm.end_date < leaveForm.start_date
          ? "End date can't be before the start date."
          : "Selected range doesn't include any working days."
      );
      return;
    }
    setLeaveSubmitError(null);
    try {
      await base44.entities.LeaveRequest.create({
        employee_id: employee.id,
        employee_name: employee.full_name,
        employee_email: employee.email,
        department: employee.department,
        leave_type: leaveForm.leave_type,
        start_date: leaveForm.start_date,
        end_date: leaveForm.end_date,
        days_requested: days,
        reason: leaveForm.reason,
        status: "Pending",
      });
      setLeaveModalOpen(false);
      setLeaveForm({ leave_type: "Annual", start_date: "", end_date: "", reason: "" });
      load();
    } catch {
      setLeaveSubmitError("Failed to submit leave request. Please try again.");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" /></div>;

  if (loadError) return (
    <div className="max-w-xl mx-auto mt-16 text-center">
      <p className="text-sm font-medium text-red-600">{loadError}</p>
      <button onClick={load} className="mt-3 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors">
        Retry
      </button>
    </div>
  );

  if (!employee) return (
    <div className="max-w-xl mx-auto mt-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <User className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Employee Profile Not Found</h2>
      <p className="text-gray-500 text-sm">No employee record matches your email address ({user?.email}). Please contact HR to link your account.</p>
    </div>
  );

  const currentMonthAtt = attendance.filter(a => a.date?.startsWith(new Date().toISOString().slice(0,7)));
  const presentDays = currentMonthAtt.filter(a => ["Present", "Remote", "Late"].includes(a.status)).length;
  const lateDays = currentMonthAtt.filter(a => a.status === "Late").length;

  // Live-computed leave balances (the LeaveBalance entity stores balances as an
  // array of { leave_type, entitled, ... } entries, not flat annual_total /
  // sick_total fields, so we derive these from the current policy/accrual
  // rule + requests rather than reading fields that don't exist on the record).
  const annualPolicy = leavePolicies.find(p => p.leave_type === "Annual" && p.is_enabled)
    || (resolveAccrualRule(leaveAccrualRules, "Annual", employee) ? { leave_type: "Annual", is_enabled: true } : null);
  const sickPolicy = leavePolicies.find(p => p.leave_type === "Sick" && p.is_enabled)
    || (resolveAccrualRule(leaveAccrualRules, "Sick", employee) ? { leave_type: "Sick", is_enabled: true } : null);
  const storedAnnual = leaveBalance?.balances?.find(b => b.leave_type === "Annual");
  const storedSick = leaveBalance?.balances?.find(b => b.leave_type === "Sick");
  const annualBalance = annualPolicy
    ? computeLiveBalance({ policy: annualPolicy, employee, requests: leaveRequests, storedBalance: storedAnnual, accrualRules: leaveAccrualRules })
    : null;
  const sickBalance = sickPolicy
    ? computeLiveBalance({ policy: sickPolicy, employee, requests: leaveRequests, storedBalance: storedSick, accrualRules: leaveAccrualRules })
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0" style={{ background: "#0F1B2D" }}>
          {employee.full_name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{employee.full_name}</h2>
          <p className="text-sm text-gray-500">{employee.job_title} · {employee.department}</p>
          <p className="text-xs text-gray-400 mt-0.5">{employee.email} · Joined {employee.start_date || "—"}</p>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1">
          <Badge className={employee.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}>{employee.status || "Active"}</Badge>
          <span className="text-xs text-gray-400">{employee.employment_type}</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: CalendarDays, label: "Annual Leave Left", value: annualBalance ? (annualBalance.isUnlimited ? "Unlimited" : `${annualBalance.remaining.toFixed(1)} days`) : "—", color: "bg-blue-50 text-blue-600" },
          { icon: Clock, label: "Days Present (Month)", value: `${presentDays} days`, color: "bg-emerald-50 text-emerald-600" },
          { icon: DollarSign, label: "Base Salary", value: employee.base_salary ? `$${employee.base_salary.toLocaleString()}` : "—", color: "bg-amber-50 text-amber-600" },
          { icon: Heart, label: "Active Benefits", value: benefits.filter(b => b.status === "Active").length, color: "bg-pink-50 text-pink-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="leave">
        <TabsList className="bg-gray-100 rounded-xl p-1 flex-wrap h-auto">
          <TabsTrigger value="leave" className="rounded-lg text-xs px-4">Leave</TabsTrigger>
          <TabsTrigger value="payslips" className="rounded-lg text-xs px-4">Payslips</TabsTrigger>
          <TabsTrigger value="benefits" className="rounded-lg text-xs px-4">Benefits</TabsTrigger>
          <TabsTrigger value="attendance" className="rounded-lg text-xs px-4">Attendance</TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg text-xs px-4">Documents</TabsTrigger>
        </TabsList>

        {/* LEAVE */}
        <TabsContent value="leave" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">My Leave Requests</p>
            <Button size="sm" onClick={() => setLeaveModalOpen(true)} className="text-white text-xs gap-1.5" style={{ background: "#0F1B2D" }}>
              <Plus className="w-3.5 h-3.5" /> Request Leave
            </Button>
          </div>

          {/* Leave balance bars */}
          {(annualBalance || sickBalance) && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Annual Leave", balance: annualBalance, color: "#6366f1" },
                { label: "Sick Leave", balance: sickBalance, color: "#ef4444" },
              ].filter(lb => lb.balance).map(lb => {
                const { used, totalEntitled, isUnlimited } = lb.balance;
                const pct = isUnlimited ? 0 : totalEntitled > 0 ? Math.min(100, (used / totalEntitled) * 100) : 0;
                return (
                  <div key={lb.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-gray-700">{lb.label}</span>
                      <span className="text-gray-400">{isUnlimited ? "Unlimited" : `${used} / ${totalEntitled.toFixed(1)} used`}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: lb.color }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {isUnlimited ? "No cap" : `${lb.balance.remaining.toFixed(1)} days remaining`}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {leaveRequests.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">No leave requests yet.</p></div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-semibold uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-left px-4 py-3">Dates</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Days</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr></thead>
                <tbody>
                  {leaveRequests.map(r => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-800">{r.leave_type}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{r.start_date} → {r.end_date}</td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{r.days_requested}d</td>
                      <td className="px-4 py-3"><Badge className={`text-xs border ${LEAVE_STATUS_COLORS[r.status] || ""}`}>{r.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* PAYSLIPS */}
        <TabsContent value="payslips" className="mt-4">
          {payslips.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><DollarSign className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">No payslips found.</p></div>
          ) : (
            <div className="space-y-3">
              {payslips.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{MONTHS[(p.pay_period_month||1)-1]} {p.pay_period_year}</p>
                      <p className="text-xs text-gray-400">Base: ${(p.base_salary||0).toLocaleString()} · Bonus: +${(p.bonus||0).toLocaleString()} · Deductions: -${((p.tax||0)+(p.deductions||0)).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${(p.net_pay||0).toLocaleString("en-US",{minimumFractionDigits:2})}</p>
                    <Badge className={p.status === "Paid" ? "bg-emerald-50 text-emerald-700" : p.status === "Approved" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}>{p.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* BENEFITS */}
        <TabsContent value="benefits" className="mt-4">
          {benefits.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><Heart className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">No benefit enrollments found.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map(b => (
                <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{{ "Health Insurance":"🏥","Dental":"🦷","Vision":"👁️","Life Insurance":"🛡️","401k / Pension":"💰","Gym Membership":"💪","Remote Work Stipend":"🏠","Education Allowance":"📚","Other":"✨" }[b.benefit_type] || "✨"}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{b.benefit_type}</p>
                        {b.plan_name && <p className="text-xs text-gray-400">{b.plan_name}</p>}
                      </div>
                    </div>
                    <Badge className={b.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>{b.status}</Badge>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 mt-3">
                    <p>Coverage: <span className="font-medium text-gray-700">{b.coverage_level}</span></p>
                    {b.monthly_cost && <p>Your cost: <span className="font-medium text-gray-700">${b.monthly_cost}/mo</span></p>}
                    {b.employer_contribution && <p>Employer covers: <span className="font-medium text-emerald-700">${b.employer_contribution}/mo</span></p>}
                    {b.effective_date && <p>Effective: <span className="font-medium text-gray-700">{b.effective_date}</span></p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ATTENDANCE */}
        <TabsContent value="attendance" className="mt-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: "Present (30d)", value: presentDays, color: "text-emerald-600" },
              { label: "Late (30d)", value: lateDays, color: "text-amber-600" },
              { label: "Absent (30d)", value: currentMonthAtt.filter(a => a.status === "Absent").length, color: "text-red-500" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          {attendance.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><Clock className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">No attendance records found.</p></div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-semibold uppercase">
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-4 py-3">Check In</th>
                  <th className="text-left px-4 py-3">Check Out</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr></thead>
                <tbody>
                  {attendance.map(a => (
                    <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-gray-700">{a.date}</td>
                      <td className="px-4 py-3 text-gray-500">{a.check_in || "—"}</td>
                      <td className="px-4 py-3 text-gray-500">{a.check_out || "—"}</td>
                      <td className="px-4 py-3">
                        <Badge className={{ Present:"bg-emerald-50 text-emerald-700",Late:"bg-amber-50 text-amber-700",Absent:"bg-red-50 text-red-700",Remote:"bg-violet-50 text-violet-700","Half Day":"bg-blue-50 text-blue-700" }[a.status] || ""}>{a.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* DOCUMENTS */}
        <TabsContent value="documents" className="mt-4">
          {documents.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><FileText className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">No documents found.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.map(d => (
                <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{d.document_name}</p>
                    <p className="text-xs text-gray-400">{d.document_type}{d.expiry_date ? ` · Expires: ${d.expiry_date}` : ""}</p>
                  </div>
                  {d.file_url && (
                    <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex-shrink-0">View</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Leave request modal */}
      <Dialog open={leaveModalOpen} onOpenChange={setLeaveModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Request Leave</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Leave Type</Label>
              <Select value={leaveForm.leave_type} onValueChange={v => setLeaveForm(f => ({ ...f, leave_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{LEAVE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start Date *</Label>
                <Input type="date" value={leaveForm.start_date} onChange={e => setLeaveForm(f => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date *</Label>
                <Input type="date" value={leaveForm.end_date} min={leaveForm.start_date || undefined} onChange={e => setLeaveForm(f => ({ ...f, end_date: e.target.value }))} />
              </div>
            </div>
            {leaveForm.start_date && leaveForm.end_date && (
              <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">{calcDays(leaveForm.start_date, leaveForm.end_date)} day(s) requested</p>
            )}
            {leaveSubmitError && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{leaveSubmitError}</p>
            )}
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Textarea value={leaveForm.reason} onChange={e => setLeaveForm(f => ({ ...f, reason: e.target.value }))} rows={3} placeholder="Optional..." />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setLeaveModalOpen(false); setLeaveSubmitError(null); }}>Cancel</Button>
              <Button disabled={!leaveForm.start_date || !leaveForm.end_date} onClick={submitLeave} className="text-white" style={{ background: "#0F1B2D" }}>Submit Request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}