import React from 'react';
import { Building2, Filter, Check, ChevronDown, ShieldAlert, Sparkles } from 'lucide-react';
import { useDepartment } from '../../contexts/DepartmentContext';

export function DepartmentSelector({ compact = false, className = '' }) {
  const {
    departments,
    activeDepartmentId,
    setActiveDepartmentId,
    userDepartment,
    isDepartmentScoped,
    isElevatedRole,
    strictScopeEnforcement
  } = useDepartment();

  const activeDeptObj = departments.find((d) => d.id === activeDepartmentId);

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <div className="flex items-center gap-1.5">
        <div className="relative group">
          <select
            value={activeDepartmentId}
            onChange={(e) => setActiveDepartmentId(e.target.value)}
            disabled={strictScopeEnforcement && !isElevatedRole}
            className={`
              appearance-none cursor-pointer text-xs font-semibold rounded-2xl py-1.5 pl-8 pr-8 transition-all
              border focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${isDepartmentScoped
                ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }
            `}
            title={
              strictScopeEnforcement && !isElevatedRole
                ? `Locked to assigned workspace: ${userDepartment?.name}`
                : 'Filter workspace by department_id'
            }
          >
            <option value="ALL">All Workspaces (Global Scope)</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.code} - {dept.name} ({dept.memberCount} members)
              </option>
            ))}
          </select>

          {/* Icon Prefix */}
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500 dark:text-indigo-400">
            {isDepartmentScoped ? (
              <Building2 size={14} className="text-indigo-600 dark:text-indigo-400" />
            ) : (
              <Filter size={14} className="text-slate-400" />
            )}
          </div>

          {/* Chevron Icon */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown size={12} />
          </div>
        </div>

        {/* Active Filter Scope Badge indicator */}
        {isDepartmentScoped && !compact && (
          <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Sparkles size={10} />
            Scoped to {activeDeptObj?.code || 'Dept'}
          </span>
        )}
      </div>
    </div>
  );
}

export default DepartmentSelector;
