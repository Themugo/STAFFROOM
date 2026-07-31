import { ShieldAlert, Clock, User, FileText } from "lucide-react";

export function AuditLogTab() {
  const auditLogs = [
    { id: "au_1", actor: "System Admin (Auto)", date: "2026-07-31 09:12:04", field: "Leave Balance", oldVal: "19 Days", newVal: "18 Days", reason: "Annual Leave Approved" },
    { id: "au_2", actor: "Sarah Jenkins (VP HR)", date: "2026-01-15 14:30:00", field: "Base Salary", oldVal: "$87,550", newVal: "$95,000", reason: "Annual Performance Merit Raise" },
    { id: "au_3", actor: "IT Operations", date: "2024-01-15 10:00:00", field: "Hardware Asset", oldVal: "None", newVal: "MacBook Pro 16 M3", reason: "Initial Onboarding Device Allocation" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-indigo-500" />
          Profile Audit Log & Immutable History
        </h3>
        <span className="text-xs text-slate-400 font-semibold">SOX & GDPR Compliant</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Modified By</th>
              <th className="py-2.5 px-3">Attribute</th>
              <th className="py-2.5 px-3">Old Value</th>
              <th className="py-2.5 px-3">New Value</th>
              <th className="py-2.5 px-3">Audit Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{log.date}</td>
                <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">{log.actor}</td>
                <td className="py-3 px-3 font-semibold text-indigo-600 dark:text-indigo-400">{log.field}</td>
                <td className="py-3 px-3 text-slate-400 line-through">{log.oldVal}</td>
                <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">{log.newVal}</td>
                <td className="py-3 px-3 text-slate-500 italic">{log.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
