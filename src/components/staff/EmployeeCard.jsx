import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Pencil, Trash2, User } from "lucide-react";

const statusColors = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "On Leave": "bg-amber-50 text-amber-700 border-amber-200",
  Terminated: "bg-red-50 text-red-700 border-red-200",
};

const deptColors = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-cyan-100 text-cyan-700",
  "bg-teal-100 text-teal-700",
  "bg-rose-100 text-rose-700",
];

export default function EmployeeCard({ employee, onEdit, onDelete }) {
  const initials = employee.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const deptColor = deptColors[employee.department?.length % deptColors.length] || deptColors[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {employee.avatar_url ? (
            <img src={employee.avatar_url} alt={employee.full_name} className="w-11 h-11 rounded-xl object-cover" />
          ) : (
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #0F1B2D, #1A2D45)" }}>
              {initials || <User className="w-4 h-4" />}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 text-sm">{employee.full_name}</p>
            <p className="text-xs text-gray-500">{employee.job_title}</p>
          </div>
        </div>
        <Badge className={`text-xs border ${statusColors[employee.status] || statusColors.Active}`}>
          {employee.status || "Active"}
        </Badge>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${deptColor}`}>
          {employee.department}
        </span>
        <span className="text-xs text-gray-400">{employee.employment_type}</span>
      </div>

      <div className="space-y-1.5 mb-4">
        {employee.email && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Mail className="w-3 h-3" />
            <span className="truncate">{employee.email}</span>
          </div>
        )}
        {employee.phone && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Phone className="w-3 h-3" />
            <span>{employee.phone}</span>
          </div>
        )}
      </div>

      {employee.base_salary && (
        <div className="border-t border-gray-50 pt-3 mb-3">
          <p className="text-xs text-gray-400">Base Salary</p>
          <p className="text-sm font-semibold text-gray-800">
            ${employee.base_salary.toLocaleString()}<span className="text-xs text-gray-400 font-normal">/yr</span>
          </p>
        </div>
      )}

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => onEdit(employee)}>
          <Pencil className="w-3 h-3 mr-1" /> Edit
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:border-red-200"
          onClick={() => onDelete(employee.id)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}