import { useState } from "react";
import {
  MoreHorizontal,
  Mail,
  Phone,
  Pencil,
  Trash2,
  ExternalLink,
  CheckSquare,
  Square,
  ArrowUpDown,
  Building2,
  MapPin,
  Calendar,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "@/components/ui/StatusBadge";

export default function EmployeeDirectoryTable({
  employees,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onQuickPreview
}) {
  const [sortField, setSortField] = useState("full_name");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    const valA = (a[sortField] || "").toString().toLowerCase();
    const valB = (b[sortField] || "").toString().toLowerCase();
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const allSelected = employees.length > 0 && selectedIds.length === employees.length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
              <th className="py-3.5 px-4 w-10 text-center">
                <button
                  onClick={onSelectAll}
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  title={allSelected ? "Deselect All" : "Select All"}
                >
                  {allSelected ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th
                className="py-3.5 px-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={() => handleSort("full_name")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Employee Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                className="py-3.5 px-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={() => handleSort("department")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Department & Title</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 hidden md:table-cell">Contact & Location</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Employment Type</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {sortedEmployees.map((emp) => {
              const isSelected = selectedIds.includes(emp.id);
              const initials = emp.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <tr
                  key={emp.id}
                  className={`group transition-colors ${
                    isSelected
                      ? "bg-indigo-50/50 dark:bg-indigo-950/30"
                      : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {/* Selection Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onToggleSelect(emp.id)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* Employee Name & Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={createPageUrl("EmployeeProfile", { id: emp.id })}
                          className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block truncate"
                        >
                          {emp.full_name}
                        </Link>
                        <p className="text-[11px] text-slate-400 truncate">ID: {emp.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>

                  {/* Department & Job Title */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{emp.job_title}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                      {emp.department || "General"}
                    </span>
                  </td>

                  {/* Contact & Location */}
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <div className="space-y-0.5 text-slate-500 dark:text-slate-400">
                      <p className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span className="truncate">{emp.email || "N/A"}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{emp.location || "HQ - Austin, TX"}</span>
                      </p>
                    </div>
                  </td>

                  {/* Employment Type */}
                  <td className="py-3.5 px-4 hidden lg:table-cell">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {emp.employment_type || "Full-Time"}
                    </span>
                    <p className="text-[10px] text-slate-400">Hired: {emp.hire_date || "2024-01-15"}</p>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={emp.status || "Active"} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onQuickPreview(emp)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                        title="Quick Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        to={createPageUrl("EmployeeProfile", { id: emp.id })}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                        title="Open 360° Workspace"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onEdit(emp)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                        title="Edit Record"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(emp.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                        title="Delete Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
