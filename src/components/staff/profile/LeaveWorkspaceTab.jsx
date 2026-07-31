import { useState } from "react";
import { Palmtree, Plus, CheckCircle2, Clock, Calendar, AlertCircle } from "lucide-react";

export function LeaveWorkspaceTab({ leaveRequests = [], onApplyLeave }) {
  const [requests, setRequests] = useState(leaveRequests || []);
  const [applyModal, setApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState("Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    const newReq = {
      id: `lve_${Date.now()}`,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      status: "Pending",
      reason: reason || "Personal time off",
      created_at: new Date().toISOString().split("T")[0],
    };
    setRequests((prev) => [newReq, ...prev]);
    setApplyModal(false);
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  return (
    <div className="space-y-6">
      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>ANNUAL LEAVE</span>
            <span className="text-emerald-600 font-extrabold">18 Available</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[70%]" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">7 Days Used • 25 Days Total</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>SICK LEAVE</span>
            <span className="text-sky-600 font-extrabold">10 Available</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-sky-500 h-full w-[100%]" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">0 Days Used • 10 Days Total</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>COMPASSIONATE / OTHER</span>
            <span className="text-amber-600 font-extrabold">5 Available</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[100%]" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Fully Intact Balance</p>
        </div>
      </div>

      {/* Requests & History */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Palmtree className="w-4 h-4 text-emerald-500" />
            Leave History & Pending Requests
          </h3>
          <button
            onClick={() => setApplyModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-indigo-200 dark:shadow-none transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {requests.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No leave requests found.</p>
          ) : (
            requests.map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-slate-100">{r.leave_type}</p>
                  <p className="text-slate-400 text-[11px]">
                    {r.start_date} to {r.end_date} • {r.reason}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    r.status === "Approved"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : r.status === "Pending"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Apply Leave Modal */}
      {applyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Submit Leave Request</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Parental Leave">Parental Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Reason / Notes</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide context for manager approval..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
