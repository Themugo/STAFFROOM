import React from 'react';
import { AlertTriangle, Users, Calendar, ShieldAlert } from 'lucide-react';

/**
 * AbsenceConflictBanner Component
 * Detects departmental absence overlaps (e.g., 2+ employees in the same department
 * on leave simultaneously) and displays actionable conflict warnings.
 */
export default function AbsenceConflictBanner({ requests = [], employees = [] }) {
  // Map employee_id -> department
  const empDeptMap = React.useMemo(() => {
    const map = new Map();
    employees.forEach(e => {
      map.set(e.id, e.department || e.department_name || 'General');
      if (e.full_name) map.set(e.full_name.toLowerCase(), e.department || 'General');
    });
    return map;
  }, [employees]);

  // Find active/pending overlaps grouped by department & date
  const conflicts = React.useMemo(() => {
    const activeRequests = requests.filter(r => r.status === 'Approved' || r.status === 'Pending');
    const dateDeptMap = new Map(); // `${date}_${dept}` -> list of requests

    activeRequests.forEach(req => {
      if (!req.start_date || !req.end_date) return;
      const dept = req.department || empDeptMap.get(req.employee_id) || empDeptMap.get(req.employee_name?.toLowerCase()) || 'General';
      
      const cur = new Date(req.start_date);
      const end = new Date(req.end_date);
      
      while (cur <= end) {
        const dateStr = cur.toISOString().split('T')[0];
        const key = `${dateStr}_${dept}`;
        if (!dateDeptMap.has(key)) {
          dateDeptMap.set(key, { date: dateStr, department: dept, requests: [] });
        }
        const bucket = dateDeptMap.get(key);
        if (!bucket.requests.some(r => r.id === req.id)) {
          bucket.requests.push(req);
        }
        cur.setDate(cur.getDate() + 1);
      }
    });

    // Filter buckets that have 2 or more distinct employees absent
    const overlapList = [];
    dateDeptMap.forEach(item => {
      if (item.requests.length >= 2) {
        overlapList.push(item);
      }
    });

    // Sort by date ascending
    overlapList.sort((a, b) => a.date.localeCompare(b.date));
    return overlapList;
  }, [requests, empDeptMap]);

  if (conflicts.length === 0) return null;

  // Group by department for summary
  const deptSummary = new Map();
  conflicts.forEach(c => {
    if (!deptSummary.has(c.department)) {
      deptSummary.set(c.department, { dates: new Set(), employees: new Set() });
    }
    const info = deptSummary.get(c.department);
    info.dates.add(c.date);
    c.requests.forEach(r => info.employees.add(r.employee_name));
  });

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/90 dark:bg-amber-950/30 dark:border-amber-800/60 p-4 shadow-sm animate-fade-in space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Departmental Absence Overlap Warning
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {conflicts.length} date instances detected where 2+ team members are concurrently on leave.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-200/80 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200">
          Capacity Risk
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {Array.from(deptSummary.entries()).map(([dept, info]) => (
          <div key={dept} className="rounded-xl bg-white/80 dark:bg-slate-900/60 border border-amber-200/60 dark:border-amber-800/40 p-2.5 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100 mb-1">
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-amber-600 dark:text-amber-400" />
                {dept} Department
              </span>
              <span className="text-[11px] font-normal text-amber-700 dark:text-amber-400">
                {info.dates.size} day{info.dates.size !== 1 ? 's' : ''} affected
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Overlapping Staff: <span className="text-slate-900 dark:text-white">{Array.from(info.employees).join(', ')}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
