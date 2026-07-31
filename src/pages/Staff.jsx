import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  Plus,
  Search,
  Filter,
  Sparkles,
  LayoutGrid,
  List,
  Download,
  Upload,
  UserPlus,
  CheckSquare,
  Square,
  X,
  Mail,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  FileSpreadsheet
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import EmployeeCard from "@/components/staff/EmployeeCard";
import EmployeeDirectoryTable from "@/components/staff/EmployeeDirectoryTable";
import EmployeeQuickPreviewDrawer from "@/components/staff/EmployeeQuickPreviewDrawer";
import OnboardingModal from "@/components/staff/OnboardingModal";
import AiChatPanel from "@/components/shared/AiChatPanel";

const DEPARTMENTS = ["All", "Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Design", "Legal", "Executive"];
const STATUSES = ["All", "Active", "On Leave", "Terminated"];
const LOCATIONS = ["All", "HQ - Austin, TX", "London, UK", "Singapore", "Remote"];
const EMPLOYMENT_TYPES = ["All", "Full-Time", "Part-Time", "Contractor", "Intern"];

const SAVED_VIEWS = [
  { id: "all_active", label: "All Active Staff", dept: "All", status: "Active" },
  { id: "eng_team", label: "Engineering Team", dept: "Engineering", status: "All" },
  { id: "on_leave", label: "On Leave Today", dept: "All", status: "On Leave" },
];

export default function Staff() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Filters & Views
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [empTypeFilter, setEmpTypeFilter] = useState("All");
  const [activeSavedView, setActiveSavedView] = useState("all_active");

  // View Mode: 'grid' or 'table'
  const [viewMode, setViewMode] = useState("table");

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals & Panels
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [quickPreviewEmp, setQuickPreviewEmp] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);

  const loadData = async () => {
    setLoadError(null);
    try {
      const data = await base44.entities.Employee.list("-created_date");
      setEmployees(data || []);
    } catch {
      setLoadError("Failed to load employee directory. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplySavedView = (view) => {
    setActiveSavedView(view.id);
    setDeptFilter(view.dept);
    setStatusFilter(view.status);
  };

  const filtered = employees.filter((e) => {
    const matchSearch =
      !search ||
      e.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      e.job_title?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || e.department === deptFilter;
    const matchStatus = statusFilter === "All" || (e.status || "Active") === statusFilter;
    const matchLocation = locationFilter === "All" || (e.location || "HQ - Austin, TX") === locationFilter;
    const matchEmpType = empTypeFilter === "All" || (e.employment_type || "Full-Time") === empTypeFilter;

    return matchSearch && matchDept && matchStatus && matchLocation && matchEmpType;
  });

  // Selection Handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((e) => e.id));
    }
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await base44.entities.Employee.update(editing.id, data);
      } else {
        await base44.entities.Employee.create(data);
      }
      setModalOpen(false);
      setEditing(null);
      loadData();
    } catch {
      alert("Failed to save employee record.");
    }
  };

  const handleEdit = (emp) => {
    setEditing(emp);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employee record?")) return;
    try {
      await base44.entities.Employee.delete(id);
      loadData();
    } catch {
      alert("Failed to delete employee record.");
    }
  };

  // Export Selected to CSV
  const handleExportCSV = () => {
    const listToExport = selectedIds.length > 0 ? employees.filter((e) => selectedIds.includes(e.id)) : filtered;
    const headers = ["ID", "Full Name", "Email", "Job Title", "Department", "Status", "Hire Date", "Base Salary"];
    const csvRows = [
      headers.join(","),
      ...listToExport.map((e) =>
        [e.id, `"${e.full_name}"`, e.email, `"${e.job_title}"`, e.department, e.status, e.hire_date, e.base_salary].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `staffroom_directory_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <PageHeader
        title="Staff Directory & Roster"
        description="Comprehensive enterprise workforce directory, role management, and organizational intelligence."
        badge={`${employees.length} Total Workforce`}
        icon={UserPlus}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setAiOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-xs hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>HR Assistant</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>
        }
      />

      {loadError && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-4 text-xs font-bold text-rose-700 dark:text-rose-300">
          {loadError}
        </div>
      )}

      {/* Saved Views Bar */}
      <div className="flex items-center gap-2 pb-1 overflow-x-auto custom-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">Saved Views:</span>
        {SAVED_VIEWS.map((view) => (
          <button
            key={view.id}
            onClick={() => handleApplySavedView(view)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeSavedView === view.id
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Search & Advanced Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by full name, job title, email, or employee ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setActiveSavedView(null);
              }}
              className="px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  Dept: {d}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setActiveSavedView(null);
              }}
              className="px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 hidden sm:block"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  Location: {l}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
                title="Data Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions Banner */}
        {selectedIds.length > 0 && (
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                {selectedIds.length}
              </span>
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                {selectedIds.length} employee{selectedIds.length > 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                Export Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="p-1 text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200 cursor-pointer"
                title="Deselect All"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Roster View */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Loading employee directory...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto my-8">
          <SlidersHorizontal className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">No Matching Employees</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search query to find staff members.</p>
          <button
            onClick={() => {
              setSearch("");
              setDeptFilter("All");
              setStatusFilter("All");
              setLocationFilter("All");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === "table" ? (
        <EmployeeDirectoryTable
          employees={filtered}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onQuickPreview={setQuickPreviewEmp}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Add / Edit Onboarding Modal */}
      <OnboardingModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        employee={editing}
      />

      {/* Quick Preview Drawer */}
      <EmployeeQuickPreviewDrawer
        employee={quickPreviewEmp}
        onClose={() => setQuickPreviewEmp(null)}
        onEdit={handleEdit}
      />

      {/* AI HR Policy Assistant Drawer */}
      {aiOpen && (
        <AiChatPanel
          agentName="hr_policy_assistant"
          title="HR Policy Assistant"
          subtitle="AI-powered HR guidance & policy answers"
          suggestions={[
            "What documents are required for new hires?",
            "How should I handle a performance issue?",
            "What is the probation period policy?",
            "Check for employees with missing documents",
          ]}
          onClose={() => setAiOpen(false)}
        />
      )}
    </div>
  );
}
